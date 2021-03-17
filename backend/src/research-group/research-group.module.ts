import { Module } from '@nestjs/common';
import { ResearchGroupService } from './research-group.service';

@Module({
  providers: [ResearchGroupService]
})
export class ResearchGroupModule {}
