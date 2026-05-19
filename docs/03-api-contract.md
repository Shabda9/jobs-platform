# API Contract - Job Listing Platform MVP

## Purpose

This document defines the first version of the backend API contract for the MVP job listing platform.

The frontend is Nuxt 4.

The backend is NestJS.

The frontend should call the NestJS API for business actions.

Correct flow:

Nuxt frontend â†’ NestJS API â†’ Prisma â†’ Supabase PostgreSQL

## Base URLs

Local development:

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

Environment variable:

- NUXT_PUBLIC_API_BASE_URL=http://localhost:4000

## API Principles

- Public job data can be read without login.
- Employer actions require employer authentication.
- Admin actions require admin authentication.
- Business logic must live in NestJS, not the frontend.
- Public users can only see published, non-expired jobs.
- Employers can only manage their own jobs and applications.
- Admin can manage all jobs, employers, applications, and payments.

---

# 1. Health API

## GET /health

Checks if API is running.

Response:

```json
{
  "status": "ok"
}

2. Public Job APIs
GET /jobs

Returns public job listings.

Only returns:

published jobs
non-expired jobs

Query params:

keyword
location
category
employmentType

Example:

GET /jobs?keyword=chef&location=Sydney&category=hospitality

Response:

{
  "data": [
    {
      "id": "job-id",
      "title": "Chef",
      "slug": "chef-sydney",
      "companyName": "Good Eats",
      "location": "Sydney NSW",
      "employmentType": "Full-time",
      "salaryText": "$65,000 - $75,000",
      "category": "Hospitality",
      "publishedAt": "2026-05-19T00:00:00.000Z"
    }
  ]
}
GET /jobs/:slug

Returns one public job detail.

Only returns the job if:

status = published
expiresAt is in the future

Response:

{
  "id": "job-id",
  "title": "Chef",
  "slug": "chef-sydney",
  "companyName": "Good Eats",
  "location": "Sydney NSW",
  "employmentType": "Full-time",
  "salaryText": "$65,000 - $75,000",
  "category": "Hospitality",
  "description": "Full job description here",
  "responsibilities": "Responsibilities here",
  "requirements": "Requirements here",
  "benefits": "Benefits here",
  "requiredLicenceOrCertificate": "Food Safety Certificate",
  "workRightsRequirement": "Must have right to work in Australia",
  "publishedAt": "2026-05-19T00:00:00.000Z",
  "expiresAt": "2026-06-18T00:00:00.000Z"
}
GET /categories

Returns active job categories.

Response:

{
  "data": [
    {
      "id": "category-id",
      "name": "Hospitality",
      "slug": "hospitality"
    }
  ]
}
3. Public Application API
POST /jobs/:id/applications

Allows a job seeker to apply for a job.

Authentication:

Not required for MVP.

Request type:

multipart/form-data

Fields:

fullName
email
phone
coverMessage
availability
workRights
experienceSummary
licenceOrCertificate
resume

Rules:

Job must be published.
Job must not be expired.
Resume must be PDF, DOC, or DOCX.
Resume max size should be 5MB.
Application status starts as new.

Response:

{
  "message": "Application submitted successfully",
  "applicationId": "application-id"
}
4. Employer Auth APIs
POST /employers/register

Creates employer account.

This may use Supabase Auth first, then create AppUser and EmployerProfile in backend.

Request:

{
  "email": "employer@example.com",
  "password": "password",
  "contactName": "Jane Smith"
}

Response:

{
  "message": "Employer registered successfully"
}
GET /employer/me

Returns current employer profile.

Authentication:

Employer required.

Response:

{
  "id": "app-user-id",
  "email": "employer@example.com",
  "role": "EMPLOYER",
  "company": {
    "id": "company-id",
    "name": "ABC Electrical"
  }
}
5. Employer Company APIs
PUT /employer/company

Creates or updates employer company profile.

Authentication:

Employer required.

Request:

{
  "name": "ABC Electrical",
  "abn": "12345678901",
  "industry": "Trades",
  "website": "https://example.com",
  "phone": "0400000000",
  "email": "info@example.com",
  "location": "Sydney NSW",
  "address": "Sydney NSW",
  "description": "Company description"
}

Response:

{
  "message": "Company profile saved successfully"
}
6. Employer Job APIs
POST /employer/jobs

Creates a job post.

Authentication:

Employer required.

Initial status:

pending_payment

Request:

{
  "title": "Electrician",
  "categoryId": "category-id",
  "location": "Sydney NSW",
  "employmentType": "Full-time",
  "salaryMin": 75000,
  "salaryMax": 95000,
  "salaryText": "$75,000 - $95,000",
  "description": "Job description",
  "responsibilities": "Responsibilities",
  "requirements": "Requirements",
  "benefits": "Benefits",
  "requiredLicenceOrCertificate": "Electrical licence",
  "workRightsRequirement": "Must have right to work in Australia"
}

Response:

{
  "message": "Job created successfully",
  "jobId": "job-id",
  "status": "pending_payment"
}
GET /employer/jobs

Returns jobs posted by the logged-in employer.

Authentication:

Employer required.

Response:

{
  "data": [
    {
      "id": "job-id",
      "title": "Electrician",
      "status": "pending_payment",
      "location": "Sydney NSW",
      "applicationsCount": 0,
      "createdAt": "2026-05-19T00:00:00.000Z"
    }
  ]
}
GET /employer/jobs/:id

Returns one employer-owned job.

Authentication:

Employer required.

Rules:

Employer can only access their own companyâ€™s jobs.
PATCH /employer/jobs/:id

Updates a job.

Authentication:

Employer required.

Rules:

Employer can only edit their own jobs.
Editing published jobs may require admin review later, but MVP can keep edits simple.
PATCH /employer/jobs/:id/close

Closes a job.

Authentication:

Employer required.

Result:

job status becomes closed.

Response:

{
  "message": "Job closed successfully"
}
7. Employer Application APIs
GET /employer/jobs/:id/applications

Returns applications for a specific employer-owned job.

Authentication:

Employer required.

Rules:

Employer can only view applications for jobs owned by their company.

Response:

{
  "data": [
    {
      "id": "application-id",
      "fullName": "John Candidate",
      "email": "candidate@example.com",
      "phone": "0400000000",
      "status": "new",
      "createdAt": "2026-05-19T00:00:00.000Z"
    }
  ]
}
GET /employer/applications/:id

Returns application details.

Authentication:

Employer required.

Rules:

Employer can only view applications for their own jobs.
PATCH /employer/applications/:id/status

Updates application status.

Authentication:

Employer required.

Allowed statuses:

shortlisted
rejected
hired

Request:

{
  "status": "shortlisted"
}

Response:

{
  "message": "Application status updated successfully"
}
8. Payment APIs
POST /employer/jobs/:id/checkout

Creates Stripe Checkout session for a job post.

Authentication:

Employer required.

Rules:

Job must belong to employer.
Job must be pending_payment.
Amount is AUD $90.

Response:

{
  "checkoutUrl": "https://checkout.stripe.com/..."
}
POST /payments/stripe/webhook

Receives Stripe webhook events.

Authentication:

Stripe signature verification.

Rules:

On successful payment:
payment status becomes paid
job status becomes pending_review
9. Admin APIs
GET /admin/jobs/pending

Returns jobs waiting for approval.

Authentication:

Admin required.

Returns jobs with:

status = pending_review
PATCH /admin/jobs/:id/approve

Approves a job.

Authentication:

Admin required.

Rules:

Job must be paid.
Job status becomes published.
publishedAt is set.
expiresAt is set to publishedAt + 30 days.

Response:

{
  "message": "Job approved and published"
}
PATCH /admin/jobs/:id/reject

Rejects a job.

Authentication:

Admin required.

Request:

{
  "reason": "Job description is incomplete"
}

Response:

{
  "message": "Job rejected"
}
GET /admin/employers

Returns employers.

Authentication:

Admin required.
GET /admin/payments

Returns payment records.

Authentication:

Admin required.
GET /admin/applications

Returns all applications.

Authentication:

Admin required.
GET /admin/categories

Returns categories.

Authentication:

Admin required.
POST /admin/categories

Creates category.

Authentication:

Admin required.
PATCH /admin/categories/:id

Updates category.

Authentication:

Admin required.
10. File APIs
POST /files/resume-upload

Uploads resume to private Supabase Storage.

Authentication:

Public during application flow or handled as part of application submit.

Rules:

Allowed file types: PDF, DOC, DOCX
Max size: 5MB
File must be private
Store metadata in UploadedFile table
GET /files/:id/signed-url

Returns temporary signed URL for authorised access.

Authentication:

Employer or Admin required.

Rules:

Employer can only access resumes for applications to their own jobs.
Admin can access all resumes.

Response:

{
  "url": "https://signed-url..."
}
11. Future APIs Not Included in MVP

Do not build yet:

saved jobs
job alerts
company reviews
subscriptions
sponsored job boosts
AI matching
ATS integration
candidate profile search

