# Railway Deployment Guide for UV Market School

Complete guide for deploying UV Market School to Railway with PostgreSQL.

## Prerequisites

- [Railway CLI](https://docs.railway.app/develop/cli) installed
- Railway account
- Git repository with your code

## Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

## Step 2: Login to Railway

```bash
railway login
```

## Step 3: Initialize Railway Project

```bash
railway init
```

Select "Empty Project" and give it a name (e.g., "uv-market-school").

## Step 4: Add PostgreSQL Database

```bash
railway add --database postgres
```

This will create a PostgreSQL database and automatically set the `DATABASE_URL` environment variable.

## Step 5: Set Required Environment Variables

```bash
# Set the NextAuth URL (your Railway app URL)
railway variables set NEXTAUTH_URL="https://your-app-name.up.railway.app"

# Generate and set a secure secret
# Run: openssl rand -base64 32
railway variables set NEXTAUTH_SECRET="your-generated-secret"

# Optional: Set Razorpay credentials for payments
railway variables set RAZORPAY_KEY_ID="your-key-id"
railway variables set RAZORPAY_KEY_SECRET="your-key-secret"
```

## Step 6: Deploy

```bash
railway deploy
```

## Step 7: Run Database Migrations

After the first deployment, run migrations:

```bash
railway run npm run db:migrate:deploy
```

## Step 8: Create Admin User

Create the admin user for login:

```bash
railway run npm run db:seed:prod
```

Default admin credentials:
- Email: `uvmarketsignal@gmail.com`
- Password: `Admin@123456`

**Important**: Change the admin password after first login!

## Step 9: Verify Deployment

1. Check health endpoint: `https://your-app.up.railway.app/api/health`
2. Login at: `https://your-app.up.railway.app/login`

## File Structure for Railway Deployment

```
├── railway.json          # Railway deployment configuration
├── Procfile              # Process file for Railway
├── .nixpacks.toml        # Nixpacks build configuration
├── .railwayignore        # Files to exclude from deployment
├── prisma/
│   ├── schema.prisma     # PostgreSQL schema
│   └── seed.ts           # Database seeding
└── src/
    └── app/
        └── api/
            └── health/
                └── route.ts  # Health check endpoint
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Auto-set by Railway PostgreSQL |
| `NEXTAUTH_URL` | Yes | Your Railway app URL |
| `NEXTAUTH_SECRET` | Yes | Secret for JWT encryption |
| `RAZORPAY_KEY_ID` | No | For payment integration |
| `RAZORPAY_KEY_SECRET` | No | For payment integration |
| `NODE_ENV` | Auto | Set to "production" by Railway |

## Troubleshooting

### Build Failures

Check build logs:
```bash
railway logs --build
```

### Database Connection Issues

1. Verify DATABASE_URL is set:
   ```bash
   railway variables
   ```

2. Test database connection:
   ```bash
   railway run npm run db:test
   ```

### Migration Failures

Reset and re-run migrations:
```bash
railway run npx prisma migrate reset
railway run npm run db:migrate:deploy
```

### Health Check Failures

Ensure the health endpoint returns 200:
```bash
curl https://your-app.up.railway.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected",
  "version": "0.1.0"
}
```

## Updating the Deployment

After making code changes:

```bash
git add .
git commit -m "Your changes"
git push
railway deploy
```

## Custom Domain (Optional)

1. Go to Railway dashboard
2. Select your service
3. Go to Settings → Domains
4. Add your custom domain
5. Update NEXTAUTH_URL to match

## Monitoring

View logs in real-time:
```bash
railway logs -f
```

View deployment status:
```bash
railway status
```

## Security Checklist

- [ ] Changed default admin password
- [ ] Set strong NEXTAUTH_SECRET
- [ ] Enabled HTTPS-only cookies (auto in production)
- [ ] Set proper CORS origins
- [ ] Reviewed environment variables

## Support

For issues specific to Railway deployment, check:
- [Railway Documentation](https://docs.railway.app/)
- [Railway Discord](https://discord.gg/railway)
