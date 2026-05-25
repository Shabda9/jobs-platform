import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { publicJobWhere } from '../common/jobs/public-job.where';
import { PrismaService } from '../prisma/prisma.service';
import { ListJobsQueryDto } from './dto/list-jobs-query.dto';

const jobListSelect = {
  id: true,
  title: true,
  slug: true,
  location: true,
  employmentType: true,
  salaryText: true,
  publishedAt: true,
  company: { select: { name: true } },
  category: { select: { name: true } },
} satisfies Prisma.JobSelect;

const jobDetailSelect = {
  id: true,
  title: true,
  slug: true,
  location: true,
  employmentType: true,
  salaryMin: true,
  salaryMax: true,
  salaryText: true,
  description: true,
  responsibilities: true,
  requirements: true,
  benefits: true,
  requiredLicenceOrCertificate: true,
  workRightsRequirement: true,
  applicationDeadline: true,
  publishedAt: true,
  expiresAt: true,
  company: { select: { name: true } },
  category: { select: { name: true, slug: true } },
} satisfies Prisma.JobSelect;

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async findPublished(query: ListJobsQueryDto) {
    const jobs = await this.prisma.job.findMany({
      where: this.buildListWhere(query),
      select: jobListSelect,
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    });

    return {
      data: jobs.map((job) => this.toListItem(job)),
    };
  }

  async findPublishedBySlug(slug: string) {
    const job = await this.prisma.job.findFirst({
      where: {
        slug,
        ...publicJobWhere(),
      },
      select: jobDetailSelect,
    });

    if (!job) {
      throw new NotFoundException(`Job "${slug}" not found`);
    }

    return this.toDetail(job);
  }

  private buildListWhere(query: ListJobsQueryDto): Prisma.JobWhereInput {
    const filters: Prisma.JobWhereInput[] = [publicJobWhere()];

    if (query.location?.trim()) {
      filters.push({
        location: { contains: query.location.trim(), mode: 'insensitive' },
      });
    }

    if (query.category?.trim()) {
      filters.push({
        category: {
          slug: query.category.trim(),
          isActive: true,
        },
      });
    }

    if (query.employmentType?.trim()) {
      filters.push({
        employmentType: {
          contains: query.employmentType.trim(),
          mode: 'insensitive',
        },
      });
    }

    if (query.keyword?.trim()) {
      const keyword = query.keyword.trim();
      filters.push({
        OR: [
          { title: { contains: keyword, mode: 'insensitive' } },
          { description: { contains: keyword, mode: 'insensitive' } },
          { location: { contains: keyword, mode: 'insensitive' } },
          {
            company: { name: { contains: keyword, mode: 'insensitive' } },
          },
        ],
      });
    }

    return { AND: filters };
  }

  private toListItem(
    job: Prisma.JobGetPayload<{ select: typeof jobListSelect }>,
  ) {
    return {
      id: job.id,
      title: job.title,
      slug: job.slug,
      companyName: job.company.name,
      location: job.location,
      employmentType: job.employmentType,
      salaryText: job.salaryText,
      category: job.category.name,
      publishedAt: job.publishedAt,
    };
  }

  private toDetail(
    job: Prisma.JobGetPayload<{ select: typeof jobDetailSelect }>,
  ) {
    return {
      id: job.id,
      title: job.title,
      slug: job.slug,
      companyName: job.company.name,
      location: job.location,
      employmentType: job.employmentType,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      salaryText: job.salaryText,
      category: job.category.name,
      categorySlug: job.category.slug,
      description: job.description,
      responsibilities: job.responsibilities,
      requirements: job.requirements,
      benefits: job.benefits,
      requiredLicenceOrCertificate: job.requiredLicenceOrCertificate,
      workRightsRequirement: job.workRightsRequirement,
      applicationDeadline: job.applicationDeadline,
      publishedAt: job.publishedAt,
      expiresAt: job.expiresAt,
    };
  }
}
