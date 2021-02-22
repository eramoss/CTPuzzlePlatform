import { Test, TestingModule } from '@nestjs/testing';
import { TestApplicationsService } from './test-applications.service';

describe('TestApplicationsService', () => {
  let service: TestApplicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestApplicationsService],
    }).compile();

    service = module.get<TestApplicationsService>(TestApplicationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
