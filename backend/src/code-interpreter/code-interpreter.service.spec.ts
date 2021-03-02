import { Test, TestingModule } from '@nestjs/testing';
import { CodeInterpreterService } from './code-interpreter.service';

describe('CodeInterpreterService', () => {
  let service: CodeInterpreterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CodeInterpreterService],
    }).compile();

    service = module.get<CodeInterpreterService>(CodeInterpreterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
