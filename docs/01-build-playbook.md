Job Listing Platform MVP — Build Playbook
1. Project Purpose

We are building an MVP job listing platform for the Australian market.

The platform is focused on:

Blue-collar jobs
Trades
VET-related roles
Hospitality
Cleaning
Care
Practical/local employment roles

This is not a SEEK or Indeed clone.

The MVP should be simple:

Employers pay a flat fee, post a job, admin approves it, and job seekers can browse and apply.

2. MVP Business Model

The first version will use a flat-fee job posting model.

AUD $90 per job post

There will be no complex advertising system in the MVP.

Do not build these in the first version:

Sponsored jobs
Pay-per-click ads
Pay-per-application ads
AI candidate matching
ATS integrations
Candidate database search
Complex employer subscriptions
Company reviews
Advanced analytics
SEEK/Indeed-style premium ad systems

These can be considered as future enhancements after the MVP is live and validated.

3. Final Tech Stack
Area	Stack
Frontend web app	Nuxt 4 / Vue 3
Styling	Tailwind CSS + Nuxt UI
Backend API	NestJS
Database	Supabase Cloud PostgreSQL
ORM	Prisma
Auth	Supabase Auth + NestJS role checks
Storage	Supabase Storage
Payments	Stripe Checkout
Emails	Resend or Postmark
Mobile app	Same responsive Nuxt app wrapped later with Capacitor
Package manager	npm workspaces
Code editor	Cursor
Version control	GitHub
4. Important Architecture Decision

The frontend should not directly control business logic through Supabase.

Correct architecture:

Nuxt 4 frontend
        ↓
NestJS backend API
        ↓
Prisma
        ↓
Supabase Cloud PostgreSQL

Supabase is used for:

PostgreSQL database
Auth
Storage
Cloud infrastructure

NestJS controls:

Job posting rules
Employer permissions
Admin permissions
Payment confirmation
Job approval/rejection
Candidate applications
Applicant status changes
Resume access
Email notifications
Job expiry

Important rule:

Never expose SUPABASE_SERVICE_ROLE_KEY in the frontend.

The service role key must only be used in the backend.

5. Supabase Setup Decision

We are using Supabase Cloud from day one.

We are not using local Supabase because local Supabase/Docker consumes too much C drive space on the current Windows machine.

Environment plan:

Environment	Purpose
Supabase Cloud Dev	Daily development
Supabase Cloud Staging	Client/demo testing later
Supabase Cloud Production	Real live platform later

For now, create only:

job-board-dev

Later, create:

job-board-prod

Do not use one Supabase project for everything.

6. Current Folder Structure

The project currently uses this structure:

jobs-platform/
│
├── .cursor/
│   └── rules/
│       └── project.md
│
├── apps/
│   ├── api/
│   │   └── .env
│   │
│   └── web/
│       └── .env
│
├── docs/
│   ├── 01-build-playbook.md
│   ├── 02-database-design.md
│   ├── 03-api-contract.md
│   └── 04-user-flows.md
│
├── packages/
│   ├── api-client/
│   └── shared/
│
├── .env.example
├── .gitignore
├── package.json
└── README.md

This is a good structure.

7. Recommended Final Folder Structure

As development progresses, the structure should become:

jobs-platform/
│
├── .cursor/
│   └── rules/
│       └── project.md
│
├── apps/
│   ├── api/                       # NestJS backend
│   │   ├── src/
│   │   ├── prisma/
│   │   ├── .env
│   │   ├── .env.example
│   │   └── package.json
│   │
│   └── web/                       # Nuxt 4 frontend
│       ├── app/
│       ├── public/
│       ├── server/
│       ├── .env
│       ├── .env.example
│       ├── nuxt.config.ts
│       └── package.json
│
├── packages/
│   ├── shared/                    # Shared constants, types, schemas
│   └── api-client/                # Optional shared API client later
│
├── docs/
│   ├── 01-build-playbook.md
│   ├── 02-database-design.md
│   ├── 03-api-contract.md
│   ├── 04-user-flows.md
│   └── 05-release-checklist.md
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
8. npm Workspace Setup

Use npm workspaces.

Root package.json should eventually look like this:

{
  "name": "jobs-platform",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev:web": "npm run dev -w apps/web",
    "dev:api": "npm run start:dev -w apps/api",
    "build:web": "npm run build -w apps/web",
    "build:api": "npm run build -w apps/api",
    "lint:web": "npm run lint -w apps/web",
    "lint:api": "npm run lint -w apps/api"
  }
}
9. Cursor Project Rule

