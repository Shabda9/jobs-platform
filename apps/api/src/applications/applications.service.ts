import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApplicationStatus, JobStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createForJob(jobId: string, dto: CreateApplicationDto) {
    await this.assertJobAcceptsApplications(jobId);

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
      },
      select: { id: true },
    });

    return {
      message: 'Application submitted successfully',
      applicationId: application.id,
    };
  }

  private async assertJobAcceptsApplications(jobId: string): Promise<void> {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      select: { id: true, status: true, expiresAt: true },
    });

    if (!job) {
      throw new NotFoundException(`Job "${jobId}" not found`);
    }

    if (job.status !== JobStatus.published) {
      throw new BadRequestException('This job is not accepting applications');
    }

    const now = new Date();
    if (job.expiresAt && job.expiresAt <= now) {
      throw new BadRequestException('This job has expired');
    }
  }
}
