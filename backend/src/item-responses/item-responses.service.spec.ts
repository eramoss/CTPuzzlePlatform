import { Test, TestingModule } from '@nestjs/testing';
import { ItemResponsesService } from './item-responses.service';

describe('ItemResponsesService', () => {
  let service: ItemResponsesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemResponsesService],
    }).compile();

    service = module.get<ItemResponsesService>(ItemResponsesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
