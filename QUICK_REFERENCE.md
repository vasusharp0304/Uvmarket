# 🚀 UV Market School - Quick Reference Guide

One-page reference for common tasks and commands.

---

## 📦 Installation & Setup

```bash
# Clone and install
git clone <your-repo-url>
cd uv-market-school
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your values

# Set up database
npx prisma generate
npx prisma db push
npm run seed

# Start development
npm run dev
```

---

## 🌐 Environment Variables

### Local Development (.env.local)
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-32-chars"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="test_secret"
```

### Production (Vercel)
```env
TURSO_DATABASE_URL="libsql://your-db.turso.io"
TURSO_AUTH_TOKEN="eyJ..."
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_..."
RAZORPAY_KEY_SECRET="live_secret"
```

---

## 🛠️ Common Commands

### Development
```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database
```bash
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema to database
npx prisma studio    # Open database GUI
npm run seed         # Seed database with sample data
```

### Deployment
```bash
# Push to GitHub (auto-deploys on Vercel)
git add .
git commit -m "Your message"
git push

# Set up Turso database
export TURSO_DATABASE_URL="libsql://..."
export TURSO_AUTH_TOKEN="..."
./scripts/setup-turso.sh       # Mac/Linux
.\scripts\setup-turso.ps1      # Windows
```

---

## 🔑 Default Credentials (After Seeding)

**Admin Account:**
```
Email: admin@uvmarketschool.com
Password: admin123
```

**⚠️ CHANGE IMMEDIATELY IN PRODUCTION!**

---

## 📂 Important Files

| File | Purpose |
|------|---------|
| `src/app/api/**` | API endpoints |
| `src/app/admin/**` | Admin panel pages |
| `src/app/dashboard/**` | Customer dashboard |
| `src/lib/prisma.ts` | Database client |
| `src/lib/auth.ts` | NextAuth configuration |
| `prisma/schema.prisma` | Database schema |
| `.env.example` | Environment template |
| `vercel.json` | Vercel configuration |

---

## 🌍 URLs

### Development
```
Homepage:     http://localhost:3000
Login:        http://localhost:3000/login
Dashboard:    http://localhost:3000/dashboard
Admin:        http://localhost:3000/admin
```

### Production
```
Homepage:     https://your-domain.vercel.app
Login:        https://your-domain.vercel.app/login
Dashboard:    https://your-domain.vercel.app/dashboard
Admin:        https://your-domain.vercel.app/admin
```

---

## 🔧 Troubleshooting Quick Fixes

### Build Errors
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection
```bash
# Regenerate Prisma client
npx prisma generate

# Re-push schema
npx prisma db push --force-reset
```

### Environment Issues
```bash
# Check variables are loaded
node -e "console.log(process.env.NEXTAUTH_SECRET)"

# In Vercel: Settings → Environment Variables
```

### Clear Vercel Cache
```
Vercel Dashboard → Deployments → [...] → Redeploy
```

---

## 🎨 Customization Points

### Branding
- Admin → Settings → Update app name, logo, colors

### Subscription Plans
- Admin → Subscription Plans → Edit pricing and features

### Content
- Admin → Signals → Add trading signals
- Admin → Customers → Manage users

---

## 📊 Monitoring

### Vercel Dashboard
```
Your Project → Analytics  # Traffic, performance
Your Project → Logs      # Error logs, function logs
```

### Turso Dashboard
```
Your Database → Metrics  # Storage, queries
Your Database → Tables   # View data
```

### Local Debugging
```bash
# View database
npx prisma studio

# Check build output
npm run build

# Check API routes
curl http://localhost:3000/api/auth/session
```

---

## 🔐 Security Checklist

- [ ] Change default admin password
- [ ] Use strong NEXTAUTH_SECRET (32+ chars)
- [ ] Enable 2FA on Vercel/GitHub
- [ ] Keep secrets in environment variables
- [ ] Never commit .env files
- [ ] Use HTTPS in production (auto on Vercel)
- [ ] Review access permissions regularly

---

## 📱 Testing Checklist

- [ ] Homepage loads
- [ ] Login/Logout works
- [ ] Registration works
- [ ] Dashboard accessible
- [ ] Admin panel accessible (admin only)
- [ ] Can create signals (admin)
- [ ] Can view signals (customer)
- [ ] Payment flow works (if enabled)
- [ ] Mobile responsive
- [ ] PWA installable

---

## 🚨 Emergency Contacts

### Platform Issues
- Vercel Status: https://www.vercel-status.com/
- Turso Status: https://status.turso.tech/
- Next.js Docs: https://nextjs.org/docs

### Support
- Vercel Support: https://vercel.com/support
- Turso Discord: https://discord.gg/turso
- Next.js Discord: https://nextjs.org/discord

---

## 📚 Documentation

### Full Guides
- [VERCEL_SETUP.md](./VERCEL_SETUP.md) - Quick deployment (5 min)
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Detailed guide
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Step-by-step checklist
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Fix common issues
- [POST_DEPLOYMENT.md](./POST_DEPLOYMENT.md) - After deployment tasks

### Code Documentation
- [README.md](./README.md) - Project overview
- [.env.example](./.env.example) - Environment variables reference

---

## 🎯 Quick Deploy (5 Minutes)

**1. Set up Turso** (2 min)
```
1. Go to turso.tech → Sign up
2. Create database
3. Copy URL and token
```

**2. Deploy to Vercel** (2 min)
```
1. Push to GitHub
2. Import to Vercel
3. Add environment variables:
   - TURSO_DATABASE_URL
   - TURSO_AUTH_TOKEN
   - NEXTAUTH_SECRET
   - NEXTAUTH_URL
4. Deploy
```

**3. Initialize DB** (1 min)
```bash
export TURSO_DATABASE_URL="libsql://..."
export TURSO_AUTH_TOKEN="..."
npx prisma db push
npm run seed
```

**4. Access**
```
Visit: https://your-project.vercel.app
Login: admin@uvmarketschool.com / admin123
```

---

## 💡 Pro Tips

- Use `npx prisma studio` to view/edit database visually
- Check Vercel logs for API errors
- Test payments in Razorpay test mode first
- Enable Vercel Analytics for free traffic insights
- Use `.env.local` for local secrets (never commit)
- Create separate Razorpay accounts for test/live
- Monitor Turso storage usage (500MB free limit)
- Set up email alerts for errors (via Vercel integrations)

---

## 🆘 Need Help?

**Check in this order:**
1. [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues
2. Vercel Dashboard → Logs - Error messages
3. Browser Console (F12) - Frontend errors
4. [Vercel Docs](https://vercel.com/docs) - Platform help
5. [Next.js Docs](https://nextjs.org/docs) - Framework help

---

**Last Updated:** February 2026  
**Version:** 0.1.0
