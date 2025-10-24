import { Module } from '@nestjs/common';
import { EmployabilityService } from './employability.service';
import { EmployabilityController } from './employability.controller';

@Module({
  providers: [EmployabilityService],
  controllers: [EmployabilityController]
})
export class EmployabilityModule {}