Paste this into:

.cursor/rules/project.md
# Project Context

We are building an MVP job listing platform for Australia.

The platform is focused on:
- blue-collar jobs
- trades
- VET-related roles
- hospitality
- cleaning
- care
- practical local employment roles

This is not intended to be a SEEK or Indeed clone.

The MVP is intentionally simple.

The first version should allow:
- employers to create an account
- employers to create a company profile
- employers to post a job
- employers to pay a flat fee of AUD $90 per job post
- admin to approve or reject job posts
- approved jobs to appear publicly
- job seekers to browse jobs
- job seekers to search and filter jobs
- job seekers to view job details
- job seekers to apply online
- job seekers to upload a resume
- employers to view applications
- employers to mark applicants as shortlisted, rejected, or hired

## Business Model

Flat fee only:

- AUD $90 per job post

Do not build:
- sponsored jobs
- pay-per-click ads
- AI candidate matching
- ATS integrations
- candidate database search
- complex subscriptions
- company reviews
- advanced analytics
- SEEK/Indeed-style premium ad systems

These are future enhancements only.

## Tech Stack

Frontend:
- Nuxt 4
- Vue 3
- Tailwind CSS
- Nuxt UI

Backend:
- NestJS

Database:
- Supabase Cloud PostgreSQL

ORM:
- Prisma

Auth:
- Supabase Auth
- NestJS role-based checks

Storage:
- Supabase Storage

Payments:
- Stripe Checkout

Emails:
- Resend or Postmark

Mobile:
- The same responsive Nuxt app will be wrapped with Capacitor later.
- Do not create a separate Ionic mobile app for MVP.

Package manager:
- npm workspaces

## Architecture Rules

Correct flow:

Nuxt frontend → NestJS API → Prisma → Supabase PostgreSQL

The frontend must call the NestJS API for business actions.

Do not let frontend directly control business logic through Supabase.

Supabase is used for:
- PostgreSQL database
- Auth
- Storage

NestJS controls:
- job posting
- employer permissions
- admin permissions
- payment confirmation
- job approval
- application creation
- application status changes
- resume access
- email notifications
- job expiry

## Supabase Setup

We are using Supabase Cloud from the beginning.

Reason:
- Local Supabase/Docker consumes too much C drive space on the current Windows machine.

Rules:
- Do not assume local Supabase is being used.
- Do not require `supabase start`.
- Use DATABASE_URL and DIRECT_URL for Prisma/Supabase connection.
- Prisma schema is the database source of truth.
- Never expose SUPABASE_SERVICE_ROLE_KEY to frontend code.
- Only backend can use the service role key.

## Important Statuses

Job statuses:
- draft
- pending_payment
- pending_review
- published
- rejected
- closed
- expired

Application statuses:
- new
- shortlisted
- rejected
- hired

Payment statuses:
- pending
- paid
- failed
- refunded

## Development Rules

Build one vertical slice at a time.

Do not build the full backend first.
Do not build the full frontend first.

Recommended first working flow:
1. Public job listing
2. Job detail page
3. Candidate applies
4. Resume upload
5. Application saved
6. Employer/admin can see application

Keep the MVP simple and avoid future features unless specifically requested.
10. Important Statuses

These statuses are the foundation of the system.

Job Status
draft
pending_payment
pending_review
published
rejected
closed
expired

Meaning:

Status	Meaning
draft	Employer started creating a job but has not submitted it
pending_payment	Job is created but not paid
pending_review	Employer has paid and job is waiting for admin approval
published	Job is live and visible publicly
rejected	Admin rejected the job
closed	Employer manually closed the job
expired	Job listing duration ended
Application Status
new
shortlisted
rejected
hired

Meaning:

Status	Meaning
new	Candidate has applied
shortlisted	Employer is interested
rejected	Employer does not want to proceed
hired	Employer selected the candidate
Payment Status
pending
paid
failed
refunded

Meaning:

Status	Meaning
pending	Payment not completed
paid	Payment successful
failed	Payment failed
refunded	Payment refunded
11. Supabase Cloud Setup

Create a Supabase Cloud project named:

job-board-dev

Recommended region:

Australia / Sydney if available

Collect these values from Supabase:

SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL
DIRECT_URL
Important Supabase Security Settings

For Supabase project security settings:

