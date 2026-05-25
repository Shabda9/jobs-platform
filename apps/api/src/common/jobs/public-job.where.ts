import { JobStatus, Prisma } from '@prisma/client';

/** Published jobs visible on the public job board. */
export function publicJobWhere(now = new Date()): Prisma.JobWhereInput {
  return {
    status: JobStatus.published,
    OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
  };
}
