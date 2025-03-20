import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemResponse } from 'src/item-responses/item-response.entity';
import { ItemResponsesService } from 'src/item-responses/item-responses.service';
import { ItemsService } from 'src/items/items.service';
import { TestApplication } from 'src/test-applications/test-application.entity';
import { TestItem } from 'src/tests/test-item.entity';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import {
  DeleteResult,
  EntityManager,
  In,
  IsNull,
  Repository,
  UpdateResult,
} from 'typeorm';
import ParticipationCount from './participation.count.dto';
import Participation from './participation.entity';
import PreparedParticipation from './prepared-participation.dto';

@Injectable()
export class ParticipationService {
  constructor(
    @InjectRepository(Participation)
    private participationRepository: Repository<Participation>,
    @InjectRepository(TestItem)
    private testItemRepository: Repository<TestItem>,
    private itemResponseService: ItemResponsesService,
    private itemService: ItemsService,
    private userService: UsersService,
    private entityManager: EntityManager,
    private configService: ConfigService,
  ) {}

  async countParticipations(groupId: number): Promise<number> {
    const count = await this.participationRepository
      .createQueryBuilder('participation')
      .innerJoin('participation.itemResponses', 'itemResponse')
      .leftJoinAndSelect('participation.application', 'application')
      .leftJoinAndSelect('application.test', 'test')
      .leftJoinAndSelect('test.researchGroup', 'researchGroup')
      .where('researchGroup.id = :id', { id: groupId })
      .getCount();
    return count;
  }

  async getParticipationsPerTime(payload: {
    researchGroupId: number;
    testId: number;
  }): Promise<ParticipationCount> {
    let whereTestId = '';
    if (payload.testId) {
      whereTestId = ' and "testId" = $2';
    }
    const sql = `
        select 
            count(*),
            extract(day from participation."createdAt") as day,
            extract(month from participation."createdAt") as month,
            extract(year from participation."createdAt") as year 
        from
            participation
        where
            participation."deletedAt" is null
            and (select count(*) from item_response where "participationId" = participation.id) > 0
            and participation."applicationId" in (
                select 
                    id 
                from 
                    test_application 
                where 
                    "testId" in (select id from test where "researchGroupId" = $1)
                    ${whereTestId}
            )
        group by 
            day, month, year
        order by 
            year, month, day;`;
    const queryParams = [payload.researchGroupId];
    if (whereTestId) {
      queryParams.push(payload.testId);
    }
    const result = await this.entityManager.query(sql, queryParams);
    return result;
  }

  async saveSource(
    participationId: number,
    source: string,
  ): Promise<UpdateResult> {
    return this.participationRepository.update(
      { id: participationId },
      { source },
    );
  }

  saveUserData(userHash: string, user: any): Promise<any> {
    return this.userService.saveData(userHash, user);
  }

  async countByTestApplication(application: TestApplication): Promise<number> {
    return this.participationRepository
      .createQueryBuilder('participation')
      .innerJoin('participation.itemResponses', 'itemResponse')
      .where('participation.application = :application', {
        application: application.id,
      })
      .getCount();
  }

  async saveProgress(participation: Participation) {
    const id = participation.id;
    const part = await this.participationRepository.findOne({
      where: [{ id }],
    });
    if (part) {
      part.lastVisitedItemId = participation.lastVisitedItemId;
      this.participationRepository.update({ id }, part);
    }
  }

  async recalculateAllResponseItems(participationId: number): Promise<any> {
    const participation = await this.getById(participationId);
    await Promise.all(
      participation.itemResponses.map(async (itemResponse) => {
        const score = await this.itemResponseService.calculateScore(
          itemResponse,
        );
        itemResponse.score = score;
      }),
    );
    return this.participationRepository.save(participation);
  }

  recalculateAllResponseEscores(
    itemResponses: ItemResponse[],
  ): Promise<ItemResponse[]> {
    return this.itemResponseService.calculateScores(itemResponses);
  }

  getById(id: number): Promise<Participation> {
    return this.participationRepository
      .createQueryBuilder('participation')
      .leftJoinAndSelect('participation.application', 'application')
      .leftJoinAndSelect('application.test', 'test')
      .leftJoinAndSelect('participation.user', 'user')
      .innerJoinAndSelect('participation.itemResponses', 'itemResponse')
      .orderBy('itemResponse.createdAt', 'DESC')
      .leftJoinAndSelect('itemResponse.testItem', 'testItem')
      .leftJoinAndSelect('itemResponse.score', 'score')
      .leftJoinAndSelect('testItem.item', 'item')
      .where({ id })
      .getOne();
  }