Enable Data API: ON
Automatically expose new tables: OFF
Enable automatic RLS: ON

Reason:

Setting	Choice	Reason
Enable Data API	ON	Useful for Supabase client/Auth/Storage tooling
Automatically expose new tables	OFF	Safer; prevents accidental table exposure
Enable automatic RLS	ON	Safer; ensures new tables are protected by default
12. Environment Variables
Root .env.example

Use this as a general reference only.

# App
APP_URL=http://localhost:3000
API_URL=http://localhost:4000

# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Database
DATABASE_URL=
DIRECT_URL=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Email
RESEND_API_KEY=
EMAIL_FROM="Job Board <no-reply@example.com>"
Backend: apps/api/.env
NODE_ENV=development
PORT=4000

DATABASE_URL=""
DIRECT_URL=""

SUPABASE_URL=""
SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""

APP_URL="http://localhost:3000"
API_URL="http://localhost:4000"

STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""

RESEND_API_KEY=""
EMAIL_FROM="Job Board <no-reply@example.com>"
Frontend: apps/web/.env
NUXT_PUBLIC_API_BASE_URL="http://localhost:4000"
NUXT_PUBLIC_SUPABASE_URL=""
NUXT_PUBLIC_SUPABASE_ANON_KEY=""

Important:

Never put SUPABASE_SERVICE_ROLE_KEY in apps/web/.env.
13. Prisma and Supabase

Use Prisma as the database schema source of truth.

Supabase gives the actual PostgreSQL database.

Prisma helps with:

database models
migrations
type-safe queries
relationships
safer schema changes

Correct backend flow:

NestJS service
        ↓
Prisma client
        ↓
Supabase PostgreSQL

Prisma datasource should use both DATABASE_URL and DIRECT_URL:

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

Use:

DATABASE_URL for app queries
DIRECT_URL for migrations
14. First Database Models

Start with only these models:

AppUser
Company
EmployerProfile
JobCategory
Job
Application
Payment
UploadedFile
EmailLog
AdminAction

Do not add these yet:

SavedJob
JobAlert
Subscription
CompanyReview
CandidateProfile
AIRecommendation
ATSIntegration

Those are future features.

15. Suggested Database Meaning
AppUser

Stores application-level users linked to Supabase Auth.

Used for:

admin users
employer users

Candidates do not need accounts in MVP.

Company

Stores employer company information.

EmployerProfile

Stores extra employer-specific information connected to an AppUser.

JobCategory

Stores categories such as Hospitality, Cleaning, Trades, etc.

Job

Stores job listings.

Application

Stores candidate applications.

Payment

Stores Stripe payment records.

UploadedFile

Stores file metadata for resumes and future files.

EmailLog

Stores email send records.

AdminAction

Stores audit history for admin actions.

16. MVP Categories

Seed these categories early:

Hospitality
Cleaning
Construction
Trades
Transport & Logistics
Aged Care
Childcare
Community Services
Retail
Administration
Apprenticeships & Traineeships
VET / Training
17. Backend Folder Structure

NestJS should eventually look like this:

apps/api/
│
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   │
│   ├── common/
│   │   ├── guards/
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── interceptors/
│   │   ├── pipes/
│   │   └── utils/
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── employers/
│   │   ├── companies/
│   │   ├── jobs/
│   │   ├── categories/
│   │   ├── applications/
│   │   ├── payments/
│   │   ├── files/
│   │   ├── notifications/
│   │   └── admin/
│   │
│   └── prisma/
│       ├── prisma.module.ts
│       └── prisma.service.ts
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── .env
├── .env.example
└── package.json
18. Frontend Folder Structure

Nuxt 4 should eventually look like this:

apps/web/
│
├── app/
│   ├── pages/
│   │   ├── index.vue
│   │   ├── jobs/
│   │   │   ├── index.vue
│   │   │   └── [slug].vue
│   │   ├── employers/
│   │   │   └── index.vue
│   │   ├── employer/
│   │   │   ├── dashboard.vue
│   │   │   ├── jobs/
│   │   │   │   ├── index.vue
│   │   │   │   ├── create.vue
│   │   │   │   └── [id].vue
│   │   │   └── applications.vue
│   │   ├── admin/
│   │   │   ├── dashboard.vue
│   │   │   ├── jobs.vue
│   │   │   ├── employers.vue
│   │   │   ├── payments.vue
│   │   │   └── categories.vue
│   │   ├── pricing.vue
│   │   ├── about.vue
│   │   └── contact.vue
│   │
│   ├── components/
│   │   ├── jobs/
│   │   ├── employer/
│   │   ├── admin/
│   │   └── common/
│   │
│   ├── composables/
│   │   ├── useApi.ts
│   │   ├── useJobs.ts
│   │   ├── useApplications.ts
│   │   └── useAuth.ts
│   │
│   ├── layouts/
│   │   ├── default.vue
│   │   ├── employer.vue
│   │   └── admin.vue
│   │
│   └── middleware/
│       ├── auth.ts
│       ├── employer.ts
│       └── admin.ts
│
├── public/
├── server/
├── nuxt.config.ts
└── package.json
19. Shared Package Structure

