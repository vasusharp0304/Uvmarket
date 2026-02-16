# Deployment Guide - UV Market School

This guide will help you deploy UV Market School to Vercel with all configurations properly set up.

## Prerequisites

1. A Vercel account (free tier works)
2. A Turso database account (free tier available)
3. A Razorpay account (for payment processing)
4. GitHub repository with the code

## Step 1: Set Up Turso Database

1. Go to [Turso](https://turso.tech) and sign up
2. Create a new database:
   ```bash
   # Using Turso CLI (recommended)
   turso db create uv-market-school
   ```

3. Get your database URL and auth token:
   ```bash
   turso db tokens create uv-market-school
   ```

4. Save these values - you'll need them for Vercel environment variables

## Step 2: Generate NextAuth Secret

Generate a secure secret for NextAuth.js:

```bash
openssl rand -base64 32
```

Save this value - you'll need it for the `NEXTAUTH_SECRET` environment variable.

## Step 3: Set Up Razorpay (Optional)

If you want to enable payments:

1. Go to [Razorpay](https://razorpay.com) and sign up
2. Get your API Key ID and Key Secret from the Razorpay dashboard
3. Save these values for environment variables

## Step 4: Deploy to Vercel

### Option A: Using Vercel Dashboard

1. Go to [Vercel](https://vercel.com) and click "Add New Project"
2. Import your GitHub repository
3. Configure environment variables:

| Variable Name | Value | Required |
|--------------|-------|----------|
| `NEXTAUTH_URL` | Your Vercel domain (e.g., `https://your-app.vercel.app`) | Yes |
| `NEXTAUTH_SECRET` | The secret generated in Step 2 | Yes |
| `TURSO_DATABASE_URL` | Your Turso database URL (e.g., `libsql://your-db.turso.io`) | Yes |
| `TURSO_AUTH_TOKEN` | Your Turso auth token | Yes |
| `RAZORPAY_KEY_ID` | Your Razorpay Key ID | No |
| `RAZORPAY_KEY_SECRET` | Your Razorpay Key Secret | No |

4. Click "Deploy"
5. Wait for deployment to complete

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables
vercel env add NEXTAUTH_SECRET
vercel env add TURSO_DATABASE_URL
vercel env add TURSO_AUTH_TOKEN
vercel env add NEXTAUTH_URL

# Redeploy with env variables
vercel --prod
```

## Step 5: Seed the Database

After successful deployment, seed the database with the admin user:

### Option A: Using API Endpoint (Recommended)

1. After deployment, visit: `https://your-app.vercel.app/api/admin/seed`
2. You should see a success response indicating the admin user was created
3. Note: For security, you may want to restrict this endpoint or remove it after initial setup

### Option B: Using Vercel CLI

```bash
# SSH into the deployment and run the seed
vercel logs --follow
# Then trigger the seed endpoint via curl or similar
```

## Step 6: Login to Your Application

After deployment and seeding:

1. Visit `https://your-app.vercel.app/login`
2. Login with the admin credentials:
   - Email: `uvmarketsignal@gmail.com`
   - Password: `Admin@123456`

3. You'll be redirected to the admin dashboard
4. Change your password immediately from the admin profile settings

## Step 7: Configure Your Application

After logging in as admin:

1. **Configure Company Details**: Go to Admin > Settings
   - Update company name, address, GST details
   - Update logo and branding

2. **Create Subscription Plans**: Go to Admin > Plans
   - Create subscription plans (Monthly, Quarterly, Yearly)
   - Set pricing and features

3. **Add Initial Signals**: Go to Admin > Signals
   - Add trading signals for your customers
   - Set visibility and pricing

## Environment Variables Reference

### Required Variables

- `NEXTAUTH_URL`: The full URL of your deployed application
- `NEXTAUTH_SECRET`: A random string used to encrypt tokens (generate with `openssl rand -base64 32`)
- `TURSO_DATABASE_URL`: Your Turso database URL (format: `libsql://<database-host>`)
- `TURSO_AUTH_TOKEN`: Your Turso authentication token

### Optional Variables

- `DATABASE_URL`: Local SQLite database URL (for local development only)
- `RAZORPAY_KEY_ID`: Razorpay API Key ID
- `RAZORPAY_KEY_SECRET`: Razorpay API Key Secret
- `NODE_ENV`: Set to `production` automatically by Vercel

## Troubleshooting

### Database Connection Issues

If you see database connection errors:

1. Verify your Turso database URL and auth token are correct
2. Check that your Turso database is active (not suspended)
3. Ensure you're using the correct database URL format: `libsql://your-db.turso.io`

### Authentication Issues

If authentication fails:

1. Verify `NEXTAUTH_SECRET` is set correctly
2. Ensure `NEXTAUTH_URL` matches your deployed domain exactly (including https://)
3. Check that the admin user was created in the database

### Build Errors

If the build fails:

1. Check Vercel build logs for specific errors
2. Ensure all dependencies are installed (handled automatically by Vercel)
3. Verify Prisma schema is valid

## Local Development

For local development:

1. Copy `.env.example` to `.env`
2. Set up local variables:
   ```
   DATABASE_URL=file:./dev.db
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-local-secret
   ```
3. Run database setup:
   ```bash
   npm run db:setup
   npm run db:seed
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Security Considerations

1. **Change Default Password**: Change the admin password immediately after first login
2. **Remove Seed Endpoint**: Consider removing the `/api/admin/seed` endpoint after initial deployment
3. **Use HTTPS**: Always use HTTPS in production (Vercel does this automatically)
4. **Rotate Secrets**: Regularly rotate your `NEXTAUTH_SECRET` and other sensitive secrets
5. **Monitor Logs**: Regularly check Vercel logs for suspicious activity

## Scaling Considerations

- Turso free tier has limits, upgrade as needed
- Vercel free tier has bandwidth limits, upgrade as needed
- Consider adding CDN for static assets if needed
- Implement caching strategies for frequently accessed data

## Support

For issues or questions:
- Check the Vercel deployment logs
- Review Turso database status
- Verify all environment variables are set correctly
- Check the application logs in the admin dashboard

## Updates and Maintenance

To update the application:

1. Push changes to your GitHub repository
2. Vercel will automatically trigger a new deployment
3. Monitor the deployment in Vercel dashboard
4. Run database migrations if schema changes were made
5. Test the application after deployment

## Database Migrations

If you make schema changes:

1. Update `prisma/schema.prisma`
2. Generate Prisma client: `npx prisma generate`
3. For Turso, create a migration: `npx prisma migrate deploy`
4. Redeploy to Vercel

## Backup Strategy

- Turso provides automatic backups
- Regularly export your data: `turso db shell uv-market-school --export backup.sql`
- Store backups securely off-site
