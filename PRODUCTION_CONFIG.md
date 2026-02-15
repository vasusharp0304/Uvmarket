# Production Configuration

## Environment Variables
Set these in your hosting provider (Vercel recommended):

```bash
TURSO_DATABASE_URL=libsql://uvmarketschool-vasusharp0304.aws-ap-south-1.turso.io
TURSO_AUTH_TOKEN=***
DATABASE_URL=libsql://uvmarketschool-vasusharp0304.aws-ap-south-1.turso.io
NEXTAUTH_SECRET=***
NEXTAUTH_URL=https://your-production-domain.com
RAZORPAY_KEY_ID=***
RAZORPAY_KEY_SECRET=***
```

## Build & Start Commands
- **Build:** `npm run build`
- **Start:** `npm run start`

## Database Verification
Run the connection test using the Turso credentials:

```bash
npm run db:test
```

## Prisma Schema Deployment
```bash
npx prisma db push
```

## Hosting Notes (Vercel)
- Framework preset: **Next.js**
- Output directory: **.next** (default)
- Install command: **npm install**
- Node version: **18.x or 20.x** (LTS)
