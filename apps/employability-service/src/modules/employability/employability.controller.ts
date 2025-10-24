import { Controller, Get, Param } from '@nestjs/common';
import { EmployabilityService } from './employability.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('employability')
@ApiBearerAuth()
@Controller('employability')
export class EmployabilityController {
  constructor(private readonly service: EmployabilityService) {}

  @Get('users/:id/scores')
  list(@Param('id') id: string) { return this.service.listUserScores(id); }
}
