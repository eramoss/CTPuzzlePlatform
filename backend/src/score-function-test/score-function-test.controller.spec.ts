import { Test, TestingModule } from '@nestjs/testing';
import { ScoreFunctionTestController } from './score-function-test.controller';

describe('ScoreFunctionTestController', () => {
  let controller: ScoreFunctionTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScoreFunctionTestController],
    }).compile();

    controller = module.get<ScoreFunctionTestController>(ScoreFunctionTestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
