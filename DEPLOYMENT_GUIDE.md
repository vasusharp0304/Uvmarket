# 🚀 UV Market School - Vercel + Turso Deployment Guide

This comprehensive guide will walk you through deploying UV Market School to Vercel with Turso database. This setup is **100% FREE** for small to medium projects.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Prepare Your Code](#step-1-prepare-your-code)
3. [Step 2: Set Up Turso Database](#step-2-set-up-turso-database)
4. [Step 3: Configure Environment Variables](#step-3-configure-environment-variables)
5. [Step 4: Deploy to Vercel](#step-4-deploy-to-vercel)
6. [Step 5: Initialize Database Schema](#step-5-initialize-database-schema)
7. [Step 6: Seed Initial Data (Optional)](#step-6-seed-initial-data-optional)
8. [Step 7: Verify Deployment](#step-7-verify-deployment)
9. [Troubleshooting](#troubleshooting)
10. [Post-Deployment](#post-deployment)

---

## Prerequisites

Before you begin, ensure you have:

- ✅ A GitHub account
- ✅ Git installed on your computer
- ✅ Node.js 18+ installed (for local testing)
- ✅ This project repository

---

## Step 1: Prepare Your Code

### 1.1 Push to GitHub

If you haven't already, push your code to GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: UV Market School"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/uv-market-school.git
git branch -M main
git push -u origin main
```

### 1.2 Verify Code Configuration

Your application is already configured to work with both:
- **Local SQLite** (development) - uses `better-sqlite3`
- **Turso** (production) - uses `@libsql/client`

The adapter is automatically selected in `src/lib/prisma.ts` based on environment variables.

---

## Step 2: Set Up Turso Database

### 2.1 Create Turso Account

1. Go to [turso.tech](https://turso.tech)
2. Click **"Sign Up"** (GitHub login recommended)
3. Complete the signup process

### 2.2 Create Database

1. After login, you'll be in the Turso dashboard
2. Click **"Create Database"**
3. Configure:
   - **Name**: `uv-market-school` (or your preferred name)
   - **Location**: Choose closest to your users (e.g., `Mumbai, India`)
   - **Plan**: Select **"Starter"** (Free forever)
4. Click **"Create"**

### 2.3 Get Database Credentials

1. Click on your newly created database
2. You'll see:
   - **Database URL**: `libsql://uv-market-school-your-org.turso.io`
   - Click **"Generate Token"** or **"Show Token"**
   - Copy both:
     - ✅ Database URL
     - ✅ Auth Token

**Important:** Keep these credentials secure! You'll need them in the next step.

---

## Step 3: Configure Environment Variables

Create a `.env.local` file for local testing (optional):

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in these values:

```env
# Database (Turso)
TURSO_DATABASE_URL="libsql://your-database-name-your-org.turso.io"
TURSO_AUTH_TOKEN="your-turso-auth-token-here"

# Authentication
NEXTAUTH_SECRET="your-super-secret-random-string"
NEXTAUTH_URL="http://localhost:3000"

# Razorpay (Optional - for payment features)
NEXT_PUBLIC_RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
```

### Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

**On Linux/Mac:**
```bash
openssl rand -base64 32
```

**On Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

---

## Step 4: Deploy to Vercel

### 4.1 Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel

### 4.2 Import Project

1. On Vercel dashboard, click **"Add New..."** → **"Project"**
2. Find your GitHub repository: `uv-market-school`
3. Click **"Import"**

### 4.3 Configure Project Settings

#### Framework Preset
- Vercel should auto-detect: **Next.js**

#### Build Settings
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

#### Root Directory
- Leave as `.` (root)

### 4.4 Add Environment Variables

In the **"Environment Variables"** section, add these variables:

| Name | Value | Notes |
|------|-------|-------|
| `TURSO_DATABASE_URL` | `libsql://your-database...` | From Step 2.3 |
| `TURSO_AUTH_TOKEN` | `your-turso-token...` | From Step 2.3 |
| `NEXTAUTH_SECRET` | `your-generated-secret` | From Step 3 |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` | Leave blank for now, update after deployment |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `rzp_live_...` | Optional |
| `RAZORPAY_KEY_SECRET` | `your_secret...` | Optional |

**Important:** For `NEXTAUTH_URL`, you can initially deploy without it, then:
1. Copy your Vercel deployment URL (e.g., `https://uv-market-school.vercel.app`)
2. Add it as an environment variable
3. Redeploy

### 4.5 Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. You'll see: **"Congratulations! Your deployment is ready!"**
4. Copy your deployment URL

### 4.6 Update NEXTAUTH_URL

1. Go to **Project Settings** → **Environment Variables**
2. Find `NEXTAUTH_URL`
3. Edit and set to your deployment URL: `https://your-project.vercel.app`
4. Click **"Save"**
5. Go to **Deployments** tab → Click **"..."** → **"Redeploy"**

---

## Step 5: Initialize Database Schema

Now that your app is deployed, you need to create the database tables.

### 5.1 Push Schema to Turso

Run this **locally** on your computer:

**On Linux/Mac:**
```bash
export TURSO_DATABASE_URL="libsql://your-database..."
export TURSO_AUTH_TOKEN="your-token..."
npx prisma db push
```

**On Windows (PowerShell):**
```powershell
$env:TURSO_DATABASE_URL="libsql://your-database..."
$env:TURSO_AUTH_TOKEN="your-token..."
npx prisma db push
```

You should see:
```
✔ Generated Prisma Client
✔ Your database is now in sync with your schema
```

---

## Step 6: Seed Initial Data (Optional)

Create an admin user and sample data:

### 6.1 Run Seed Script

**On Linux/Mac:**
```bash
export TURSO_DATABASE_URL="libsql://your-database..."
export TURSO_AUTH_TOKEN="your-token..."
npm run seed
```

**On Windows (PowerShell):**
```powershell
$env:TURSO_DATABASE_URL="libsql://your-database..."
$env:TURSO_AUTH_TOKEN="your-token..."
npm run seed
```

### 6.2 Default Admin Credentials

After seeding, you can log in with:
- **Email**: `admin@uvmarketschool.com`
- **Password**: `admin123`

**⚠️ IMPORTANT:** Change this password immediately after first login!

---

## Step 7: Verify Deployment

### 7.1 Check Homepage

1. Visit your deployment URL: `https://your-project.vercel.app`
2. You should see the UV Market School homepage

### 7.2 Test Authentication

1. Click **"Login"**
2. Use the admin credentials (if seeded)
3. Verify you can access the dashboard

### 7.3 Test Admin Panel

1. Login as admin
2. Navigate to `/admin`
3. Check:
   - Customers list
   - Signals management
   - Subscription plans
   - Settings

### 7.4 Check Database Connection

1. Go to Admin → Settings
2. Try updating app settings
3. If successful, database is working correctly

---

## Troubleshooting

### Issue: Build Fails

**Error:** `Cannot find module '@/generated/prisma/client'`

**Solution:**
1. The `prisma generate` command runs automatically in `npm run build`
2. Check Vercel build logs for specific errors
3. Ensure `prisma/schema.prisma` is committed to Git

### Issue: Database Connection Error

**Error:** `Error: connect ECONNREFUSED` or `LibsqlError`

**Solution:**
1. Verify `TURSO_DATABASE_URL` starts with `libsql://`
2. Verify `TURSO_AUTH_TOKEN` is correct
3. Check Turso dashboard to ensure database is active
4. Run `npx prisma db push` to create tables

### Issue: NextAuth Error

**Error:** `[next-auth][error][NO_SECRET]`

**Solution:**
1. Ensure `NEXTAUTH_SECRET` is set in Vercel
2. Generate a new secret: `openssl rand -base64 32`
3. Redeploy after adding the variable

### Issue: CORS or API Route Errors

**Solution:**
1. Check Vercel function logs: Vercel Dashboard → Your Project → Logs
2. Ensure `NEXTAUTH_URL` matches your deployment URL exactly
3. Clear browser cache and cookies

### Issue: Razorpay Not Working

**Solution:**
1. Verify `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set (must start with `NEXT_PUBLIC_`)
2. Verify `RAZORPAY_KEY_SECRET` is set
3. Use **Test Mode** keys for testing
4. Switch to **Live Mode** keys for production

### Issue: Upload/File Storage Not Working

**Note:** Vercel has a read-only filesystem. For production file uploads, you'll need:
1. **AWS S3** - Most popular, pay-as-you-go
2. **Cloudinary** - Free tier available
3. **Vercel Blob Storage** - Paid add-on

For now, the app stores file paths in the database. To enable actual file storage:
1. Choose a service (e.g., Cloudinary)
2. Update upload endpoints in `src/app/api/upload/route.ts`
3. Add environment variables for the service

---

## Post-Deployment

### Security Checklist

- [ ] Change default admin password
- [ ] Set strong `NEXTAUTH_SECRET`
- [ ] Use HTTPS only (Vercel provides this automatically)
- [ ] Enable 2FA on Vercel account
- [ ] Review Turso database access logs
- [ ] Set up Razorpay webhooks (for payment notifications)

### Custom Domain (Optional)

1. Go to Vercel Project → Settings → Domains
2. Click **"Add Domain"**
3. Enter your domain: `www.uvmarketschool.com`
4. Follow DNS configuration instructions
5. Update `NEXTAUTH_URL` to your custom domain

### Monitoring

- **Vercel Analytics**: Automatically enabled (free)
- **Error Tracking**: Check Vercel → Project → Logs
- **Database Monitoring**: Turso Dashboard → Your Database → Metrics

### Backups

Turso automatically backs up your data. To create manual backups:

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Backup database
turso db shell uv-market-school ".dump" > backup.sql
```

---

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `TURSO_DATABASE_URL` | Yes | Turso database URL | `libsql://db-name.turso.io` |
| `TURSO_AUTH_TOKEN` | Yes | Turso auth token | `eyJ...` |
| `NEXTAUTH_SECRET` | Yes | NextAuth secret key | `your-secret-32-chars` |
| `NEXTAUTH_URL` | Yes | Your app URL | `https://yourapp.vercel.app` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | No | Razorpay public key | `rzp_live_...` |
| `RAZORPAY_KEY_SECRET` | No | Razorpay secret key | `your_secret` |
| `NODE_ENV` | Auto | Environment | `production` (set by Vercel) |

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Turso Documentation](https://docs.turso.tech/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma with Turso](https://www.prisma.io/docs/orm/overview/databases/turso)
- [NextAuth.js Documentation](https://next-auth.js.org/)

---

## Need Help?

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review Vercel deployment logs
3. Check Turso database status
4. Verify all environment variables are set correctly

---

**🎉 Congratulations!** Your UV Market School application is now live on Vercel with Turso database.

**Next Steps:**
1. Change the default admin password
2. Configure subscription plans
3. Set up Razorpay for payments
4. Customize branding in Admin → Settings
5. Start adding trading signals!

---

*Last Updated: February 2026*
