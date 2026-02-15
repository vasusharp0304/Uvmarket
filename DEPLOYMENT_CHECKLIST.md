# 🚀 UV Market School - Deployment Checklist

Use this checklist to ensure a smooth deployment to Vercel with Turso.

---

## Pre-Deployment

### Local Testing
- [ ] Application runs locally with `npm run dev`
- [ ] All dependencies are installed (`npm install`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] No TypeScript errors
- [ ] Environment variables set in `.env.local`
- [ ] Database migrations work (`npx prisma db push`)

### Code Repository
- [ ] All changes committed to Git
- [ ] Code pushed to GitHub
- [ ] `.env` and `.env.local` are in `.gitignore`
- [ ] `node_modules` is in `.gitignore`
- [ ] README.md is updated

---

## Turso Database Setup

### Account & Database
- [ ] Turso account created at [turso.tech](https://turso.tech)
- [ ] Database created with name: `uv-market-school`
- [ ] Database region selected (closest to users)
- [ ] Database URL copied: `libsql://...`
- [ ] Auth token generated and copied

### Database Schema
- [ ] `TURSO_DATABASE_URL` set locally
- [ ] `TURSO_AUTH_TOKEN` set locally
- [ ] `npx prisma db push` executed successfully
- [ ] All tables created in Turso dashboard

### Test Connection
- [ ] Prisma Studio connects: `npx prisma studio`
- [ ] Can view/edit data in Turso dashboard
- [ ] No connection errors

---

## Vercel Setup

### Account & Import
- [ ] Vercel account created at [vercel.com](https://vercel.com)
- [ ] GitHub connected to Vercel
- [ ] Repository imported to Vercel
- [ ] Project name set

### Environment Variables
Set these in Vercel → Project Settings → Environment Variables:

- [ ] `TURSO_DATABASE_URL` = `libsql://your-database...`
- [ ] `TURSO_AUTH_TOKEN` = `your-turso-token...`
- [ ] `NEXTAUTH_SECRET` = `<generated-secret>`
- [ ] `NEXTAUTH_URL` = `https://your-project.vercel.app`
- [ ] `NEXT_PUBLIC_RAZORPAY_KEY_ID` = `rzp_...` (optional)
- [ ] `RAZORPAY_KEY_SECRET` = `secret...` (optional)

### Deployment
- [ ] Initial deployment triggered
- [ ] Build logs checked for errors
- [ ] Deployment status: **Success**
- [ ] Deployment URL copied

---

## Post-Deployment

### Verification
- [ ] Homepage loads: `https://your-project.vercel.app`
- [ ] No 404 errors on main pages
- [ ] Login page accessible: `/login`
- [ ] Registration page accessible: `/register`
- [ ] API routes responding (test in browser DevTools)

### Database Seeding
- [ ] Seed script run: `npm run seed`
- [ ] Admin account created
- [ ] Test data populated (optional)
- [ ] Subscription plans created

### Authentication
- [ ] Can log in with admin credentials
- [ ] Can log out
- [ ] Session persists across page reloads
- [ ] Dashboard accessible after login
- [ ] Admin panel accessible for admin users

### Functionality Tests
- [ ] Admin Dashboard loads
- [ ] Can create/view trading signals
- [ ] Can manage customers
- [ ] Can manage subscription plans
- [ ] Settings page loads and can be updated
- [ ] Notifications work
- [ ] Chat widget appears

### Payment Integration (if enabled)
- [ ] Razorpay key loaded (check browser console)
- [ ] Payment page loads
- [ ] Test payment with Razorpay test mode
- [ ] Payment verification works
- [ ] Invoice generated after payment

---

## Security

### Immediate Actions
- [ ] Default admin password changed
- [ ] Strong `NEXTAUTH_SECRET` generated (32+ characters)
- [ ] All secrets stored securely (not in Git)
- [ ] `.env` files added to `.gitignore`

### Access Control
- [ ] Vercel project access limited to team members
- [ ] Turso database access limited
- [ ] 2FA enabled on Vercel account
- [ ] 2FA enabled on GitHub account

### SSL & HTTPS
- [ ] Vercel automatically provides SSL (check ✓)
- [ ] All pages force HTTPS
- [ ] No mixed content warnings

---

## Performance

### Optimization
- [ ] Images optimized (using Next.js Image component)
- [ ] Static pages cached by Vercel CDN
- [ ] API routes respond in <1s
- [ ] Database queries optimized

### Monitoring
- [ ] Vercel Analytics enabled
- [ ] Check Vercel → Project → Analytics
- [ ] Review function logs for errors
- [ ] Set up error alerts (optional)

---

## Custom Domain (Optional)

If using a custom domain:

- [ ] Domain purchased/available
- [ ] Domain added in Vercel → Settings → Domains
- [ ] DNS records configured (A/CNAME)
- [ ] SSL certificate issued (automatic)
- [ ] `NEXTAUTH_URL` updated to custom domain
- [ ] Redeploy triggered
- [ ] Test on custom domain

---

## Documentation

### Project Documentation
- [ ] README.md updated with project details
- [ ] DEPLOYMENT_GUIDE.md reviewed
- [ ] Environment variables documented in `.env.example`
- [ ] API endpoints documented (optional)

### Handover
- [ ] Share deployment URL with team
- [ ] Share admin credentials (securely)
- [ ] Share Turso dashboard access
- [ ] Share Vercel project access
- [ ] Share Razorpay credentials (if used)

---

## Ongoing Maintenance

### Regular Tasks
- [ ] Monitor Vercel deployment logs weekly
- [ ] Check Turso database usage monthly
- [ ] Review and rotate secrets quarterly
- [ ] Update dependencies monthly: `npm update`
- [ ] Backup database monthly (Turso CLI)

### Scaling
- [ ] Monitor Vercel bandwidth usage
- [ ] Monitor Turso database size (500MB free limit)
- [ ] Plan for upgrade if nearing limits
- [ ] Consider CDN for static assets

---

## Troubleshooting Reference

### Common Issues

**Build Fails:**
- Check Vercel build logs
- Ensure all dependencies in `package.json`
- Run `npm run build` locally to debug

**Database Errors:**
- Verify Turso credentials
- Check database is active in Turso dashboard
- Run `npx prisma db push` again

**Auth Errors:**
- Verify `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches deployment URL
- Clear browser cookies/cache

**API Errors:**
- Check Vercel function logs
- Verify environment variables
- Test API routes with Postman/curl

---

## Success Criteria

Your deployment is successful when:

✅ Application is accessible at deployment URL  
✅ Users can register and log in  
✅ Admin can manage signals and customers  
✅ Database operations work correctly  
✅ No critical errors in logs  
✅ All environment variables configured  
✅ Security best practices followed  

---

## Next Steps After Deployment

1. **Customize Branding**
   - Update logo and colors in Admin → Settings
   - Update company information

2. **Configure Subscription Plans**
   - Set pricing for Monthly/Quarterly/Yearly plans
   - Update plan features

3. **Set Up Payments**
   - Configure Razorpay webhook URLs
   - Test payment flow end-to-end

4. **Add Content**
   - Create initial trading signals
   - Write welcome notification for new users

5. **Marketing**
   - Share deployment URL
   - Set up analytics/tracking
   - Configure SEO settings

---

**🎉 Deployment Complete!**

Keep this checklist for future reference and for deploying updates.

---

*Last Updated: February 2026*