  async saveResponse(participationId: number, itemId: number, response: any) {
    const testItem = await this.testItemRepository
      .createQueryBuilder('testItem')
      .leftJoinAndSelect('testItem.item', 'item')
      .where({ id: itemId })
      .getOne();

    const participation = await this.participationRepository
      .createQueryBuilder('participation')
      .leftJoinAndSelect('participation.itemResponses', 'itemResponse')
      .leftJoinAndSelect('itemResponse.testItem', 'testItem')
      .where({ id: participationId })
      .getOne();

    let itemResponse = participation.itemResponses.find(
      (itemResponse) => itemResponse.testItem.id == testItem.id,
    );
    if (!itemResponse) {
      itemResponse = new ItemResponse();
      participation.addResponse(itemResponse);
    }

    itemResponse.testItem = testItem;
    itemResponse.response = JSON.stringify(response);
    itemResponse.score = await this.itemResponseService.calculateScore(
      itemResponse,
    );
    //participation.lastVisitedItemWasFinished = true;
    this.participationRepository.save(participation);

    const items = participation.test.items;
    const index = items.indexOf(items.find((i) => i.id == itemId));
    const nextItem = items[index + 1];

    if (!nextItem) {
      this.finishParticipation(participation);
    }
    return {
      next: nextItem?.url,
    };
  }

  finishParticipation(participation: Participation) {
    participation.finishedAt = new Date();
    this.save(participation);
  }

  save(participation: Participation): Promise<Participation> {
    return this.participationRepository.save(participation);
  }

  async saveAndConfigureItems(
    participation: Participation,
  ): Promise<Participation> {
    return this.setupItems(await this.save(participation));
  }

  private setupItems(participation: Participation) {
    const items = participation.application.test.items;
    if (!items) return;
    participation.test = {
      items: items.map((testItem, index) => {
        const baseUrl = testItem.item.mechanic.baseUrl;
        return {
          id: testItem.id,
          url: this.buildItemUrl(baseUrl, participation.id, testItem.id),
          progress: `${index + 1}/${items.length}`,
        };
      }),
    };
    return this.save(participation);
  }

  private buildItemUrl(
    baseUrl: string,
    participationId: number,
    testItemId: number,
  ): string {
    const apiUrl = this.configService.get('API_URL');
    const urlToInstantiateItem = `${apiUrl}/participations/public/instantiate/${participationId}/${testItemId}`;
    return `${baseUrl}?op=play&urlToInstantiateItem=${urlToInstantiateItem}`;
  }

  softDeleteById(id: number): Promise<DeleteResult> {
    return this.participationRepository.softDelete({ id });
  }

  restore(id: number): Promise<any> {
    return this.participationRepository.restore({ id });
  }

  getNonFinishedParticipation(
    testApplication: TestApplication,
    controlGroupApplication: TestApplication,
    user: User,
  ): Promise<Participation> {
    const ids = [testApplication.id, controlGroupApplication?.id];
    return this.participationRepository
      .createQueryBuilder('participation')
      .leftJoinAndSelect('participation.itemResponses', 'itemResponse')
      .leftJoinAndSelect('itemResponse.testItem', 'testItem')
      .where({
        application: { id: In(ids) },
        user: user,
        finishedAt: IsNull(),
      })
      .orderBy('participation.id', 'DESC')
      .getOne();
  }

  async getPreparedParticipation(
    participationId: number,
    testItemId: number,
  ): Promise<PreparedParticipation> {
    const participation = await this.participationRepository
      .createQueryBuilder('participation')
      .where({ id: participationId })
      .getOne();
    return this.buildUrls(participation, testItemId);
  }

  buildUrls(
    participation: Participation,
    testItemId: number,
  ): PreparedParticipation {
    const apiUrl = this.configService.get('API_URL');
    const siteUrl = this.configService.get('SITE_URL');
    const urlToSendResponses = `${apiUrl}/participations/public/respond/${participation.id}/${testItemId}`;

    const preparedParticipation = {
      participationId: participation.id,
      test: participation.test,
      urlToSendResponses: {
        method: 'POST',
        url: urlToSendResponses,
        help: `Envie as respostas em formato JSON e de acordo com a classe de respostas definida na mecânica de cada item.`,
      },
      urlToEndOfTestQuiz: {
        url: `${siteUrl}/quiz/${participation.id}`,
        help: 'Abra essa url quando o usuário finalizar o teste ou desistir!',
      },
    } as unknown as PreparedParticipation;

    return preparedParticipation;
  }

  async instantiateParticipationItem(
    participationId: number,
    testItemId: number,
  ): Promise<{
    json: string;
    participation: PreparedParticipation;
    progress: string;
  }> {
    const testItem = await this.testItemRepository
      .createQueryBuilder('testItem')
      .leftJoinAndSelect('testItem.item', 'item')
      .where({ id: testItemId })
      .getOne();
    const participation = await this.getPreparedParticipation(
      participationId,
      testItem.id,
    );
    const item = participation.test.items.find((i) => i.id == testItemId);
    return {
      json: await this.itemService.instantiateToGetJson(testItem.item.id),
      participation: participation,
      progress: `Fase ${item.progress}`,
    };
  }
}
