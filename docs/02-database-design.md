# Database Design — Job Listing Platform MVP

## Purpose

This document defines the first version of the database design for the MVP job listing platform.

The platform is focused on Australian blue-collar, trades, VET, hospitality, cleaning, care, and practical local jobs.

The MVP business model is simple:

- Employers pay AUD $90 per job post.
- Admin approves jobs before they go live.
- Job seekers can apply without creating an account.
- Employers can view and manage applications.

## Database Source of Truth

Prisma schema is the source of truth for database structure.

Do not manually create important application tables directly in Supabase Studio once Prisma is introduced.

Correct flow:

Nuxt frontend → NestJS API → Prisma → Supabase PostgreSQL

## Main Entities

### 1. AppUser

Represents application users linked to Supabase Auth.

Used for:

- Admin users
- Employer users

Job seekers do not need accounts in the MVP.

Fields:

- id
- supabaseAuthUserId
- email
- role
- createdAt
- updatedAt

Roles:

- ADMIN
- EMPLOYER

---

### 2. Company

Represents the employer company/business.

Fields:

- id
- name
- abn
- industry
- website
- phone
- email
- location
- address
- logoUrl
- description
- createdAt
- updatedAt

Relationship:

- One company can have many jobs.
- One employer profile belongs to a company.

---

### 3. EmployerProfile

Represents employer-specific profile details for an AppUser.

Fields:

- id
- appUserId
- companyId
- contactName
- contactPhone
- positionTitle
- createdAt
- updatedAt

Relationship:

- One employer profile belongs to one AppUser.
- One employer profile belongs to one Company.

---

### 4. JobCategory

Represents job categories.

Initial categories:

- Hospitality
- Cleaning
- Construction
- Trades
- Transport & Logistics
- Aged Care
- Childcare
- Community Services
- Retail
- Administration
- Apprenticeships & Traineeships
- VET / Training

Fields:

- id
- name
- slug
- isActive
- createdAt
- updatedAt

Relationship:

- One category can have many jobs.

---

### 5. Job

Represents a job listing.

Fields:

- id
- companyId
- categoryId
- title
- slug
- location
- employmentType
- salaryMin
- salaryMax
- salaryText
- description
- responsibilities
- requirements
- benefits
- requiredLicenceOrCertificate
- workRightsRequirement
- applicationDeadline
- status
- publishedAt
- expiresAt
- createdAt
- updatedAt

Job statuses:

- draft
- pending_payment
- pending_review
- published
- rejected
- closed
- expired

Rules:

- Public users can only see jobs with status = published.
- Public users should not see rejected, pending, closed, or expired jobs.
- Published jobs expire after 30 days.
- Admin approval is required before a job becomes published.

Relationship:

- One job belongs to one company.
- One job belongs to one category.
- One job can have many applications.
- One job can have one or more payments.

---

### 6. Application

Represents a candidate application.

Job seekers can apply without creating an account in MVP.

Fields:

- id
- jobId
- fullName
- email
- phone
- coverMessage
- availability
- workRights
- experienceSummary
- licenceOrCertificate
- status
- resumeFileId
- createdAt
- updatedAt

Application statuses:

- new
- shortlisted
- rejected
- hired

Rules:

- New applications start with status = new.
- Employer can update status to shortlisted, rejected, or hired.
- Employer can only view applications for jobs owned by their company.
- Admin can view all applications.

Relationship:

- One application belongs to one job.
- One application may have one uploaded resume file.

---

### 7. Payment

Represents payment for a job post.

Fields:

- id
- jobId
- companyId
- amount
- currency
- status
- stripeSessionId
- stripePaymentIntentId
- paidAt
- createdAt
- updatedAt

Payment statuses:

- pending
- paid
- failed
- refunded

Rules:

- Job post price is AUD $90.
- Job starts as pending_payment.
- After successful Stripe payment, payment status becomes paid.
- After payment success, job status becomes pending_review.
- Admin approves the paid job before it becomes published.

---

### 8. UploadedFile

Stores file metadata for resumes and future uploads.

Fields:

- id
- bucket
- path
- originalFileName
- mimeType
- size
- uploadedByAppUserId
- createdAt

Rules:

- Resumes are stored in private Supabase Storage bucket.
- Resume files must not be public.
- Backend generates signed URLs for authorised employers/admins.
- Frontend must never use Supabase service role key.

Allowed resume file types:

- PDF
- DOC
- DOCX

Recommended max file size:

- 5MB

---

### 9. EmailLog

Stores email notification records.

Fields:

- id
- to
- subject
- template
- status
- providerMessageId
- errorMessage
- createdAt

Used for:

- Application confirmation
- New application notification
- Payment confirmation
- Job approved
- Job rejected
- Candidate shortlisted
- Candidate rejected
- Candidate hired
- Job expired

---

### 10. AdminAction

Stores audit history for admin actions.

Fields:

- id
- adminUserId
- actionType
- entityType
- entityId
- notes
- createdAt

Examples:

- approve_job
- reject_job
- close_job
- update_category
- remove_job

## Important Security Rules

- Supabase service role key must only be used in NestJS backend.
- Frontend must never access the service role key.
- Resumes must be private.
- Employers can only access their own jobs and applications.
- Admin can access all records.
- Public users can only access published jobs.

## Future Tables Not Included in MVP

Do not create these yet:

- SavedJob
- JobAlert
- CandidateProfile
- CompanyReview
- Subscription
- SponsoredJob
- AIRecommendation
- ATSIntegration
- CredentialVerification

These are future enhancements.
