# Production Configuration Guide

This guide covers the essential configuration needed to deploy UV Market School to production.

## Quick Start

1. Copy `.env.example` to `.env` and fill in production values
2. Run `npm run env:verify:prod` to verify configuration
3. Deploy to Vercel (or your preferred platform)
4. Visit `/api/admin/seed` to initialize the database
5. Login with admin credentials

## Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXTAUTH_URL` | Your deployed application URL | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Random string for JWT encryption | Generate with `openssl rand -base64 32` |
| `TURSO_DATABASE_URL` | Turso database URL | `libsql://your-db.turso.io` |
| `TURSO_AUTH_TOKEN` | Turso authentication token | From Turso dashboard |

## Step-by-Step Setup

### 1. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Copy the output and use it as your `NEXTAUTH_SECRET`.

### 2. Set Up Turso Database

```bash
# Install Turso CLI (if not already installed)
curl -sSfL https://get.tur.so/install.sh | bash

# Login to Turso
turso auth login

# Create database
turso db create uv-market-school

# Get database URL
turso db show uv-market-school

# Create auth token
turso db tokens create uv-market-school
```

### 3. Configure Environment Variables

#### For Vercel Deployment:

1. Go to your project settings in Vercel dashboard
2. Navigate to "Environment Variables"
3. Add each required variable:
   - `NEXTAUTH_URL`: Your Vercel domain (e.g., `https://uv-market-school.vercel.app`)
   - `NEXTAUTH_SECRET`: The secret generated in step 1
   - `TURSO_DATABASE_URL`: From Turso (e.g., `libsql://uv-market-school-username.turso.io`)
   - `TURSO_AUTH_TOKEN`: From step 2

#### For Local Testing with Production Database:

Create a `.env.local` file:

```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-production-secret
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-turso-token
```

### 4. Verify Configuration

```bash
# Verify local environment
npm run env:verify

# Verify production environment
npm run env:verify:prod
```

### 5. Deploy

```bash
# Build and deploy
vercel --prod
```

Or push to GitHub and let Vercel auto-deploy.

### 6. Initialize Database

After deployment, seed the database:

```bash
# Visit the seed endpoint in your browser or use curl
curl -X POST https://your-app.vercel.app/api/admin/seed
```

Expected response:
```json
{
  "success": true,
  "message": "Database seeded successfully",
  "adminEmail": "uvmarketsignal@gmail.com"
}
```

### 7. Login

1. Visit `https://your-app.vercel.app/login`
2. Login with:
   - Email: `uvmarketsignal@gmail.com`
   - Password: `Admin@123456`
3. **Important**: Change the password immediately after first login!

## Troubleshooting

### "Cannot find module" errors

Make sure `postinstall` script runs during deployment. Check Vercel build logs.

### Database connection errors

1. Verify `TURSO_DATABASE_URL` starts with `libsql://`
2. Check that `TURSO_AUTH_TOKEN` is valid and not expired
3. Ensure Turso database is active (not suspended due to inactivity)

### Authentication errors

1. Verify `NEXTAUTH_SECRET` is set and at least 32 characters
2. Ensure `NEXTAUTH_URL` matches your domain exactly (including `https://`)
3. Check that admin user exists: Visit `/api/admin/seed` (GET) to check status

### "JWT must be provided" errors

This usually means cookies aren't being set properly. Check:
- `NEXTAUTH_URL` is correct
- You're using HTTPS in production
- Cookies are enabled in browser

## Security Checklist

- [ ] `NEXTAUTH_SECRET` is a random string (32+ characters)
- [ ] Changed default admin password after first login
- [ ] Using HTTPS (automatic on Vercel)
- [ ] Removed or restricted `/api/admin/seed` endpoint after initial setup (optional)
- [ ] Set up proper CORS headers if needed
- [ ] Enabled email verification (if using email provider)

## Vercel-Specific Notes

- **Build Command**: `prisma generate && next build` (set automatically by framework detection)
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node Version**: 18.x or 20.x (LTS recommended)

## Database Migrations

Turso uses SQLite-compatible migrations:

```bash
# Generate migration from schema changes
npx prisma migrate dev --name your_migration_name

# Deploy migration to Turso
npx prisma migrate deploy
```

Note: For Turso/LibSQL, you may need to run migrations manually or use the Turso CLI.

## Support

For deployment issues:
1. Check Vercel deployment logs
2. Verify environment variables in Vercel dashboard
3. Test database connection: `npm run db:test`
4. Check application logs in Vercel
