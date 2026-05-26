import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RESUME_MAX_BYTES } from '../files/files.constants';
import { APPLICATION_MESSAGES } from './applications.messages';
import { ApplicationsService } from './applications.service';
import { parseCreateApplicationBody } from './parse-create-application-body';
import { toResumeUploadFile } from './to-resume-upload-file';

@Controller('jobs')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  /**
   * Submit a candidate application with resume (multipart/form-data).
   * Text fields + file field `resume` (PDF, DOC, DOCX, max 5MB).
   */
  @Post(':id/applications')
  @UseInterceptors(
    FileInterceptor('resume', {
      limits: { fileSize: RESUME_MAX_BYTES },
    }),
  )
  async create(
    @Param('id') jobId: string,
    @Body() body: Record<string, unknown>,
    @UploadedFile() resume?: Express.Multer.File,
  ) {
    const dto = await parseCreateApplicationBody(body);

    if (!resume) {
      throw new BadRequestException({
        message: APPLICATION_MESSAGES.resumeRequired,
        errors: [APPLICATION_MESSAGES.resumeRequired],
      });
    }

    return this.applicationsService.createForJob(
      jobId,
      dto,
      toResumeUploadFile(resume),
    );
  }
}
