# User Flows — Job Listing Platform MVP

## Purpose

This document defines the main user flows for the MVP job listing platform.

The MVP has three main user groups:

1. Job seekers
2. Employers
3. Admin

The platform goal is simple:

> Employers pay to post jobs, admin approves them, and job seekers apply.

See also: [01-build-playbook.md](./01-build-playbook.md), [02-database-design.md](./02-database-design.md), [03-api-contract.md](./03-api-contract.md).

---

## 1. Job Seeker Flow

Job seekers do not need an account in MVP.

### Main flow

```txt
Visit website
        ↓
Browse jobs
        ↓
Search/filter jobs
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
```

### Job seeker can

- Browse available jobs
- Search by keyword
- Filter by location, category, employment type
- View full job details
- Apply online and upload a resume
- Receive application confirmation

### Application form fields

- Full name, email, phone
- Resume, cover message, availability, work rights
- Experience summary, licence/certificate (if relevant)

### Success outcome

- Application saved with `status = new`
- Candidate receives confirmation email
- Employer can view the application in their dashboard

---

## 2. Employer Registration Flow

```txt
Employer visits website
        ↓
Clicks Employer / Post a Job
        ↓
Creates employer account → logs in
        ↓
Creates company profile
        ↓
Can start posting jobs
```

---

## 3. Employer Job Posting Flow

```txt
Employer logs in → dashboard → Post Job
        ↓
Fills job form → saves job
        ↓
Job status = pending_payment
        ↓
Employer proceeds to payment
```

Initial status after create: `pending_payment`.

---

## 4. Payment Flow

```txt
Employer creates job (pending_payment)
        ↓
Employer pays AUD $90 via Stripe Checkout
        ↓
Stripe webhook → payment = paid
        ↓
Job status = pending_review
        ↓
Admin reviews job
```

Rules: $90 flat fee; payment before admin approval; failed payments keep job as `pending_payment`.

---

## 5. Admin Approval Flow

```txt
Admin logs in → views pending jobs → reviews content
        ↓
Approves or rejects
```

**If approved:** `published`, `publishedAt = now`, `expiresAt = now + 30 days`, job goes public, employer notified.

**If rejected:** `rejected`, employer notified (optional reason).

---

## 6. Public Job Visibility

A job is public only when `status = published` and `expiresAt > now`.

Hidden from public: draft, pending_payment, pending_review, rejected, closed, expired.

---

## 7. Application Management Flow

```txt
Candidate applies (status = new)
        ↓
Employer reviews → shortlisted | rejected | hired
        ↓
Candidate receives status email
```

Employers may only update applications for their own jobs.

---

## 8. Job Expiry Flow

Published jobs live **30 days** after approval, then become `expired` and drop from public listings.

---

## 9. Resume Access Flow

- Candidate uploads resume → NestJS validates → private Supabase bucket → metadata in `UploadedFile`
- Employer views application → backend checks ownership → signed URL (temporary)

Resumes must never be public URLs.

---

## 10. Email Notifications (MVP)

- Application confirmation (candidate)
- New application (employer)
- Payment confirmation, job approved/rejected
- Shortlisted, rejected, hired
- Job expiry reminder and expired

---

## Future flows (not in MVP)

Job seeker accounts, saved jobs, alerts, candidate search, sponsored ads, AI matching, ATS, subscriptions, reviews, credential verification.
