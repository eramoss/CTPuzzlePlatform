import { Test, TestingModule } from '@nestjs/testing';
import { ScoreFunctionTestService } from './score-function-test.service';

describe('ScoreFunctionTestService', () => {
  let service: ScoreFunctionTestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScoreFunctionTestService],
    }).compile();

    service = module.get<ScoreFunctionTestService>(ScoreFunctionTestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
