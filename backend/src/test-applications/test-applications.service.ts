import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemResponse } from 'src/item-responses/item-response.entity';
import { Mechanic } from 'src/mechanics/mechanic.entity';
import { PageRequest } from 'src/pagination/pagerequest.dto';
import { PageResponse } from 'src/pagination/pageresponse.dto';
import Participation from 'src/participation/participation.entity';
import { ParticipationService } from 'src/participation/participation.service';
import PreparedParticipation from 'src/participation/prepared-participation.dto';
import { TestItem } from 'src/tests/test-item.entity';
import { Test } from 'src/tests/test.entity';
import { TestService } from 'src/tests/tests.service';
import { User, USER_UUID_TOKEN } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import {
  buildCsv,
  CsvColumnType,
  CsvData,
  CsvHeaderLabel,
} from 'src/util/download';
import { Brackets, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TestApplication } from './test-application.entity';

@Injectable()
export class TestApplicationsService {
  constructor(
    @InjectRepository(TestApplication)
    private testApplicationRepository: Repository<TestApplication>,
    @InjectRepository(ItemResponse)
    private itemResponseRepository: Repository<ItemResponse>,
    private usersService: UsersService,
    private participationService: ParticipationService,
    private testService: TestService,
    private configService: ConfigService,
  ) {}

  async recalculateAllApplicationParticipationScores(
    testApplicationId: number,
  ): Promise<ItemResponse[]> {
    const itemResponses = await this.getAllApplicationItemResponses(
      testApplicationId,
    );
    return this.participationService.recalculateAllResponseEscores(
      itemResponses,
    );
  }

  private async getAllApplicationItemResponses(testApplicationId: number) {
    const testApplication = await this.getById(testApplicationId);
    const itemResponses = new Array<ItemResponse>();
    testApplication.participations.forEach((p) => {
      p.itemResponses.forEach((itemResponse) => {
        itemResponses.push(itemResponse);
      });
    });
    return itemResponses;
  }

  findAll(): Promise<TestApplication[]> {
    return this.testApplicationRepository
      .createQueryBuilder('test-application')
      .orderBy('test-application.createdAt', 'DESC')
      .getMany();
  }

  getPuplicApplications(): Promise<TestApplication[]> {
    return this.testApplicationRepository
      .createQueryBuilder('test-application')
      .leftJoinAndSelect('test-application.test', 'test')
      .leftJoinAndSelect('test.items', 'testItem')
      .leftJoinAndSelect('testItem.item', 'item')
      .orderBy('test-application.createdAt', 'DESC')
      .where("test-application.visibility = 'PUBLIC'")
      .getMany();
  }

  getPuplicApplicationsByMechanicName(
    name: string,
  ): Promise<TestApplication[]> {
    return this.testApplicationRepository
      .createQueryBuilder('test-application')
      .leftJoinAndSelect('test-application.test', 'test')
      .leftJoinAndSelect('test.items', 'testItem')
      .leftJoinAndSelect('testItem.item', 'item')
      .leftJoinAndSelect('item.mechanic', 'mechanic')
      .orderBy('test-application.createdAt', 'DESC')
      .where("test-application.visibility = 'PUBLIC'")
      .andWhere('upper(mechanic.name) like :name', {
        name: `%${name.toUpperCase()}%`,
      })
      .getMany();
  }

  save(testApplication: TestApplication): Promise<TestApplication> {
    return this.testApplicationRepository.save(testApplication);
  }

  updateVisibility(testApplication: TestApplication): Promise<UpdateResult> {
    return this.testApplicationRepository.update(
      { id: testApplication.id },
      {
        visibility: testApplication.visibility,
      },
    );
  }

  async getLastResponse(applicationId: number): Promise<ItemResponse> {
    const itemResponse = await this.itemResponseRepository
      .createQueryBuilder('itemResponse')
      .leftJoinAndSelect('itemResponse.participation', 'participation')
      .leftJoinAndSelect('participation.user', 'user')
      .leftJoinAndSelect('participation.application', 'testApplication')
      .where('testApplication.id = :id', { id: applicationId })
      .andWhere('itemResponse.deletedAt is null')
      .orderBy('itemResponse.createdAt', 'DESC')
      .getOne();
    return itemResponse;
  }

  async getById(id: number): Promise<TestApplication> {
    const testApplication = await this.testApplicationRepository
      .createQueryBuilder('test-application')
      .where({ id })
      .leftJoinAndSelect('test-application.test', 'test')
      .leftJoinAndSelect(
        'test-application.participations',
        'participation',
        `"participation"."deletedAt" is null`,
      )
      .leftJoinAndSelect(
        'test-application.controlApplication',
        'controlApplication',
      )
      .leftJoinAndSelect(
        'participation.itemResponses',
        'itemResponse',
        `"itemResponse"."deletedAt" is null`,
      )
      .leftJoinAndSelect('itemResponse.testItem', 'testItem')
      .leftJoinAndSelect('itemResponse.score', 'score')
      .leftJoinAndSelect('testItem.item', 'item')
      .leftJoinAndSelect('participation.user', 'user')
      .orderBy('itemResponse.createdAt', 'DESC')
      .orderBy('participation.createdAt', 'DESC')
      .withDeleted()
      .getOne();
    return testApplication;
  }

