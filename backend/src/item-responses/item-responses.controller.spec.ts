import { Test, TestingModule } from '@nestjs/testing';
import { ItemResponsesController } from './item-responses.controller';

describe('ItemResponsesController', () => {
  let controller: ItemResponsesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemResponsesController],
    }).compile();

    controller = module.get<ItemResponsesController>(ItemResponsesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
