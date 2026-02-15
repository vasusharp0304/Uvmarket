# 🚀 Quick Start: Deploy to Vercel + Turso

**Estimated Time:** 15 minutes  
**Cost:** $0 (100% Free)

---

## What You'll Deploy

- **Application**: UV Market School (Trading Signals Platform)
- **Frontend/Backend**: Next.js 16 on Vercel
- **Database**: Turso (LibSQL/SQLite) - 500MB free
- **Authentication**: NextAuth.js with JWT sessions
- **Payments**: Razorpay (optional)

---

## 📦 What You Need

Before starting, have these ready:

1. **GitHub Account** - [Sign up](https://github.com/signup)
2. **Vercel Account** - [Sign up](https://vercel.com/signup)
3. **Turso Account** - [Sign up](https://turso.tech)
4. **Razorpay Account** - [Sign up](https://razorpay.com) *(optional - for payments)*

---

## 🎯 5-Minute Quick Deploy

### Step 1: Set Up Turso Database (3 minutes)

1. Go to [turso.tech](https://turso.tech) → Sign up with GitHub
2. Click "Create Database"
   - Name: `uv-market-school`
   - Location: Choose closest to your users
   - Plan: "Starter" (Free)
3. Click on your database → **Copy these:**
   - ✅ Database URL (starts with `libsql://`)
   - ✅ Auth Token (click "Generate Token")

### Step 2: Deploy to Vercel (2 minutes)

1. Push your code to GitHub (if not already)
2. Go to [vercel.com](https://vercel.com) → "New Project"
3. Import your GitHub repo: `uv-market-school`
4. Add Environment Variables:

```env
TURSO_DATABASE_URL=libsql://uv-market-school-yourorg.turso.io
TURSO_AUTH_TOKEN=eyJhbGc...your-token...
NEXTAUTH_SECRET=your-generated-secret-min-32-chars
NEXTAUTH_URL=https://your-project.vercel.app
```

5. Click **"Deploy"** → Wait 2-3 minutes

### Step 3: Initialize Database (1 minute)

On your local computer, run:

**Mac/Linux:**
```bash
export TURSO_DATABASE_URL="libsql://..."
export TURSO_AUTH_TOKEN="your-token"
npx prisma db push
npm run seed
```

**Windows (PowerShell):**
```powershell
$env:TURSO_DATABASE_URL="libsql://..."
$env:TURSO_AUTH_TOKEN="your-token"
npx prisma db push
npm run seed
```

### Step 4: Access Your App

1. Visit: `https://your-project.vercel.app`
2. Login with:
   - **Email:** `admin@uvmarketschool.com`
   - **Password:** `admin123`
3. **Change password immediately!**

---

## 🔐 Generate NEXTAUTH_SECRET

You need a secure random string for `NEXTAUTH_SECRET`:

**Mac/Linux:**
```bash
openssl rand -base64 32
```

**Windows (PowerShell):**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

Or use an online generator: [generate-secret.vercel.app](https://generate-secret.vercel.app/32)

---

## 📝 Full Environment Variables

Copy these to Vercel → Your Project → Settings → Environment Variables:

```env
# Required
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-turso-token
NEXTAUTH_SECRET=your-32-char-secret
NEXTAUTH_URL=https://your-project.vercel.app

# Optional (for payments)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your_secret
```

---

## 🛠️ Automated Setup Scripts

We've included setup scripts for easier deployment:

### Linux/Mac:
```bash
chmod +x scripts/setup-turso.sh
export TURSO_DATABASE_URL="libsql://..."
export TURSO_AUTH_TOKEN="..."
./scripts/setup-turso.sh
```

### Windows (PowerShell):
```powershell
$env:TURSO_DATABASE_URL="libsql://..."
$env:TURSO_AUTH_TOKEN="..."
.\scripts\setup-turso.ps1
```

These scripts will:
- ✅ Generate Prisma client
- ✅ Push database schema to Turso
- ✅ Seed initial data (optional)

---

## ✅ Verify Deployment

After deployment, check:

1. **Homepage**: `https://your-project.vercel.app`
2. **Login**: `/login` - Test with admin credentials
3. **Dashboard**: `/dashboard` - Should load after login
4. **Admin Panel**: `/admin` - Admin users only
5. **API Health**: `/api/auth/session` - Should return JSON

---

## 🚨 Common Issues & Fixes

### Build Error: "Cannot find module '@/generated/prisma/client'"

**Fix:** This is handled automatically by the build command. If it persists:
1. Check `package.json` → `scripts.build` includes `prisma generate`
2. Ensure `prisma/schema.prisma` exists in your repo

### Database Connection Error

**Fix:**
1. Verify `TURSO_DATABASE_URL` starts with `libsql://`
2. Check token is correct in Turso dashboard
3. Ensure you ran `npx prisma db push` to create tables

### NextAuth Error: "[next-auth][error][NO_SECRET]"

**Fix:**
1. Add `NEXTAUTH_SECRET` in Vercel environment variables
2. Redeploy the project

### Page Shows "This page could not be found"

**Fix:**
1. Clear cache: Vercel Dashboard → Deployments → ... → Clear Cache
2. Check `NEXTAUTH_URL` matches your deployment URL exactly

---

## 🎨 Customize Your App

After successful deployment:

1. **Change Admin Password**
   - Login → Profile → Change Password

2. **Update Branding**
   - Admin Panel → Settings
   - Change app name, logo, colors

3. **Configure Plans**
   - Admin Panel → Subscription Plans
   - Set pricing and features

4. **Add Signals**
   - Admin Panel → Signals → Create Signal
   - Start providing trading recommendations

5. **Set Up Payments** *(optional)*
   - Get Razorpay keys: [dashboard.razorpay.com](https://dashboard.razorpay.com)
   - Add to Vercel environment variables
   - Test with Razorpay test mode

---

## 📊 Monitor Your App

### Vercel Analytics
- Go to: Vercel Dashboard → Your Project → Analytics
- View: Traffic, Performance, Web Vitals

### Function Logs
- Go to: Vercel Dashboard → Your Project → Logs
- Filter by: Error, Warning, Info

### Database Metrics
- Go to: [Turso Dashboard](https://turso.tech) → Your Database → Metrics
- View: Storage usage, Query count, Response time

---

## 🔄 Deploy Updates

When you make code changes:

1. Commit and push to GitHub:
```bash
git add .
git commit -m "Update: feature description"
git push
```

2. Vercel automatically deploys (linked to your repo)
3. Check deployment status in Vercel dashboard
4. Test the new deployment

---

## 💰 Free Tier Limits

### Vercel (Hobby Plan)
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic SSL
- ✅ Global CDN
- ⚠️ No commercial use (upgrade to Pro for business)

### Turso (Starter Plan)
- ✅ 500MB database storage
- ✅ 1 billion row reads/month
- ✅ Unlimited databases
- ⚠️ Upgrade if you exceed limits

### Upgrade When:
- Vercel: You need team collaboration or >100GB bandwidth
- Turso: Database size >500MB or need multi-region replication

---

## 🔒 Security Best Practices

✅ **DO:**
- Change default admin password immediately
- Use strong `NEXTAUTH_SECRET` (32+ characters)
- Keep Turso tokens secret (never commit to Git)
- Enable 2FA on Vercel and GitHub
- Use environment variables for all secrets
- Regularly update dependencies

❌ **DON'T:**
- Don't commit `.env` files to Git
- Don't share admin credentials
- Don't use production keys in development
- Don't expose database credentials

---

## 📞 Get Help

### Documentation
- [Full Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
- [Environment Variables](./.env.example)

### External Resources
- [Vercel Docs](https://vercel.com/docs)
- [Turso Docs](https://docs.turso.tech/)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)

### Community
- [Vercel Discord](https://vercel.com/discord)
- [Turso Discord](https://discord.gg/turso)

---

## 🎉 Success!

Your UV Market School is now live! 

**Next Steps:**
1. Share your deployment URL with users
2. Configure subscription plans
3. Add trading signals
4. Set up Razorpay for payments
5. Customize branding

**Your app:** `https://your-project.vercel.app`

---

*Need the full guide? See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)*

*Have questions? Check [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)*