  async generateCsvFromItemResponses(
    testApplicationId: number,
  ): Promise<string> {
    const { labels, rows } = await this.getCsvData(testApplicationId);
    return buildCsv(labels, rows);
  }

  async getCsvData(testApplicationId: number): Promise<CsvData> {
    const testApplication = await this.getById(testApplicationId);
    const rows: any[] = [];
    const responseKeys: string[] = [];
    let userKeys: string[] = [];
    let quizProperties: string[] = [];
    let scoreKeys: string[] = [];
    const labels = [
      { label: 'data', value: 'data' },
      { label: 'usuario', value: 'usuario' },
      { label: 'fonte', value: 'fonte' },
      { label: 'participacao', value: 'participacao_id' },
      { label: 'observacoes', value: 'observacoes' },
      { label: 'item', value: 'item_id' },
      { label: 'order', value: 'item_order' },
      { label: 'tutorial', value: 'tutorial' },
    ] as CsvHeaderLabel[];

    testApplication.participations.forEach((participation: Participation) => {
      if (participation.user.data) {
        userKeys = Object.keys(participation.user.data);
        userKeys.reverse().forEach((key) => {
          if (!labels.some((l) => l.label == key)) {
            labels.splice(1, 0, { label: key, value: key, source: 'userData' });
          }
        });
      }

      if (participation.userDataToRequest) {
        const quizKeys = participation.userDataToRequest.questions.map(
          (q) => q.name,
        );
        quizKeys.reverse().forEach((key) => {
          if (!labels.some((l) => l.label == key)) {
            labels.splice(2, 0, { label: key, value: key, source: 'quiz' });
          }
        });
        if (quizKeys.length > quizProperties.length) {
          quizProperties = quizKeys;
        }
      }
    });

    testApplication.participations.map((participation: Participation) => {
      participation.itemResponses.forEach((itemResponse: ItemResponse) => {
        const row = {
          data: itemResponse.createdAt.toLocaleString(),
          usuario: participation.user.hash,
          fonte: participation.source,
          participacao_id: participation.id,
          item_id: itemResponse.testItem.item.id,
          item_order: itemResponse.testItem.order,
          tutorial: itemResponse.testItem.item.isTutorial ? 'T' : 'F',
          //resposta: itemResponse.response,
          observacoes: participation.observations,
          escore_max: itemResponse.score.max,
          escore_obtido: itemResponse.score.score,
        };
        const responseJson = JSON.parse(itemResponse.response);
        const scoreJson = JSON.parse(itemResponse.score.json);

        Object.keys(responseJson)
          .filter((key) => responseKeys.indexOf(key) == -1)
          .forEach((key) => responseKeys.push(key));

        if (!scoreKeys.length) {
          scoreKeys = Object.keys(scoreJson);
        }

        userKeys.forEach((key: string) => {
          row[key] = participation.user.data[key];
        });
        responseKeys.forEach((key: string) => {
          row[key] = responseJson[key];
        });
        scoreKeys.forEach((key: string) => {
          row[key] = scoreJson[key];
        });
        quizProperties.forEach((key: string) => {
          if (participation.userDataToRequest) {
            row[key] = participation.userDataToRequest.questions.find(
              (q) => q.name == key,
            )?.answer;
          }
        });

        rows.push(row);
      });
    });

    responseKeys.forEach((prop) => {
      labels.push({ label: prop, value: prop, source: 'response' });
    });
    scoreKeys.forEach((prop) => {
      labels.push({ label: prop, value: prop });
    });
    [
      { label: 'escore_max', value: 'escore_max' },
      { label: 'escore_obtido', value: 'escore_obtido' },
    ].forEach((item) => labels.push(item));

    ///^\d*([,.]){0,1}\d+$/.test('12,12')
    const regexMatchNumbers = /^-?\d*[,.]?\d+$/;
    labels.forEach((label) => {
      let type: CsvColumnType = 'number';
      let rowIndex = 0;
      let reachedEnd = false;

      looping_to_check_if_data_rows_are_numbers: while (
        type == 'number' &&
        !reachedEnd
      ) {
        const row = rows[rowIndex];
        if (row == undefined) {
          reachedEnd = true;
          continue looping_to_check_if_data_rows_are_numbers;
        }
        if (row != undefined) {
          const cellValue = row[label.value];
          const match = regexMatchNumbers.test(cellValue);
          if (match) {
            rowIndex++;
            continue looping_to_check_if_data_rows_are_numbers;
          }
          type = 'string';
        }
        if (type == 'string') {
          if (
            testApplication.test.userDataToRequest.some((quizQuestion) => {
              return (
                quizQuestion.name == label.value &&
                quizQuestion.variableType.varType == 'options'
              );
            })
          ) {
            type = 'category';
          }
        }
      }
      label.type = type;
    });

    const csvData = new CsvData();
    csvData.labels = labels;
    csvData.rows = rows;
    return csvData;
  }

