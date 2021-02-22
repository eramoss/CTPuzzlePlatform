import { Test, TestingModule } from '@nestjs/testing';
import { TestApplicationsController } from './test-applications.controller';

describe('TestApplicationsController', () => {
  let controller: TestApplicationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestApplicationsController],
    }).compile();

    controller = module.get<TestApplicationsController>(TestApplicationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
