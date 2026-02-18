# UV Market School - Deployment Guide

## Overview
This guide will help you deploy the UV Market School application to Railway (or any similar platform).

## Prerequisites

- Node.js 18+ installed
- Git account
- Railway account (free tier is sufficient)
- Turso account for database (optional, recommended for production)

## Pre-Deployment Checklist

### 1. Environment Variables

Create the following environment variables in Railway or your hosting platform:

**Required:**
```
NEXTAUTH_URL=https://your-app-domain.railway.app
NEXTAUTH_SECRET=your-secret-key-here (generate with: openssl rand -base64 32)
```

**Optional (for production):**
```
TURSO_DATABASE_URL=libsql://your-database-name.turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token
```

**Optional (for payments):**
```
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

### 2. Database Setup (Production)

**Option A: Use Turso (Recommended)**
1. Create a free account at https://turso.tech
2. Create a new database: `turso db create uv-market-school`
3. Get auth token: `turso db tokens create uv-market-school`
4. Copy the database URL and auth token to your environment variables

**Option B: Use Railway PostgreSQL**
1. Add a PostgreSQL service in Railway
2. Update `DATABASE_URL` environment variable
3. Run migrations: `npx prisma migrate deploy`

### 3. Initial Database Seed

After deployment, you'll need to seed the database with initial data:

1. Access your deployed app's Railway console
2. Open a shell/terminal
3. Run: `npm run db:seed:prod`

This will create:
- Admin user: `uvmarketsignal@gmail.com` (you'll need to set the password)
- Sample subscription plans
- Sample trading signals

## Deployment Steps

### Railway Deployment

1. **Create New Project**
   - Go to https://railway.app/new
   - Select "Deploy from GitHub repo"
   - Connect your GitHub account
   - Select the `uv-market-school` repository

2. **Configure Build Settings**
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Node Version: 18 or higher

3. **Set Environment Variables**
   - Go to the "Variables" tab in Railway
   - Add all the environment variables listed above

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (2-3 minutes)
   - Railway will provide a URL (e.g., `https://uv-market-school.up.railway.app`)

5. **Add Custom Domain (Optional)**
   - Go to "Settings" > "Domains"
   - Add your custom domain
   - Update DNS records as instructed

## Post-Deployment Verification

### 1. Check Build Status
- Open Railway console
- Verify build completed without errors
- Check logs for any runtime issues

### 2. Test Admin Access
- Navigate to `/login`
- Use admin credentials (created during seed)
- Access `/admin` dashboard
- Verify all admin features work

### 3. Test Customer Features
- Register a new customer account
- Access `/dashboard`
- View signals, use chat, check profile

### 4. Test PWA
- Open the app in mobile browser (Chrome/Safari on mobile)
- Try to "Add to Home Screen"
- Verify app launches in standalone mode
- Test offline functionality (basic pages should work)

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify Node version compatibility
- Check Railway build logs for specific errors

### Database Connection Issues
- Verify `DATABASE_URL` or `TURSO_DATABASE_URL` is set
- Check database service is running
- Test connection: `npm run db:test`

### Authentication Issues
- Verify `NEXTAUTH_SECRET` is set and long enough (32+ chars)
- Check `NEXTAUTH_URL` matches your deployed domain
- Clear browser cookies and try again

### PWA Not Working
- Verify `manifest.json` is accessible at `/manifest.json`
- Check service worker is registered in browser console
- Ensure icons exist in `/public/icons/`

## Performance Optimization

1. Enable caching in Railway
2. Use CDN for static assets
3. Optimize images (already using unoptimized: true for compatibility)
4. Monitor database query performance
5. Set up automatic backups

## Security Checklist

- [ ] All API endpoints are protected
- [ ] HTTPS is enforced
- [ ] Environment variables are not exposed
- [ ] Database credentials are secure
- [ ] Rate limiting is implemented (if needed)
- [ ] CORS is properly configured
- [ ] Admin routes are protected
- [ ] User input is validated

## Monitoring

Set up monitoring for:
- Error tracking (consider Sentry)
- Performance metrics
- User analytics
- Database performance
- Uptime monitoring

## Backup Strategy

1. **Database Backups:**
   - Railway offers automatic backups
   - Export regular backups: `npx prisma db pull`

2. **Media Files:**
   - Store uploads in object storage (S3, Cloudflare R2)
   - Keep local backups of user-uploaded content

## Scaling

When you need to scale:
1. Upgrade Railway plan for more resources
2. Add read replicas for database
3. Implement caching layer (Redis)
4. Use CDN for static assets
5. Consider microservices architecture

## Support

For issues or questions:
- Check logs in Railway console
- Review this guide
- Check Next.js and Railway documentation
- Review Prisma documentation for database issues

## Success Criteria

Your deployment is successful when:
- ✅ Build completes without errors
- ✅ Application loads at the deployed URL
- ✅ Admin can login and access dashboard
- ✅ Customers can register and login
- ✅ All features (signals, chat, etc.) work correctly
- ✅ PWA can be installed on mobile devices
- ✅ No TypeScript or runtime errors in console
- ✅ Database operations work correctly
