import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';

@Controller('jobs')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post(':id/applications')
  create(
    @Param('id') jobId: string,
    @Body() dto: CreateApplicationDto,
  ) {
    return this.applicationsService.createForJob(jobId, dto);
  }
}
