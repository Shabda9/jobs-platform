# Release & Demo Readiness Checklist

Use this before showing the platform to stakeholders or going live.

## Public job seeker

- [ ] Public job listing page loads
- [ ] Search and filters work
- [ ] Job detail page loads
- [ ] Candidate can apply without an account
- [ ] Resume uploads successfully (PDF/DOC/DOCX, max 5MB)
- [ ] Application is stored with status `new`
- [ ] Mobile browser layout is acceptable

## Employer

- [ ] Employer can register and log in
- [ ] Employer can create/edit company profile
- [ ] Employer can create a job (`pending_payment`)
- [ ] Employer can pay $90 via Stripe Checkout
- [ ] Employer can view applications for their jobs only
- [ ] Employer can shortlist, reject, or mark hired
- [ ] Employer can access resumes via signed URLs only for their jobs

## Admin

- [ ] Admin can view pending jobs
- [ ] Admin can approve paid jobs → `published`
- [ ] Admin can reject jobs
- [ ] Rejected/unpaid/expired jobs do not appear publicly
- [ ] Admin can view employers, payments, applications, categories

## Payments & jobs

- [ ] Stripe webhook updates payment and job status correctly
- [ ] Only paid jobs reach `pending_review`
- [ ] Published jobs expire after 30 days and hide from public API

## Email & security

- [ ] Core transactional emails send (apply, payment, approve/reject, status updates)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is not in frontend env or code
- [ ] Resumes are private; no public resume URLs

## Documentation

- [ ] Env vars documented in `.env.example` files
- [ ] API matches [03-api-contract.md](./03-api-contract.md)
- [ ] Schema matches [02-database-design.md](./02-database-design.md)
