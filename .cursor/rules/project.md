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

The first version should be a simple job board where:
- employers can create an account
- employers can post a job
- employers pay a flat fee of AUD $90 per job post
- admin reviews and approves/rejects job posts
- approved jobs appear publicly
- job seekers can browse jobs
- job seekers can search/filter jobs
- job seekers can view job details
- job seekers can apply online
- job seekers can upload a resume
- employers can view applicants
- employers can mark applicants as shortlisted, rejected, or hired

## MVP Business Model

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

Mobile:
- The same responsive Nuxt app will be wrapped with Capacitor later.
- Do not create a separate Ionic mobile app for MVP.

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

Package manager:
- npm workspaces

## Architecture Rules

The frontend must call the NestJS backend for business actions.

Correct flow:

Nuxt frontend → NestJS API → Prisma → Supabase PostgreSQL

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