Use packages/shared for shared constants and types.

packages/shared/
│
├── src/
│   ├── constants/
│   │   ├── job-status.ts
│   │   ├── application-status.ts
│   │   ├── payment-status.ts
│   │   └── roles.ts
│   │
│   ├── types/
│   │   ├── job.ts
│   │   ├── application.ts
│   │   ├── employer.ts
│   │   └── payment.ts
│   │
│   ├── schemas/
│   │   ├── create-job.schema.ts
│   │   ├── application.schema.ts
│   │   └── employer.schema.ts
│   │
│   └── index.ts
│
└── package.json

Example:

export const JOB_STATUSES = [
  'draft',
  'pending_payment',
  'pending_review',
  'published',
  'rejected',
  'closed',
  'expired'
] as const

export type JobStatus = typeof JOB_STATUSES[number]
20. API Contract — First Version
Public API
GET    /health
GET    /jobs
GET    /jobs/:slug
GET    /categories
POST   /jobs/:id/applications
Employer API
POST   /employers/register
GET    /employer/me
PUT    /employer/company

POST   /employer/jobs
GET    /employer/jobs
GET    /employer/jobs/:id
PATCH  /employer/jobs/:id
PATCH  /employer/jobs/:id/close

POST   /employer/jobs/:id/checkout

GET    /employer/jobs/:id/applications
GET    /employer/applications/:id
PATCH  /employer/applications/:id/status
Admin API
GET    /admin/jobs/pending
PATCH  /admin/jobs/:id/approve
PATCH  /admin/jobs/:id/reject

GET    /admin/employers
GET    /admin/payments
GET    /admin/applications

GET    /admin/categories
POST   /admin/categories
PATCH  /admin/categories/:id
Payment API
POST   /payments/stripe/webhook
File API
POST   /files/resume-upload
GET    /files/:id/signed-url
21. Core User Flows
Job Seeker Flow
Visit website
        ↓
Browse/search jobs
        ↓
Open job detail page
        ↓
Click Apply
        ↓
Fill application form
        ↓
Upload resume
        ↓
Submit application
        ↓
Receive confirmation
Employer Job Posting Flow
Employer registers/logs in
        ↓
Creates company profile
        ↓
Creates job post
        ↓
Pays AUD $90
        ↓
Job status becomes pending_review
        ↓
Admin approves
        ↓
Job becomes published
        ↓
Candidates apply
Admin Approval Flow
Admin logs in
        ↓
Views pending jobs
        ↓
Reviews job content
        ↓
Approves or rejects
        ↓
Employer receives update
        ↓
Approved job goes public
Application Management Flow
Candidate applies
        ↓
Application status = new
        ↓
Employer reviews application
        ↓
Employer marks candidate as:
        - shortlisted
        - rejected
        - hired
        ↓
Candidate receives status update email
Payment Flow
Employer creates job
        ↓
Job status = pending_payment
        ↓
Employer pays through Stripe Checkout
        ↓
Stripe webhook confirms payment
        ↓
Payment status = paid
        ↓
Job status = pending_review
        ↓
Admin approves
        ↓
Job status = published
22. Resume Upload Rules

Use Supabase Storage.

Create a private bucket:

resumes

Rules:

Resumes must be private
Resumes must not be public URLs
Frontend should not use service role key
Backend uploads resumes using Supabase service role
Employers can only access resumes for jobs they own
Admin can access all resumes
Use signed URLs when an employer/admin needs to view a resume

Allowed file types:

PDF
DOC
DOCX

Recommended max size:

5MB
23. Job Expiry Rule

Each paid job listing should remain live for:

30 days

When admin approves a job:

publishedAt = now
expiresAt = now + 30 days

Public job listings should only show:

