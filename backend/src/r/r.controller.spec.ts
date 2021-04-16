import { Test, TestingModule } from '@nestjs/testing';
import { RController } from './r.controller';

describe('RController', () => {
  let controller: RController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RController],
    }).compile();

    controller = module.get<RController>(RController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
