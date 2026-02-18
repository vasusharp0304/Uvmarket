# 🚀 Deploy UV Market School to Railway Now

This is your quick guide to deploy UV Market School to Railway with PostgreSQL.

## ⚡ 5-Minute Quick Deploy

### 1. Push to GitHub
```bash
git add .
git commit -m "Add Railway deployment configuration"
git push origin main
```

### 2. Create Railway Project
1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository

### 3. Add PostgreSQL Database
1. In Railway project, click **"New"** → **"Database"** → **"PostgreSQL"**
2. Wait for database to be created (Railway auto-sets `DATABASE_URL`)

### 4. Set Environment Variables
Go to your web service → **"Variables"** tab:

**Required:**
```
NEXTAUTH_URL=https://your-app-name.up.railway.app
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NODE_ENV=production
```

**Optional (if using Razorpay):**
```
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_secret
```

### 5. Deploy
Railway will automatically deploy. Wait for the build to complete.

### 6. Post-Deployment Setup
1. **Health Check:** Visit `https://your-app.up.railway.app/api/health`
2. **Seed Admin:** Visit `https://your-app.up.railway.app/api/admin/seed`
3. **Login:** Use `uvmarketsignal@gmail.com` / `Admin@123456`
4. **Change Password:** Immediately change the admin password!

## ✅ Verification

```bash
# Check health
curl https://your-app.up.railway.app/api/health

# Expected response:
# {"status":"healthy","database":"connected","version":"0.1.0"}
```

## 📚 Documentation

- **[Full Railway Setup Guide](./RAILWAY_SETUP.md)** - Complete step-by-step guide
- **[Configuration Summary](./RAILWAY_CONFIG_SUMMARY.md)** - All configuration details
- **[Deployment Checklist](./RAILWAY_CHECKLIST.md)** - Comprehensive checklist
- **[Troubleshooting](./RAILWAY_DEPLOYMENT.md)** - Common issues and solutions

## 🔧 Configuration Files Already Included

✅ `railway.json` - Railway project configuration
✅ `Procfile` - Startup command
✅ `.nixpacks.toml` - Advanced build configuration
✅ `.env.railway.example` - Environment variable reference
✅ `prisma/schema.prisma` - PostgreSQL database schema
✅ `src/lib/prisma.ts` - Multi-database support
✅ `next.config.ts` - Optimized for Railway
✅ PWA files (`manifest.json`, `sw.js`)

## 🎯 What's Included

- ✅ PostgreSQL database support
- ✅ Automatic database migrations
- ✅ Health check endpoint
- ✅ PWA (Progressive Web App)
- ✅ Secure authentication
- ✅ Payment integration (Razorpay)
- ✅ Admin dashboard
- ✅ Customer dashboard
- ✅ Trading signals management
- ✅ Invoicing system

## 🐛 Quick Troubleshooting

### Build Fails
- Check build logs in Railway dashboard
- Verify `DATABASE_URL` is set (auto by Railway)
- Ensure environment variables are correct

### Health Check Fails
- Verify `/api/health` endpoint exists
- Check database is connected
- Review application logs

### Can't Login
- Ensure admin seeded: visit `/api/admin/seed`
- Check `NEXTAUTH_URL` matches exactly
- Verify `NEXTAUTH_SECRET` is set

## 🎉 You're Live!

Your UV Market School application is now running on Railway with:
- 🗄️ PostgreSQL database
- 🚀 Automatic scaling
- 🔒 SSL/HTTPS (automatic)
- 💾 Database backups (automatic)
- 📱 PWA support
- ❤️ Health monitoring

For detailed documentation, see the files listed in the Documentation section above.

---

**Need Help?**
- Check [Railway Documentation](https://docs.railway.app)
- Review [RAILWAY_SETUP.md](./RAILWAY_SETUP.md)
- Look at Railway logs in the dashboard

**Happy Deploying!** 🚀