status = published
expiresAt > current date

Expired jobs should not appear publicly.

24. Email Notifications

Use Resend or Postmark.

MVP emails:

Employer account created
Job submitted
Payment successful
Job approved
Job rejected
Candidate application confirmation
New application notification to employer
Candidate shortlisted
Candidate rejected
Candidate hired
Job expiry reminder
Job expired

Keep templates simple and professional.

25. Build Strategy

Do not build the whole backend first.

Do not build the whole frontend first.

Build vertical slices.

Recommended approach:

Backend foundation
        ↓
One working business flow
        ↓
Frontend screen for that flow
        ↓
Test it
        ↓
Commit it
        ↓
Move to next flow
26. Exact Build Order

Follow this order:

1. Clean project foundation
2. npm workspaces
3. Cursor rules
4. Supabase Cloud Dev project
5. NestJS API setup
6. Prisma setup
7. First database schema
8. Seed categories and sample jobs
9. Public jobs API
10. Nuxt 4 app setup
11. Home page
12. Jobs listing page
13. Job detail page
14. Candidate application form
15. Resume upload
16. Employer auth
17. Company profile
18. Employer job posting
19. Admin approval
20. Employer application dashboard
21. Applicant status updates
22. Stripe payment
23. Email notifications
24. Job expiry
25. Responsive mobile polish
26. Capacitor wrapper later
27. Step-by-Step Development Plan
Phase 1 — Project Foundation

Checklist:

[ ] Confirm root package.json has npm workspaces
[ ] Confirm .gitignore is correct
[ ] Confirm docs are present
[ ] Confirm .cursor/rules/project.md is updated
[ ] Confirm apps/api and apps/web folders exist
[ ] Confirm packages/shared and packages/api-client folders exist
[ ] Push foundation to GitHub

Do not build features yet.

Phase 2 — Supabase Cloud Dev

Checklist:

[ ] Create Supabase Cloud project: job-board-dev
[ ] Choose Australia/Sydney region if available
[ ] Enable Data API
[ ] Disable automatically expose new tables
[ ] Enable automatic RLS
[ ] Copy project URL
[ ] Copy anon key
[ ] Copy service role key
[ ] Copy DATABASE_URL
[ ] Copy DIRECT_URL
[ ] Add backend env variables
[ ] Add frontend env variables
Phase 3 — Backend Foundation

Checklist:

[ ] Create NestJS app in apps/api
[ ] Configure API to run on port 4000
[ ] Add @nestjs/config
[ ] Add Prisma
[ ] Add @prisma/client
[ ] Create Prisma module
[ ] Create Prisma service
[ ] Add health check endpoint
[ ] Add global validation pipe
[ ] Add CORS config
[ ] Test GET /health

Expected health response:

{
  "status": "ok"
}
Phase 4 — Database Schema

Checklist:

[ ] Create Prisma schema
[ ] Add AppUser model
[ ] Add Company model
[ ] Add EmployerProfile model
[ ] Add JobCategory model
[ ] Add Job model
[ ] Add Application model
[ ] Add Payment model
[ ] Add UploadedFile model
[ ] Add EmailLog model
[ ] Add AdminAction model
[ ] Add enums/statuses
[ ] Run first migration
[ ] Generate Prisma client
[ ] Seed categories
[ ] Seed sample jobs

Migration command:

cd apps/api
npx prisma migrate dev --name init
npx prisma generate

If migration has issues in early development, use only temporarily:

npx prisma db push

Prefer migrations once schema stabilises.

Phase 5 — Public Jobs API

Build first:

GET /jobs
GET /jobs/:slug
GET /categories

Rules:

Only return published jobs publicly.
Do not return pending, rejected, closed, or expired jobs.

Filters:

keyword
location
category
employmentType

Checklist:

[ ] Create jobs module
[ ] Create categories module
[ ] Build GET /jobs
[ ] Build GET /jobs/:slug
[ ] Build GET /categories
[ ] Test with sample data

Commit:

git add .
git commit -m "feat: add public jobs API"
Phase 6 — Nuxt 4 Frontend Setup

Checklist:

[ ] Create Nuxt 4 app in apps/web
[ ] Add Nuxt UI
[ ] Add Tailwind CSS
[ ] Add VeeValidate
[ ] Add Zod
[ ] Add Supabase client package
[ ] Add API base URL env
[ ] Create default layout
[ ] Create basic navigation

Required pages first:

