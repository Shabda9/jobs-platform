import { JobStatus, PaymentStatus, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: 'Hospitality', slug: 'hospitality' },
  { name: 'Cleaning', slug: 'cleaning' },
  { name: 'Construction', slug: 'construction' },
  { name: 'Trades', slug: 'trades' },
  { name: 'Transport & Logistics', slug: 'transport-logistics' },
  { name: 'Aged Care', slug: 'aged-care' },
  { name: 'Childcare', slug: 'childcare' },
  { name: 'Community Services', slug: 'community-services' },
  { name: 'Retail', slug: 'retail' },
  { name: 'Administration', slug: 'administration' },
  {
    name: 'Apprenticeships & Traineeships',
    slug: 'apprenticeships-traineeships',
  },
  { name: 'VET / Training', slug: 'vet-training' },
] as const;

const DEV_COMPANY = {
  name: 'Dev Sample Employers Pty Ltd',
  email: 'dev-seed@jobs-platform.local',
  industry: 'Trades & Services',
  location: 'Australia',
  description: 'Seed company for local development and testing only.',
};

const SAMPLE_JOBS = [
  {
    slug: 'chef-sydney-cbd',
    title: 'Chef',
    categorySlug: 'hospitality',
    location: 'Sydney NSW',
    employmentType: 'Full-time',
    salaryText: '$65,000 - $75,000',
    description:
      'Busy CBD venue seeking an experienced chef for lunch and dinner service.',
    responsibilities:
      'Prepare menu items, manage prep lists, and maintain kitchen standards.',
    requirements:
      '2+ years commercial kitchen experience. Food Safety Certificate required.',
    benefits: 'Staff meals and stable roster.',
    requiredLicenceOrCertificate: 'Food Safety Certificate',
    workRightsRequirement: 'Must have the right to work in Australia',
  },
  {
    slug: 'electrician-melbourne',
    title: 'Licensed Electrician',
    categorySlug: 'trades',
    location: 'Melbourne VIC',
    employmentType: 'Full-time',
    salaryText: '$85,000 - $100,000',
    description:
      'Residential and light commercial electrical team looking for a licensed sparky.',
    responsibilities:
      'Installations, fault finding, compliance documentation, and site safety.',
    requirements:
      'Current electrical licence (VIC). White Card. Reliable vehicle and tools.',
    benefits: 'Overtime available. Company vehicle after probation.',
    requiredLicenceOrCertificate: 'Electrical licence (VIC)',
    workRightsRequirement: 'Must have the right to work in Australia',
  },
  {
    slug: 'commercial-cleaner-brisbane',
    title: 'Commercial Cleaner',
    categorySlug: 'cleaning',
    location: 'Brisbane QLD',
    employmentType: 'Part-time',
    salaryText: '$28 - $32 per hour',
    description:
      'Evening commercial cleaning role across office sites in inner Brisbane.',
    responsibilities:
      'Vacuuming, mopping, sanitising amenities, and restocking supplies.',
    requirements:
      'Previous commercial cleaning experience preferred. Reliable attendance.',
    benefits: 'Flexible evening hours.',
    workRightsRequirement: 'Must have the right to work in Australia',
  },
] as const;

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

async function main() {
  console.log('Seeding job categories...');

  const categoryBySlug = new Map<string, string>();

  for (const category of CATEGORIES) {
    const record = await prisma.jobCategory.upsert({
      where: { slug: category.slug },
      update: { name: category.name, isActive: true },
      create: {
        name: category.name,
        slug: category.slug,
        isActive: true,
      },
    });
    categoryBySlug.set(category.slug, record.id);
  }

  console.log(`Seeded ${categoryBySlug.size} categories.`);

  console.log('Seeding dev company and sample jobs...');

  let company = await prisma.company.findFirst({
    where: { email: DEV_COMPANY.email },
  });

  if (!company) {
    company = await prisma.company.create({ data: DEV_COMPANY });
  }

  const publishedAt = new Date();
  const expiresAt = addDays(publishedAt, 30);

  for (const job of SAMPLE_JOBS) {
    const categoryId = categoryBySlug.get(job.categorySlug);
    if (!categoryId) {
      throw new Error(`Missing category for slug: ${job.categorySlug}`);
    }

    const existing = await prisma.job.findUnique({ where: { slug: job.slug } });

    const jobData = {
      companyId: company.id,
      categoryId,
      title: job.title,
      slug: job.slug,
      location: job.location,
      employmentType: job.employmentType,
      salaryText: job.salaryText,
      description: job.description,
      responsibilities: job.responsibilities,
      requirements: job.requirements,
      benefits: job.benefits,
      requiredLicenceOrCertificate:
        'requiredLicenceOrCertificate' in job
          ? job.requiredLicenceOrCertificate
          : undefined,
      workRightsRequirement: job.workRightsRequirement,
      status: JobStatus.published,
      publishedAt,
      expiresAt,
    };

    const savedJob = existing
      ? await prisma.job.update({
          where: { id: existing.id },
          data: jobData,
        })
      : await prisma.job.create({ data: jobData });

    const existingPayment = await prisma.payment.findFirst({
      where: { jobId: savedJob.id },
    });

    if (!existingPayment) {
      await prisma.payment.create({
        data: {
          jobId: savedJob.id,
          companyId: company.id,
          amount: 90,
          currency: 'AUD',
          status: PaymentStatus.paid,
          paidAt: publishedAt,
        },
      });
    }
  }

  console.log(`Seeded ${SAMPLE_JOBS.length} published sample jobs.`);
  console.log('Seed complete.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
