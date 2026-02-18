# Railway Deployment Guide for UV Market School

This guide explains how to deploy the UV Market School application to Railway with PostgreSQL.

## Prerequisites

1. A [Railway](https://railway.app) account
2. Your code pushed to a GitHub repository
3. (Optional) A custom domain

## Deployment Steps

### 1. Create a Railway Project

1. Log in to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

### 2. Add PostgreSQL Database

1. In your Railway project, click "New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will automatically create a PostgreSQL database and set the `DATABASE_URL` environment variable

### 3. Configure Environment Variables

Go to your service's "Variables" tab and add the following:

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXTAUTH_URL` | `https://your-app.up.railway.app` | Your Railway app URL |
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` | JWT encryption secret |
| `DATABASE_URL` | (Auto-filled by Railway) | PostgreSQL connection string |
| `NODE_ENV` | `production` | Environment mode |
| `RAZORPAY_KEY_ID` | (Optional) | Razorpay API key |
| `RAZORPAY_KEY_SECRET` | (Optional) | Razorpay API secret |

**Note:** `DATABASE_URL` is automatically set by Railway when you add PostgreSQL.

### 4. Deploy the Application

1. Railway will automatically deploy when you push to your repository
2. Or trigger a manual deploy from the Railway dashboard
3. The build process will:
   - Install dependencies
   - Generate Prisma client
   - Run database migrations (`prisma migrate deploy`)
   - Build the Next.js application

### 5. Seed the Database

After the first deployment, seed the database with the admin user:

```bash
# Using curl
curl -X POST https://your-app.up.railway.app/api/admin/seed

# Or visit in browser
https://your-app.up.railway.app/api/admin/seed
```

**Default Admin Credentials:**
- Email: `uvmarketsignal@gmail.com`
- Password: `Admin@123456`

⚠️ **Important:** Change the admin password immediately after first login!

### 6. Verify Deployment

Check the health endpoint:
```bash
curl https://your-app.up.railway.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-02-18T00:00:00.000Z",
  "database": "connected",
  "version": "0.1.0"
}
```

## Troubleshooting

### Database Connection Issues

1. Verify `DATABASE_URL` is set correctly
2. Check that the database migration ran successfully in the build logs
3. Test connection manually:
   ```bash
   railway connect postgres
   ```

### Build Failures

1. Check the build logs in Railway dashboard
2. Ensure all environment variables are set
3. Verify the `npm run build` script works locally:
   ```bash
   npm run build
   ```

### Migration Failures

If migrations fail, you can reset them:

1. Connect to the database via Railway CLI
2. Drop and recreate the database, or
3. Manually run migrations:
   ```bash
   npx prisma migrate deploy
   ```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Railway Platform                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    Next.js App                         │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  │  │
│  │  │   Web App   │  │  API Routes  │  │  PWA Assets  │  │  │
│  │  └─────────────┘  └──────────────┘  └──────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                │
│  ┌─────────────────────────┴─────────────────────────────┐  │
│  │              Prisma ORM with @prisma/adapter-pg       │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                │
│  ┌─────────────────────────┴─────────────────────────────┐  │
│  │              PostgreSQL Database (Railway)            │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Database Configuration

The application supports multiple database backends:

1. **PostgreSQL** (Railway Production) - Primary
2. **Turso/LibSQL** (Alternative Cloud)
3. **SQLite** (Local Development)

The `prisma.config.ts` automatically detects the database type based on the URL format:
- `postgres://` → PostgreSQL with `@prisma/adapter-pg`
- `libsql://` → Turso with `@prisma/adapter-libsql`
- `file:` or default → SQLite with `@prisma/adapter-better-sqlite3`

## Environment Variables Reference

### Required

| Variable | Description |
|----------|-------------|
| `NEXTAUTH_URL` | Canonical URL of your app |
| `NEXTAUTH_SECRET` | Secret for JWT encryption |
| `DATABASE_URL` | PostgreSQL connection string |

### Optional

| Variable | Description |
|----------|-------------|
| `RAZORPAY_KEY_ID` | Razorpay API key for payments |
| `RAZORPAY_KEY_SECRET` | Razorpay API secret |
| `TURSO_DATABASE_URL` | Alternative Turso database URL |
| `TURSO_AUTH_TOKEN` | Turso authentication token |

## Maintenance

### Database Migrations

Migrations run automatically during build. To create a new migration locally:

```bash
npx prisma migrate dev --name your_migration_name
```

### Viewing Logs

```bash
# View logs
railway logs

# Follow logs
railway logs --follow
```

### Scaling

Railway automatically scales based on traffic. For database scaling:

1. Go to your PostgreSQL service in Railway
2. Click "Settings" → "Scale"
3. Adjust resources as needed

## Security Checklist

- [ ] Change default admin password after first login
- [ ] Set a strong `NEXTAUTH_SECRET` (32+ characters)
- [ ] Enable HTTPS (automatic on Railway)
- [ ] Configure CORS if using custom domains
- [ ] Set up database backups (automatic on Railway)
- [ ] Review and update Razorpay webhook URLs if using payments

## Support

For issues related to:
- **Railway**: Check [Railway Documentation](https://docs.railway.app)
- **Prisma**: Check [Prisma Documentation](https://www.prisma.io/docs)
- **Next.js**: Check [Next.js Documentation](https://nextjs.org/docs)

## Post-Deployment Checklist

1. [ ] Access the app at your Railway URL
2. [ ] Verify health endpoint returns 200
3. [ ] Seed the database (`/api/admin/seed`)
4. [ ] Log in with admin credentials
5. [ ] Change admin password
6. [ ] Configure app settings in admin panel
7. [ ] Test all features:
   - [ ] User registration/login
   - [ ] Trading signals
   - [ ] Chat functionality
   - [ ] Payment flow (if Razorpay configured)
   - [ ] PWA installation