  async getByHash(hash: string): Promise<TestApplication> {
    const testApplication = await this.testApplicationRepository
      .createQueryBuilder('test-application')
      .leftJoinAndSelect('test-application.test', 'test')
      .leftJoinAndSelect(
        'test-application.controlApplication',
        'controlApplication',
      )
      .leftJoinAndSelect('test.researchGroup', 'researchGroup')
      .leftJoinAndSelect('test.items', 'testItem')
      .orderBy('testItem.order', 'ASC')
      .leftJoinAndSelect('testItem.item', 'item')
      .leftJoinAndSelect('item.mechanic', 'mechanic')
      .where({ hash })
      .getOne();
    return testApplication;
  }

  softDeleteById(id: number): Promise<DeleteResult> {
    return this.testApplicationRepository.softDelete({ id });
  }

  restore(id: number): Promise<UpdateResult> {
    return this.testApplicationRepository.restore({ id });
  }

  async paginate(
    pageRequest: PageRequest,
  ): Promise<PageResponse<TestApplication>> {
    const where = pageRequest.filter;
    const searchLike = {
      search: `%${pageRequest.search.toString().toUpperCase()}%`,
    };
    const data = await this.testApplicationRepository
      .createQueryBuilder('test-application')
      .leftJoinAndSelect('test-application.test', 'test')
      .leftJoinAndSelect(
        'test-application.controlApplication',
        'controlApplication',
      )
      .skip(pageRequest.start)
      .take(pageRequest.limit)
      .where(where)
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            'upper(test-application.name) like :search',
            searchLike,
          ).orWhere('upper(test.name) like :search', searchLike);
        }),
      )
      .andWhere(pageRequest.andWhere)
      .orderBy('test-application.id', 'DESC')
      .getMany();
    await Promise.all(
      data.map(async (application) => {
        const count = await this.participationService.countByTestApplication(
          application,
        );
        application.countParticipations = count;
      }),
    );
    return new PageResponse(data);
  }

  async getApplicationData(
    applicationHash: string,
    userHash: string,
  ): Promise<PreparedParticipation> {
    const user = new User();
    user.hash = userHash;

    if (userHash == USER_UUID_TOKEN) {
      userHash = uuidv4().substring(0, 7);
      console.warn(
        'The puzzle forgot to replace the user token with a random unique id value!!',
      );
    }

    const participation = await this.participateInTheTest(
      applicationHash,
      user,
    );

    return { test: participation.test };
  }

  getUndoneItem(participation: Participation): TestItem {
    const test = Object.assign(new Test(), participation.test);
    const itemWithResponsesIds = participation.itemResponses.map(
      (itemResponse) => itemResponse.testItem.id,
    );
    const itemsWithoutResponses = test.items.filter(
      (testItem) => itemWithResponsesIds.indexOf(testItem.id) == -1,
    );
    const nextItem = itemsWithoutResponses[0];
    return nextItem;
  }

  async participateInTheTest(
    testApplicationHash: string,
    user: User,
  ): Promise<Participation> {
    if (!user.password) user.password = user.hash;
    if (!user.name) user.name = user.hash;
    if (!user.email) user.email = user.hash + '@mail.com';

    let testApplication: TestApplication = await this.getByHash(
      testApplicationHash,
    );
    let controlGroupApplication = testApplication.controlApplication;
    if (controlGroupApplication) {
      controlGroupApplication = await this.getByHash(
        controlGroupApplication.hash,
      );
    }

    const savedUser = await this.usersService.saveOrGetByHash(user);
    if (!savedUser.researchGroup) {
      this.usersService.setResearchGroup(
        savedUser,
        testApplication.test.researchGroup,
      );
    }

    let participation =
      await this.participationService.getNonFinishedParticipation(
        testApplication,
        controlGroupApplication,
        savedUser,
      );
    if (!participation) {
      participation = new Participation();
      if (controlGroupApplication) {
        if (Math.random() > 0.5) {
          participation.usesControlGroup = true;
        }
      }
    }

    if (participation.usesControlGroup) {
      testApplication = controlGroupApplication;
    }

    participation.user = savedUser;
    participation.application = testApplication;
    return this.participationService.saveAndConfigureItems(participation);
  }
}
