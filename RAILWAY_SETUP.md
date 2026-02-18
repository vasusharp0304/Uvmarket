# Railway Deployment Quick Start Guide

This guide will help you deploy UV Market School to Railway with PostgreSQL in just a few minutes.

## 🚀 Quick Start (5 Steps)

### Step 1: Push Your Code to GitHub

Ensure your code is pushed to a GitHub repository that Railway can access.

```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### Step 2: Create Railway Project

1. Go to [railway.app](https://railway.app) and sign in/sign up
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository
5. Railway will automatically detect it's a Next.js app

### Step 3: Add PostgreSQL Database

1. In your Railway project, click **"New"** → **"Database"**
2. Select **"PostgreSQL"**
3. Railway will automatically:
   - Create a PostgreSQL database
   - Set the `DATABASE_URL` environment variable

### Step 4: Set Environment Variables

Go to your web service's **"Variables"** tab and add these:

| Variable | Value | Required |
|----------|-------|----------|
| `NEXTAUTH_URL` | Your Railway URL (e.g., `https://uv-market.up.railway.app`) | ✅ Yes |
| `NEXTAUTH_SECRET` | Generate with: `openssl rand -base64 32` | ✅ Yes |
| `NODE_ENV` | `production` | ✅ Yes |
| `RAZORPAY_KEY_ID` | Your Razorpay Key ID (optional) | ❌ No |
| `RAZORPAY_KEY_SECRET` | Your Razorpay Secret (optional) | ❌ No |

**Important:** `DATABASE_URL` is automatically set by Railway - don't set it manually!

### Step 5: Deploy

Railway will automatically deploy when you save the variables. Wait for the build to complete.

## 🎯 Post-Deployment Setup

### 1. Verify Health Check

Check if your app is running:
```bash
curl https://your-app.up.railway.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-02-18T...",
  "database": "connected",
  "version": "0.1.0"
}
```

### 2. Seed Database (Create Admin User)

Visit this URL in your browser:
```
https://your-app.up.railway.app/api/admin/seed
```

Or use curl:
```bash
curl -X POST https://your-app.up.railway.app/api/admin/seed
```

### 3. Login to Admin Panel

Go to your app URL and login with:
- **Email:** `uvmarketsignal@gmail.com`
- **Password:** `Admin@123456`

⚠️ **IMPORTANT:** Change the admin password immediately after first login!

## 📋 Configuration Files Included

This repository includes all necessary Railway configuration files:

- ✅ `railway.json` - Railway project configuration
- ✅ `Procfile` - Startup command
- ✅ `.env.railway.example` - Environment variable reference
- ✅ `prisma/schema.prisma` - PostgreSQL database schema
- ✅ `src/lib/prisma.ts` - Database client with PostgreSQL support
- ✅ `package.json` - Railway-compatible scripts

## 🔧 How It Works

### Database Detection

The application automatically detects the database type:

```typescript
// PostgreSQL (Railway)
DATABASE_URL="postgres://..."

// Turso (Alternative)
TURSO_DATABASE_URL="libsql://..."

// SQLite (Local Development)
DATABASE_URL="file:./dev.db"
```

### Build Process

Railway automatically runs:
```bash
npm run build
```

Which does:
```bash
prisma generate           # Generate Prisma client
prisma migrate deploy     # Run database migrations
next build                # Build Next.js app
```

### Startup Process

Railway automatically runs:
```bash
npm start
```

Which starts the Next.js production server.

## 🌐 PWA Support

The application includes PWA support with:
- ✅ Service Worker (`/public/sw.js`)
- ✅ Web Manifest (`/public/manifest.json`)
- ✅ Offline support
- ✅ Push notifications
- ✅ Installable on mobile devices

PWA works out of the box on Railway - no additional configuration needed!

## 🐛 Troubleshooting

### Build Fails

1. Check build logs in Railway dashboard
2. Verify `DATABASE_URL` is set (auto by Railway)
3. Check environment variables are correct

### Database Connection Issues

```bash
# Connect to database via Railway CLI
railway connect postgres

# Or check DATABASE_URL format
# Should be: postgres://user:pass@host:port/db
```

### Migrations Fail

If migrations fail, you can reset:

```bash
# Via Railway CLI
railway connect postgres
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

# Then trigger a redeploy
```

### Health Check Fails

1. Check if DATABASE_URL is set correctly
2. Verify database is running in Railway
3. Check application logs for errors

## 📊 Monitoring

### View Logs

```bash
# Via Railway CLI
railway logs --follow

# Or in Railway Dashboard
# Click on your service → "Logs" tab
```

### Check Database

```bash
# Connect to database
railway connect postgres

# Query data
SELECT * FROM "User" WHERE role = 'ADMIN';
```

## 🔐 Security Checklist

- [ ] Change default admin password
- [ ] Use strong `NEXTAUTH_SECRET` (32+ chars)
- [ ] HTTPS is enabled (automatic on Railway)
- [ ] Database backups enabled (automatic on Railway)
- [ ] Review and update API keys regularly
- [ ] Use environment variables for secrets

## 🚀 Custom Domain (Optional)

### 1. Add Custom Domain

1. Go to Railway Dashboard → Your Service → "Settings"
2. Click "Networking" → "Custom Domains"
3. Add your domain (e.g., `app.uvmarketschool.com`)

### 2. Update Environment Variables

Update `NEXTAUTH_URL` to your custom domain:
```
NEXTAUTH_URL=https://app.uvmarketschool.com
```

### 3. Update DNS

Add CNAME record in your DNS provider:
```
Type: CNAME
Name: app
Value: your-app.up.railway.app
```

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) - Detailed deployment guide

## ✅ Deployment Checklist

Before considering deployment complete:

- [ ] Code pushed to GitHub
- [ ] Railway project created
- [ ] PostgreSQL database added
- [ ] Environment variables set (NEXTAUTH_URL, NEXTAUTH_SECRET)
- [ ] Build completed successfully
- [ ] Health check returns 200
- [ ] Database seeded with admin user
- [ ] Can login to admin panel
- [ ] Admin password changed
- [ ] Test user registration
- [ ] Test trading signals
- [ ] Test PWA installation
- [ ] Custom domain configured (optional)

## 🎉 You're Done!

Your UV Market School application is now live on Railway with:
- ✅ PostgreSQL database
- ✅ Auto-scaling infrastructure
- ✅ SSL/HTTPS enabled
- ✅ Database backups
- ✅ PWA support
- ✅ Health monitoring

For issues or questions, check the Railway logs or refer to the documentation.

---

**Need Help?**

- Check [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for detailed guide
- Review Railway logs in dashboard
- Test database connection with `/api/health` endpoint
