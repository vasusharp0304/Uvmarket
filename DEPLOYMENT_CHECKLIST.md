# Production Deployment Checklist

Use this checklist to ensure a successful production deployment.

## Pre-Deployment

### Environment Setup
- [ ] Generated `NEXTAUTH_SECRET` (32+ characters)
- [ ] Created Turso database
- [ ] Generated Turso auth token
- [ ] Set up Vercel project

### Code Preparation
- [ ] All tests passing
- [ ] Build succeeds locally: `npm run build`
- [ ] No TypeScript errors
- [ ] Environment variables documented in `.env.example`

## Deployment

### Vercel Configuration
- [ ] Project connected to GitHub repository
- [ ] Framework preset set to "Next.js"
- [ ] Build command: `prisma generate && next build`
- [ ] Output directory: `.next`

### Environment Variables (Vercel Dashboard)
Add these in Vercel → Project Settings → Environment Variables:

```
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-generated-secret
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-turso-token
```

- [ ] `NEXTAUTH_URL` set correctly
- [ ] `NEXTAUTH_SECRET` set (32+ chars)
- [ ] `TURSO_DATABASE_URL` set (starts with `libsql://`)
- [ ] `TURSO_AUTH_TOKEN` set
- [ ] `NODE_ENV` set to `production` (usually automatic)

### First Deployment
- [ ] Deploy to Vercel (push to main branch or use CLI)
- [ ] Build completes successfully
- [ ] No build errors in logs

## Post-Deployment

### Database Setup
- [ ] Visit `/api/admin/seed` endpoint
- [ ] Admin user created successfully
- [ ] App settings initialized

### Authentication Testing
- [ ] Can access login page: `/login`
- [ ] Can login with admin credentials:
  - Email: `uvmarketsignal@gmail.com`
  - Password: `Admin@123456`
- [ ] Redirected to admin dashboard after login
- [ ] Session persists across page refreshes
- [ ] Logout works correctly

### Security
- [ ] Changed default admin password
- [ ] HTTPS working correctly
- [ ] Cookies are secure (`__Secure-` prefix in production)

### Application Testing
- [ ] Dashboard loads correctly
- [ ] Admin panel accessible
- [ ] Signals page works
- [ ] Settings can be updated

## Verification Commands

Run these locally to verify setup:

```bash
# Verify environment variables
npm run env:verify:prod

# Test database connection
npm run db:test

# Build locally
npm run build
```

## Common Issues & Fixes

### Issue: "Cannot find module @/generated/prisma/client"
**Fix**: Ensure `postinstall` script runs during deployment. Check that `prisma generate` is in the build command.

### Issue: "JWT must be provided" or session not persisting
**Fix**: 
1. Verify `NEXTAUTH_SECRET` is set correctly
2. Check `NEXTAUTH_URL` matches your domain exactly
3. Ensure cookies are not blocked by browser

### Issue: Database connection errors
**Fix**:
1. Check `TURSO_DATABASE_URL` format (must start with `libsql://`)
2. Verify `TURSO_AUTH_TOKEN` is valid
3. Ensure database is not suspended

### Issue: "No account found with this email"
**Fix**: Run the seed endpoint again: `POST /api/admin/seed`

## Rollback Plan

If deployment fails:

1. Check Vercel deployment logs for errors
2. Verify environment variables are set correctly
3. Test locally with production environment variables
4. Redeploy after fixing issues

## Post-Launch Monitoring

- [ ] Monitor Vercel function logs
- [ ] Check for any 500 errors
- [ ] Verify database connections are stable
- [ ] Test user registration flow (if applicable)
- [ ] Test payment flow (if Razorpay is configured)

## Optional Enhancements

- [ ] Set up custom domain
- [ ] Configure analytics
- [ ] Set up monitoring (Sentry, etc.)
- [ ] Configure email service for notifications
- [ ] Remove or secure `/api/admin/seed` endpoint

## Support Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [NextAuth.js Configuration](https://next-auth.js.org/configuration/options)
- [Turso Documentation](https://docs.turso.tech)
- [Vercel Documentation](https://vercel.com/docs)

---

**Deployment Date**: _______________

**Deployed By**: _______________

**Notes**: _______________