/
 /jobs
 /jobs/[slug]

Commit:

git add .
git commit -m "feat: setup nuxt app"
Phase 7 — First Working Frontend Slice

Build:

Home page
Jobs listing page
Job detail page

Connect to:

GET /jobs
GET /jobs/:slug
GET /categories

Checklist:

[ ] Home page shows search section
[ ] Jobs page lists jobs from API
[ ] Jobs page supports basic search/filter
[ ] Job detail page shows full job
[ ] Job detail page has Apply button
[ ] Mobile layout looks acceptable

Commit:

git add .
git commit -m "feat: add public job pages"
Phase 8 — Candidate Application Flow

Backend:

POST /jobs/:id/applications

Frontend:

Application form on job detail page or separate apply page

Application form fields:

Full name
Email
Phone
Resume upload
Cover message
Availability
Work rights
Experience
Licence/certificate if needed

Checklist:

[ ] Create application model logic
[ ] Create POST application endpoint
[ ] Validate input
[ ] Save application with status = new
[ ] Build frontend application form
[ ] Show confirmation after submission

Commit:

git add .
git commit -m "feat: add candidate application flow"
Phase 9 — Resume Upload

Use Supabase Storage private bucket:

resumes

Checklist:

[ ] Create private resumes bucket
[ ] Add file upload endpoint in NestJS
[ ] Validate file type
[ ] Validate file size
[ ] Upload file to Supabase Storage
[ ] Store file metadata in UploadedFile
[ ] Link uploaded file to Application
[ ] Ensure resumes are not public

Commit:

git add .
git commit -m "feat: add private resume upload"
Phase 10 — Employer Auth and Company Profile

Use Supabase Auth.

Employer flow:

Employer signs up
        ↓
Supabase Auth creates user
        ↓
NestJS creates AppUser with EMPLOYER role
        ↓
Employer creates company profile

Checklist:

[ ] Employer signup page
[ ] Employer login page
[ ] Supabase Auth setup
[ ] NestJS verifies Supabase token
[ ] AppUser created
[ ] EmployerProfile created
[ ] Company profile form
[ ] Company profile edit page

Commit:

git add .
git commit -m "feat: add employer auth and company profile"
Phase 11 — Employer Job Posting

Employer can create jobs.

Initial status:

pending_payment

Job form fields:

Job title
Category
Location
Employment type
Salary/pay range
Description
Responsibilities
Requirements
Benefits
Start date optional
Application deadline optional
Required licence/certificate optional
Work rights requirement optional

Checklist:

[ ] Employer dashboard page
[ ] Employer jobs page
[ ] Create job page
[ ] POST /employer/jobs
[ ] GET /employer/jobs
[ ] GET /employer/jobs/:id
[ ] PATCH /employer/jobs/:id
[ ] PATCH /employer/jobs/:id/close

Commit:

git add .
git commit -m "feat: add employer job posting"
Phase 12 — Admin Approval Flow

Admin can approve or reject jobs.

Checklist:

[ ] Admin dashboard
[ ] Admin pending jobs page
[ ] GET /admin/jobs/pending
[ ] PATCH /admin/jobs/:id/approve
[ ] PATCH /admin/jobs/:id/reject
[ ] Approved jobs become published
[ ] Rejected jobs stay hidden

Approval rule:

Only paid jobs should be approved.

For early dev, payment can be manually marked before Stripe is built.

Commit:

git add .
git commit -m "feat: add admin job approval flow"
Phase 13 — Employer Application Dashboard

Employer can view applicants.

Checklist:

[ ] Employer can view applications per job
[ ] Employer can view applicant details
[ ] Employer can access resume using signed URL
[ ] Employer can mark applicant as shortlisted
[ ] Employer can mark applicant as rejected
[ ] Employer can mark applicant as hired
[ ] Employer cannot view applications for other employers’ jobs

Endpoints:

GET /employer/jobs/:id/applications
GET /employer/applications/:id
PATCH /employer/applications/:id/status

Commit:

git add .
git commit -m "feat: add employer application management"
Phase 14 — Stripe Payment

Use Stripe Checkout.

Payment amount:

AUD $90

Flow:

Employer creates job
        ↓
Job status = pending_payment
        ↓
Employer pays $90
        ↓
Stripe webhook confirms payment
        ↓
Payment status = paid
        ↓
Job status = pending_review
        ↓
Admin approves

Checklist:

