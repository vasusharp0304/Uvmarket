# ✅ Deployment Checklist (UV Market School)

Use this checklist before going live.

## Environment & Secrets
- [ ] Copy `.env.example` values into your production environment variables.
- [ ] Replace `NEXTAUTH_SECRET` with a strong random string.
- [ ] Set `NEXTAUTH_URL` to your production domain.
- [ ] Add Razorpay production keys (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`).

## Database
- [ ] Confirm Turso database is reachable (`npm run db:test`).
- [ ] Push Prisma schema to Turso (`npx prisma db push`).
- [ ] Seed initial data if required (`npx prisma db seed`).

## Build & Deploy
- [ ] Run `npm run build` locally to ensure build passes.
- [ ] Deploy to Vercel (or your chosen host).
- [ ] Validate login, dashboard, and payment flows post-deploy.

## Observability & Security
- [ ] Confirm error logs are visible in hosting provider.
- [ ] Validate that `.env` files are not committed.
- [ ] Ensure the admin account credentials are stored securely.
