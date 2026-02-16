# Quick Start Guide - Deploy to Vercel

This is a quick reference for deploying UV Market School to Vercel. For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🚀 Quick Deployment Steps

### 1. Prepare Your Database (Turso)

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Create database
turso db create uv-market-school

# Get database URL and token
turso db show uv-market-school --url
turso db tokens create uv-market-school
```

### 2. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

### 3. Deploy to Vercel

#### Option A: Using Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com) and click "Add New Project"
2. Import your GitHub repository
3. Add environment variables:

| Variable | Value | Required |
|----------|-------|----------|
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Yes |
| `NEXTAUTH_SECRET` | Your generated secret | Yes |
| `TURSO_DATABASE_URL` | Your Turso URL | Yes |
| `TURSO_AUTH_TOKEN` | Your Turso token | Yes |

4. Click "Deploy"

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel

# Add environment variables
vercel env add NEXTAUTH_SECRET
vercel env add TURSO_DATABASE_URL
vercel env add TURSO_AUTH_TOKEN
vercel env add NEXTAUTH_URL

# Production deploy
vercel --prod
```

### 4. Seed the Database

After deployment, visit:
```
https://your-app.vercel.app/api/admin/seed
```

### 5. Login

```
URL: https://your-app.vercel.app/login
Email: uvmarketsignal@gmail.com
Password: Admin@123456
```

### 6. Configure Your App

1. Go to **Admin > Settings** - Update company details
2. Go to **Admin > Plans** - Create subscription plans
3. Go to **Admin > Signals** - Add trading signals

## 🔑 Important Notes

- **Change the admin password immediately** after first login
- Use HTTPS (Vercel does this automatically)
- The seed endpoint (`/api/admin/seed`) can be removed after initial setup for security
- Database backups are handled by Turso automatically

## 📝 Environment Variables Summary

### Required for Production
- `NEXTAUTH_URL` - Your Vercel domain
- `NEXTAUTH_SECRET` - Random string for encryption
- `TURSO_DATABASE_URL` - Turso database URL
- `TURSO_AUTH_TOKEN` - Turso authentication token

### Optional
- `RAZORPAY_KEY_ID` - For payments
- `RAZORPAY_KEY_SECRET` - For payments

## 🐛 Troubleshooting

### Build Fails
- Check Vercel build logs
- Verify all environment variables are set

### Can't Login
- Verify `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are correct
- Ensure database was seeded

### Database Errors
- Check Turso database URL and token
- Verify database is active in Turso dashboard

## 📚 Additional Resources

- [Full Deployment Guide](./DEPLOYMENT.md)
- [Vercel Documentation](https://vercel.com/docs)
- [Turso Documentation](https://docs.turso.tech)
- [NextAuth.js Documentation](https://next-auth.js.org)

## 🆘 Need Help?

1. Check the [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions
2. Review Vercel deployment logs
3. Check Turso database status
4. Verify all environment variables are set correctly