[ ] Create Stripe test account
[ ] Add STRIPE_SECRET_KEY
[ ] Add STRIPE_WEBHOOK_SECRET
[ ] Create checkout endpoint
[ ] Create webhook endpoint
[ ] Store payment record
[ ] Update payment status after webhook
[ ] Update job status to pending_review after successful payment

Endpoints:

POST /employer/jobs/:id/checkout
POST /payments/stripe/webhook

Commit:

git add .
git commit -m "feat: add stripe checkout for job posts"
Phase 15 — Email Notifications

Use Resend or Postmark.

Checklist:

[ ] Add notification module
[ ] Add email service
[ ] Add application confirmation email
[ ] Add new application email to employer
[ ] Add payment confirmation email
[ ] Add job approved email
[ ] Add job rejected email
[ ] Add shortlisted email
[ ] Add rejection email
[ ] Add hired email
[ ] Add email logs

Commit:

git add .
git commit -m "feat: add core email notifications"
Phase 16 — Job Expiry

Rule:

Published jobs expire after 30 days.

Checklist:

[ ] Add publishedAt
[ ] Add expiresAt
[ ] Set expiresAt when admin approves job
[ ] Hide expired jobs from public API
[ ] Add manual admin expire option
[ ] Add scheduled expiry later

Commit:

git add .
git commit -m "feat: add job expiry logic"
Phase 17 — Responsive Mobile Polish

Before Capacitor, the Nuxt app must work well in mobile browser.

Checklist:

[ ] Home page mobile layout
[ ] Job listing mobile layout
[ ] Job filter mobile layout
[ ] Job detail mobile layout
[ ] Apply form mobile layout
[ ] Resume upload on mobile browser
[ ] Employer dashboard acceptable on tablet/desktop
[ ] Admin dashboard web-first

Commit:

git add .
git commit -m "style: improve responsive mobile layout"
Phase 18 — Capacitor Later

Do this only after the responsive Nuxt job seeker flow works.

Capacitor goal:

Wrap the Nuxt job seeker experience as Android/iOS app.

Do not create a separate Ionic app for MVP.

Possible commands later:

cd apps/web
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init
npm run generate
npx cap add android
npx cap copy android
npx cap open android

iOS will require macOS and Xcode.

28. What To Build First

Start with this exact sequence:

1. Make Cursor understand project
2. Setup npm workspace correctly
3. Create NestJS backend
4. Add Prisma
5. Connect to Supabase Cloud
6. Create first schema
7. Seed categories and sample jobs
8. Build public jobs API
9. Create Nuxt app
10. Build jobs list and job detail pages
11. Add application form
12. Add resume upload

First milestone:

A job seeker can browse jobs, view a job, apply, and upload a resume.
29. First Cursor Prompt

Use this before building code:

Please read the current project structure and documentation before writing any code.

This project is an MVP job listing platform for Australia. It is focused on blue-collar, trades, VET-related, hospitality, cleaning, care, and practical local jobs.

This is not a SEEK or Indeed clone. The MVP is intentionally simple.

Business model:
- Employers pay a flat fee of AUD $90 per job post.
- No sponsored jobs, no pay-per-click, no AI matching, no ATS integrations, no complex subscriptions in MVP.

Tech stack:
- Nuxt 4 / Vue 3 for the web app
- The same responsive Nuxt app will later be wrapped with Capacitor for mobile
- NestJS for backend API
- Supabase Cloud PostgreSQL for database
- Supabase Auth for authentication
- Supabase Storage for resume uploads
- Prisma as ORM and database schema source of truth
- Stripe Checkout for payments
- Resend or Postmark for transactional emails
- npm workspaces
- Tailwind CSS + Nuxt UI

Architecture rule:
The Nuxt frontend must call the NestJS API for business actions. The frontend should not directly control business logic through Supabase. NestJS controls job posting, payments, admin approval, applications, applicant status changes, resume access, and email notifications.

Current status:
- Folder structure has been created.
- No real app code has been implemented yet.
- Supabase is cloud-first, not local Docker/Supabase.
- The project has docs inside the docs folder and Cursor rules inside .cursor/rules/project.md.

Please do the following first:
1. Inspect the current folder structure.
2. Read .cursor/rules/project.md.
3. Read docs/01-build-playbook.md.
4. Summarize your understanding of the project.
5. Tell me what files/folders are missing or should be adjusted before development starts.
6. Do not create or modify any code yet.
30. Second Cursor Prompt — Foundation Only

