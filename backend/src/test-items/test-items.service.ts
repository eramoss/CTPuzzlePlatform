import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageRequest } from 'src/pagination/pagerequest.dto';
import { PageResponse } from 'src/pagination/pageresponse.dto';
import { Repository } from 'typeorm';
import { TestItem } from './test-item.entity';

@Injectable()
export class TestItemsService {

  constructor(
    @InjectRepository(TestItem)
    private testItemRepository: Repository<TestItem>) { }

  save(testItem: TestItem): Promise<TestItem> {
    return this.testItemRepository.save(testItem)
  }

  async getById(id: number): Promise<TestItem> {
    let testItem = await this.testItemRepository.findOne({ id }, { relations: ['mechanic'] })
    return testItem;
  }

  removeById(id: number) {
    this.testItemRepository.delete({ id })
  }

  async paginate(pageRequest: PageRequest): Promise<PageResponse<TestItem>> {
    const data = await this.testItemRepository.createQueryBuilder('test-item')
      .skip(pageRequest.start)
      .take(pageRequest.limit)
      .getMany()
    return new PageResponse(data);
  }
}
