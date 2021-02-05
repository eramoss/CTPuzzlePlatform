import { Test, TestingModule } from '@nestjs/testing';
import { GeneratorService } from './generators.service';

describe('GeenratorsService', () => {
  let generatorService: GeneratorService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [GeneratorService],
    }).compile();

    generatorService = app.get<GeneratorService>(GeneratorService);
  });

  describe('root', () => {
    it('should return code with length!"', () => {
      expect(generatorService.generateNumberString(7)).toBeDefined();
    });
  });
});
