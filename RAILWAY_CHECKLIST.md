# Railway Deployment Checklist

Use this checklist to ensure your Railway deployment is configured correctly.

## ✅ Pre-Deployment Checklist

### 1. Repository & Code
- [ ] Code pushed to GitHub repository
- [ ] Repository is public or Railway has access
- [ ] No uncommitted changes
- [ ] All Railway configuration files committed

### 2. Configuration Files
- [ ] `railway.json` exists and is valid JSON
- [ ] `Procfile` exists with `web: npm start`
- [ ] `.nixpacks.toml` exists (optional, for advanced config)
- [ ] `.railwayignore` exists to optimize build
- [ ] `prisma/schema.prisma` has `provider = "postgresql"`

### 3. Environment Variables Documentation
- [ ] `.env.example` exists with all variables documented
- [ ] `.env.railway.example` exists with Railway-specific instructions

### 4. Application Configuration
- [ ] `package.json` has `build` script: `prisma generate && prisma migrate deploy && next build`
- [ ] `package.json` has `start` script: `next start`
- [ ] `package.json` has `postinstall` script: `prisma generate`
- [ ] `next.config.ts` has `output: 'standalone'`
- [ ] Health check endpoint exists at `/api/health`

### 5. PWA Configuration
- [ ] `public/manifest.json` exists
- [ ] `public/sw.js` exists
- [ ] Service worker registration in `src/app/layout.tsx`
- [ ] Icons exist in `public/icons/` or `public/`

## 🚀 Railway Setup Checklist

### 1. Create Railway Account
- [ ] Sign up at [railway.app](https://railway.app)
- [ ] Verify email address
- [ ] Connect GitHub account (if not already)

### 2. Create Project
- [ ] Click "New Project" in Railway dashboard
- [ ] Select "Deploy from GitHub repo"
- [ ] Choose your repository
- [ ] Wait for Railway to analyze the project

### 3. Add PostgreSQL Database
- [ ] In Railway project, click "New" → "Database"
- [ ] Select "PostgreSQL"
- [ ] Wait for database to be created
- [ ] Verify `DATABASE_URL` is automatically set

### 4. Configure Environment Variables
Go to your web service → "Variables" tab:

#### Required Variables
- [ ] `NEXTAUTH_URL` = `https://your-app.up.railway.app`
- [ ] `NEXTAUTH_SECRET` = Generate with `openssl rand -base64 32`
- [ ] `NODE_ENV` = `production`

#### Optional Variables (if using)
- [ ] `RAZORPAY_KEY_ID` = Your Razorpay Key ID
- [ ] `RAZORPAY_KEY_SECRET` = Your Razorpay Key Secret

### 5. Deploy
- [ ] Trigger deploy (automatic or manual)
- [ ] Monitor build logs
- [ ] Wait for build to complete successfully
- [ ] Verify deployment status is "Healthy"

## ✅ Post-Deployment Checklist

### 1. Verify Application
- [ ] Open your Railway URL in browser
- [ ] Homepage loads successfully
- [ ] No console errors in browser
- [ ] All static assets load correctly

### 2. Health Check
- [ ] Visit `/api/health`
- [ ] Response is `200 OK`
- [ ] Response JSON shows:
  ```json
  {
    "status": "healthy",
    "database": "connected",
    "version": "0.1.0"
  }
  ```

### 3. Database Operations
- [ ] Database migrations ran successfully
- [ ] Visit `/api/admin/seed` to create admin user
- [ ] Response shows admin user created
- [ ] Check Railway database panel for tables

### 4. Admin Login
- [ ] Navigate to `/login`
- [ ] Login with: `uvmarketsignal@gmail.com` / `Admin@123456`
- [ ] Successfully redirected to `/dashboard` or `/admin`
- [ ] **CRITICAL**: Change admin password immediately

### 5. Test Core Features
- [ ] Create a new user account
- [ ] User can login
- [ ] Trading signals display correctly
- [ ] Dashboard loads without errors
- [ ] Navigation works between pages

### 6. Test PWA (Optional)
- [ ] Open app in Chrome/Edge on mobile
- [ ] "Add to Home Screen" prompt appears
- [ ] Install PWA successfully
- [ ] App launches from home screen
- [ ] Offline mode works (basic functionality)

### 7. Test Payments (Optional)
- [ ] Razorpay keys configured (if using)
- [ ] Can access pricing page
- [ ] Payment flow initiates correctly
- [ ] Invoice generation works

## 🔒 Security Checklist

- [ ] Default admin password changed
- [ ] `NEXTAUTH_SECRET` is strong (32+ characters)
- [ ] No secrets committed to git
- [ ] HTTPS is enabled (automatic on Railway)
- [ ] Database backups are enabled (automatic on Railway)
- [ ] Environment variables are set correctly
- [ ] Unused test endpoints removed (if any)

## 📊 Monitoring Checklist

- [ ] Railway dashboard shows "Healthy" status
- [ ] Health check endpoint returns 200
- [ ] Database connection is stable
- [ ] No critical errors in logs
- [ ] App is responsive

## 🎯 Optional Enhancements

- [ ] Custom domain configured
- [ ] DNS records updated
- [ ] SSL certificate configured (automatic)
- [ ] CDN configured (optional)
- [ ] Analytics tracking added (optional)
- [ ] Error reporting configured (Sentry, etc.)

## 🐛 Troubleshooting Quick Reference

### Build Fails
- [ ] Check build logs in Railway dashboard
- [ ] Verify `DATABASE_URL` is set
- [ ] Check environment variables
- [ ] Ensure dependencies are in `package.json`

### Database Connection Issues
- [ ] PostgreSQL service is running
- [ ] `DATABASE_URL` format is correct
- [ ] Migrations ran successfully
- [ ] Check database logs

### Health Check Fails
- [ ] `/api/health` endpoint exists
- [ ] Database is connected
- [ ] No server errors in logs
- [ ] App is running

### PWA Issues
- [ ] `manifest.json` is accessible
- [ ] `sw.js` is accessible
- [ ] Service worker registered
- [ ] Check browser console for errors

### Authentication Issues
- [ ] `NEXTAUTH_URL` matches exactly
- [ ] `NEXTAUTH_SECRET` is set
- [ ] Admin user exists in database
- [ ] Cookies are enabled

## 📚 Documentation References

- [ ] Read `RAILWAY_SETUP.md` for quick start
- [ ] Read `RAILWAY_DEPLOYMENT.md` for detailed guide
- [ ] Read `RAILWAY_CONFIG_SUMMARY.md` for complete reference
- [ ] Check [Railway Documentation](https://docs.railway.app)

## ✅ Final Verification

Before marking deployment as complete, verify:

- [ ] Application is accessible at Railway URL
- [ ] All core features work
- [ ] Admin login successful
- [ ] Database operational
- [ ] Health check passing
- [ ] Security measures in place
- [ ] Documentation reviewed
- [ ] Team notified of deployment

## 🎉 Deployment Complete!

Once all items in this checklist are completed, your UV Market School application is successfully deployed to Railway!

### Next Steps:
1. Monitor the application for the first 24-48 hours
2. Set up alerts for critical errors
3. Review logs regularly
4. Plan for scaling if needed
5. Configure custom domain (optional)
6. Set up analytics (optional)

---

**Last Updated:** 2025-02-18
**Checklist Version:** 1.0.0