After Cursor understands the project:

Good. Now help me prepare the project foundation only.

Please do not build features yet.

Set up the monorepo foundation using npm workspaces.

Expected root structure:
- apps/web for Nuxt 4 app
- apps/api for NestJS backend
- packages/shared for shared constants/types/schemas
- packages/api-client for shared API client later
- docs for documentation
- .cursor/rules/project.md for Cursor rules

Tasks:
1. Review root package.json and make sure npm workspaces are configured correctly.
2. Ensure .gitignore is appropriate for Nuxt, NestJS, Prisma, env files, node_modules, build folders, and Capacitor output.
3. Ensure docs folder has the correct documentation placeholders.
4. Ensure packages/shared and packages/api-client have basic package.json files if needed.
5. Do not create Nuxt or NestJS app code yet unless I explicitly ask.
6. Explain each change before applying it.
31. Third Cursor Prompt — Create Backend
Now create the NestJS backend app inside apps/api.

Use npm.

Do not implement business features yet.

Tasks:
1. Create a NestJS app in apps/api.
2. Set it up for the monorepo structure.
3. Add @nestjs/config.
4. Add Prisma and @prisma/client.
5. Add a basic Prisma module and Prisma service.
6. Add a simple GET /health endpoint that returns { status: "ok" }.
7. Configure the app to run on port 4000.
8. Add .env.example for the API, but do not include real secrets.
9. Do not create the full database schema yet.
10. Explain what files were created and why.
32. Fourth Cursor Prompt — Create Prisma Schema
Now help me create the first Prisma schema for the job board MVP.

Use Supabase Cloud PostgreSQL.

Important:
- Prisma schema is the database source of truth.
- Use DATABASE_URL and DIRECT_URL.
- Do not use local Supabase.
- Do not manually create tables in Supabase Studio.

Create models for:
- AppUser
- Company
- EmployerProfile
- JobCategory
- Job
- Application
- Payment
- UploadedFile
- EmailLog
- AdminAction

Include these statuses:
Job: draft, pending_payment, pending_review, published, rejected, closed, expired
Application: new, shortlisted, rejected, hired
Payment: pending, paid, failed, refunded

Keep the schema MVP-focused. Do not add saved jobs, subscriptions, reviews, ATS, AI matching, or job alerts yet.

After creating the schema, explain how to run the migration against Supabase Cloud safely.
33. Golden Rules

Keep these visible while building:

1. Do not overbuild.
2. Do not copy SEEK or Indeed.
3. Build one working flow at a time.
4. Nuxt calls NestJS for business logic.
5. Supabase is infrastructure, not the business layer.
6. Prisma schema is the database source of truth.
7. Resumes must be private.
8. Admin must approve jobs before they go live.
9. Payment should happen before admin approval.
10. Public jobs must only show published, non-expired jobs.
11. Mobile starts as responsive Nuxt, then Capacitor later.
12. No AI, no ATS, no sponsored ads in MVP.
13. Never expose the Supabase service role key in frontend code.
14. Use Supabase Cloud Dev for development.
15. Keep dev and production Supabase projects separate.
34. Demo Readiness Checklist

Before showing the platform to anyone, test:

[ ] Public job page loads
[ ] Search/filter works
[ ] Job detail page loads
[ ] Candidate can apply
[ ] Resume uploads successfully
[ ] Application is stored
[ ] Employer can register
[ ] Employer can create company profile
[ ] Employer can create job
[ ] Employer can pay $90
[ ] Admin can approve job
[ ] Approved job appears publicly
[ ] Admin can reject job
[ ] Rejected job does not appear publicly
[ ] Employer can view applications
[ ] Employer can shortlist candidate
[ ] Employer can reject candidate
[ ] Employer can mark candidate as hired
[ ] Candidate receives relevant emails
[ ] Employer receives application email
[ ] Job expires after 30 days
[ ] Mobile browser view works well
[ ] Resume access is private
[ ] Employer cannot see other employers’ applications
[ ] Admin can see all jobs
35. Final MVP Goal

The MVP is successful when this works:

Employer:
Register → Create company → Post job → Pay $90 → Wait for admin approval → Receive applicants

Admin:
Review job → Approve/reject → Manage platform quality

Job seeker:
Browse jobs → View job → Apply → Upload resume → Receive confirmation

The first version should be simple, trusted, and usable. The goal is to validate that employers are willing to pay for job posts and that candidates are willing to apply through the platform.