import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApplicationStatus, JobStatus } from '@prisma/client';
import { FilesService } from '../files/files.service';
import type { ResumeUploadFile } from '../files/types/resume-upload-file';
import { PrismaService } from '../prisma/prisma.service';
import { APPLICATION_MESSAGES } from './applications.messages';
import { CreateApplicationDto } from './dto/create-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService,
  ) {}

  /**
   * Full candidate application: validate job, upload private resume, create Application.
   */
  async createForJob(
    jobId: string,
    dto: CreateApplicationDto,
    resume: ResumeUploadFile,
  ) {
    await this.assertJobAcceptsApplications(jobId);

    const uploaded = await this.filesService.uploadResume(resume);

    try {
      const application = await this.prisma.application.create({
        data: {
          jobId,
          fullName: dto.fullName.trim(),
          email: dto.email.trim().toLowerCase(),
          phone: dto.phone?.trim() || null,
          coverMessage: dto.coverMessage?.trim() || null,
          availability: dto.availability?.trim() || null,
          workRights: dto.workRights?.trim() || null,
          experienceSummary: dto.experienceSummary?.trim() || null,
          licenceOrCertificate: dto.licenceOrCertificate?.trim() || null,
          status: ApplicationStatus.new,
          resumeFileId: uploaded.fileId,
        },
        select: { id: true },
      });

      return {
        message: APPLICATION_MESSAGES.submitSuccess,
        applicationId: application.id,
      };
    } catch (error) {
      await this.filesService.deleteUploadedResume(uploaded.fileId);
      throw error;
    }
  }

  private async assertJobAcceptsApplications(jobId: string): Promise<void> {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      select: { id: true, status: true, expiresAt: true },
    });

    if (!job) {
      throw new NotFoundException({
        message: APPLICATION_MESSAGES.jobNotFound,
        errors: [APPLICATION_MESSAGES.jobNotFound],
      });
    }

    if (job.status !== JobStatus.published) {
      throw new BadRequestException({
        message: APPLICATION_MESSAGES.jobNotPublished,
        errors: [APPLICATION_MESSAGES.jobNotPublished],
      });
    }

    const now = new Date();
    if (job.expiresAt && job.expiresAt <= now) {
      throw new BadRequestException({
        message: APPLICATION_MESSAGES.jobExpired,
        errors: [APPLICATION_MESSAGES.jobExpired],
      });
    }
  }
}
