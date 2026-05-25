import { Controller, Get, Param, Query } from '@nestjs/common';
import { ListJobsQueryDto } from './dto/list-jobs-query.dto';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  findAll(@Query() query: ListJobsQueryDto) {
    return this.jobsService.findPublished(query);
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.jobsService.findPublishedBySlug(slug);
  }
}
