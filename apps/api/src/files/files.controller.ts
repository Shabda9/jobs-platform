import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RESUME_MAX_BYTES } from './files.constants';
import { FilesService } from './files.service';
import type { ResumeUploadFile } from './types/resume-upload-file';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  /**
   * Public upload endpoint for testing resume storage (Part 2).
   * Will be wired into the application flow in a later slice.
   */
  @Post('resume-upload')
  @UseInterceptors(
    FileInterceptor('resume', {
      limits: { fileSize: RESUME_MAX_BYTES },
    }),
  )
  async uploadResume(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(
        'Resume file is required (multipart field name: resume)',
      );
    }

    const payload: ResumeUploadFile = {
      buffer: file.buffer,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };

    const result = await this.filesService.uploadResume(payload);

    return {
      message: 'Resume uploaded successfully',
      ...result,
    };
  }
}
