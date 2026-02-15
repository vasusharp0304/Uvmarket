# 🔧 UV Market School - Troubleshooting Guide

This guide helps you resolve common issues during development and deployment.

---

## 📋 Table of Contents

1. [Build & Deployment Issues](#build--deployment-issues)
2. [Database Issues](#database-issues)
3. [Authentication Issues](#authentication-issues)
4. [API & Route Issues](#api--route-issues)
5. [Payment Issues](#payment-issues)
6. [Performance Issues](#performance-issues)
7. [Development Issues](#development-issues)

---

## Build & Deployment Issues

### ❌ Error: "Cannot find module '@/generated/prisma/client'"

**Symptoms:**
```
Module not found: Can't resolve '@/generated/prisma/client'
```

**Causes:**
- Prisma client not generated
- Build command missing `prisma generate`

**Solutions:**

1. **Check build script** in `package.json`:
```json
{
  "scripts": {
    "build": "prisma generate && next build"
  }
}
```

2. **Generate Prisma client manually**:
```bash
npx prisma generate
```

3. **Clear Next.js cache**:
```bash
rm -rf .next
npm run build
```

4. **In Vercel**, ensure build command is:
```
prisma generate && next build
```

---

### ❌ Error: "Build exceeded maximum duration"

**Symptoms:**
- Vercel build times out after 45 seconds (hobby plan)

**Solutions:**

1. **Optimize dependencies**:
```bash
npm prune
npm dedupe
```

2. **Check for large files**:
```bash
# Remove unnecessary files from build
echo "uploads/" >> .gitignore
echo "dev.db" >> .gitignore
```

3. **Use Vercel's caching** - Ensure `vercel.json` is configured correctly

4. **Upgrade Vercel plan** if necessary (Pro plan: 15min timeout)

---

### ❌ Error: "ENOENT: no such file or directory"

**Symptoms:**
```
Error: ENOENT: no such file or directory, open './dev.db'
```

**Cause:**
- Local SQLite database path issues in production

**Solution:**

1. **Ensure Turso environment variables are set** in Vercel:
```env
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
```

2. **Check `src/lib/prisma.ts`** - adapter should switch automatically:
```typescript
if (tursoUrl && tursoUrl.startsWith('libsql://')) {
  // Uses Turso adapter ✓
}
```

3. **Don't commit `dev.db`** to Git:
```bash
echo "dev.db" >> .gitignore
```

---

## Database Issues

### ❌ Error: "Database connection refused" / "LibsqlError"

**Symptoms:**
```
LibsqlError: connect ECONNREFUSED
Error: Failed to connect to database
```

**Solutions:**

1. **Verify Turso credentials**:
```bash
# Test connection
npx turso db show your-database-name

# Or check in Turso dashboard
```

2. **Check environment variables**:
```bash
# In Vercel dashboard
TURSO_DATABASE_URL=libsql://your-db.turso.io  # Must start with libsql://
TURSO_AUTH_TOKEN=eyJ...                        # Copy exact token
```

3. **Verify database is active** in Turso dashboard

4. **Test locally**:
```bash
export TURSO_DATABASE_URL="libsql://..."
export TURSO_AUTH_TOKEN="..."
npx prisma db push
```

---

### ❌ Error: "Table does not exist"

**Symptoms:**
```
SqliteError: no such table: User
PrismaClientKnownRequestError: Table 'User' does not exist
```

**Cause:**
- Database schema not pushed to Turso

**Solution:**

1. **Push schema to Turso**:
```bash
export TURSO_DATABASE_URL="libsql://..."
export TURSO_AUTH_TOKEN="..."
npx prisma db push
```

2. **Verify tables in Turso dashboard**:
   - Go to Turso → Your Database → Tables
   - Should see: User, Signal, Payment, etc.

3. **If tables exist but still error**, regenerate Prisma client:
```bash
npx prisma generate
```

---

### ❌ Error: "Unique constraint failed"

**Symptoms:**
```
Unique constraint failed on the fields: (`email`)
```

**Cause:**
- Trying to create a record with duplicate unique field

**Solutions:**

1. **Check existing records**:
```bash
npx prisma studio
# Or query in Turso dashboard
```

2. **For seeding**, add unique checks:
```javascript
const existingUser = await prisma.user.findUnique({
  where: { email: "admin@example.com" }
});
if (!existingUser) {
  // Create user
}
```

3. **For API routes**, implement proper error handling:
```typescript
try {
  await prisma.user.create({ data: { email } });
} catch (error) {
  if (error.code === 'P2002') {
    return Response.json({ error: 'Email already exists' }, { status: 400 });
  }
}
```

---

## Authentication Issues

### ❌ Error: "[next-auth][error][NO_SECRET]"

**Symptoms:**
```
[next-auth][error][NO_SECRET]
https://next-auth.js.org/errors#no_secret
```

**Cause:**
- `NEXTAUTH_SECRET` environment variable not set

**Solutions:**

1. **Generate a secure secret**:
```bash
# Mac/Linux
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

2. **Add to Vercel**:
   - Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `NEXTAUTH_SECRET` = `your-generated-secret`

3. **Add to `.env.local`** for development:
```env
NEXTAUTH_SECRET="your-secret-here"
```

4. **Redeploy** on Vercel

---

### ❌ Error: "Session callback error"

**Symptoms:**
```
[next-auth][error][SESSION_ERROR]
```

**Solutions:**

1. **Check `NEXTAUTH_URL`**:
```env
# Must match your deployment URL exactly
NEXTAUTH_URL=https://your-project.vercel.app
# No trailing slash!
```

2. **Clear browser cookies**:
   - Browser DevTools → Application → Cookies
   - Delete all cookies for your domain

3. **Check `src/lib/auth.ts`** - session callback should exist:
```typescript
callbacks: {
  async session({ session, token }) {
    // Populate session
    return session;
  }
}
```

---

### ❌ Error: "Cannot read properties of undefined (reading 'id')"

**Symptoms:**
- Session data missing in components
- `session.user.id` is undefined

**Solutions:**

1. **Check session type definitions** in `src/types/next-auth.d.ts`:
```typescript
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      // ... other fields
    }
  }
}
```

2. **Verify JWT callback** in `src/lib/auth.ts`:
```typescript
async jwt({ token, user }) {
  if (user) {
    token.id = user.id;
    token.role = user.role;
  }
  return token;
}
```

3. **Use optional chaining**:
```typescript
const userId = session?.user?.id;
if (!userId) return;
```

---

## API & Route Issues

### ❌ Error: "API resolved without sending a response"

**Symptoms:**
```
API resolved without sending a response for /api/...
```

**Cause:**
- Missing `return` statement in API route

**Solution:**

```typescript
// ❌ Wrong
export async function POST(request: Request) {
  const data = await request.json();
  // Missing return!
}

// ✅ Correct
export async function POST(request: Request) {
  const data = await request.json();
  return Response.json({ success: true });
}
```

---

### ❌ Error: "CORS error" / "Failed to fetch"

**Symptoms:**
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

**Solutions:**

1. **Ensure API routes are in the same domain** (Next.js handles CORS automatically)

2. **Check `NEXTAUTH_URL`** matches your domain:
```env
NEXTAUTH_URL=https://your-domain.vercel.app
```

3. **For external API calls**, add CORS headers:
```typescript
return new Response(JSON.stringify(data), {
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});
```

---

### ❌ Error: "Unhandled Runtime Error"

**Symptoms:**
- White screen
- Error overlay in development
- 500 error in production

**Solutions:**

1. **Check Vercel logs**:
   - Vercel Dashboard → Your Project → Logs
   - Filter by "Error"

2. **Add error boundaries** in React components:
```typescript
'use client'
import { Component, ReactNode } from 'react'

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong</div>
    }
    return this.props.children
  }
}
```

3. **Add try-catch blocks** in API routes:
```typescript
export async function GET() {
  try {
    const data = await fetchData();
    return Response.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## Payment Issues

### ❌ Error: "Razorpay is not defined"

**Symptoms:**
```
ReferenceError: Razorpay is not defined
```

**Solutions:**

1. **Check Razorpay script is loaded** in layout:
```tsx
<Script src="https://checkout.razorpay.com/v1/checkout.js" />
```

2. **Verify `NEXT_PUBLIC_RAZORPAY_KEY_ID`** (must start with `NEXT_PUBLIC_`):
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
```

3. **Access Razorpay on client-side only**:
```typescript
'use client'

const handlePayment = () => {
  if (typeof window !== 'undefined' && window.Razorpay) {
    // Use Razorpay
  }
}
```

---

### ❌ Error: "Payment verification failed"

**Symptoms:**
- Payment succeeds in Razorpay but fails verification

**Solutions:**

1. **Check signature verification** in `/api/payment/verify`:
```typescript
const crypto = require('crypto');
const expectedSignature = crypto
  .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
  .update(`${razorpay_order_id}|${razorpay_payment_id}`)
  .digest('hex');
```

2. **Verify `RAZORPAY_KEY_SECRET`** is correct in Vercel

3. **Check Razorpay webhook settings**:
   - Dashboard → Settings → Webhooks
   - Add: `https://your-domain.vercel.app/api/payment/webhook`

---

## Performance Issues

### 🐌 Slow page loads

**Solutions:**

1. **Enable Next.js caching**:
```typescript
export const revalidate = 60; // Cache for 60 seconds
```

2. **Use dynamic imports**:
```typescript
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>
})
```

3. **Optimize images**:
```tsx
import Image from 'next/image'
<Image src="..." width={500} height={300} alt="..." />
```

4. **Add loading states**:
```typescript
<Suspense fallback={<Skeleton />}>
  <DataComponent />
</Suspense>
```

---

### 🐌 Slow API responses

**Solutions:**

1. **Add database indexes** (for frequently queried fields):
```prisma
model User {
  email String @unique // Already indexed
  @@index([role, subscriptionStatus]) // Add composite index
}
```

2. **Use pagination**:
```typescript
const signals = await prisma.signal.findMany({
  take: 20,
  skip: (page - 1) * 20,
});
```

3. **Optimize queries** (select only needed fields):
```typescript
const user = await prisma.user.findUnique({
  where: { id },
  select: { id: true, name: true, email: true }
});
```

---

## Development Issues

### ❌ Error: "Module not found: Can't resolve 'fs'"

**Symptoms:**
```
Module not found: Can't resolve 'fs' in '...'
```

**Cause:**
- Using Node.js modules in client-side code

**Solution:**

1. **Add 'use server' directive** for server-only code:
```typescript
'use server'
import fs from 'fs';
```

2. **Or use API routes** for Node.js functionality:
```typescript
// app/api/file-operation/route.ts
import fs from 'fs';
export async function GET() {
  // Use fs here
}
```

---

### ❌ Error: "Hydration failed"

**Symptoms:**
```
Error: Hydration failed because the initial UI does not match what was rendered on the server
```

**Solutions:**

1. **Don't use `window` or `document` during SSR**:
```typescript
const [isClient, setIsClient] = useState(false);

useEffect(() => {
  setIsClient(true);
}, []);

if (!isClient) return null;
```

2. **Use `'use client'` directive** for interactive components:
```typescript
'use client'
export default function ClientComponent() {
  // Can use browser APIs here
}
```

3. **Suppress hydration warning** (only if necessary):
```tsx
<div suppressHydrationWarning>
  {typeof window !== 'undefined' && <ClientOnlyComponent />}
</div>
```

---

## 📞 Still Need Help?

### Check Logs

**Vercel Logs:**
```
Vercel Dashboard → Your Project → Logs
```

**Local Logs:**
```bash
# Check terminal output
npm run dev

# Check browser console
F12 → Console tab
```

### Debugging Tips

1. **Add console.logs** strategically:
```typescript
console.log('[DEBUG] Variable:', variable);
```

2. **Use Prisma Studio** to inspect database:
```bash
npx prisma studio
```

3. **Test API routes** with curl:
```bash
curl -X POST https://your-domain.vercel.app/api/test
```

4. **Check environment variables**:
```bash
# In Vercel function logs, add:
console.log('Env vars:', Object.keys(process.env));
```

### Resources

- [Vercel Support](https://vercel.com/support)
- [Next.js Discord](https://nextjs.org/discord)
- [Prisma Discord](https://discord.gg/prisma)
- [Turso Discord](https://discord.gg/turso)

---

## 🎯 Prevention Tips

### Before Deployment

- [ ] Test build locally: `npm run build && npm start`
- [ ] Check all environment variables are set
- [ ] Verify database connection works
- [ ] Test all critical user flows
- [ ] Review Vercel logs after deployment
- [ ] Keep dependencies updated

### Best Practices

- ✅ Use TypeScript for type safety
- ✅ Add proper error handling
- ✅ Use environment variables for secrets
- ✅ Implement logging for debugging
- ✅ Write tests for critical features
- ✅ Monitor application performance
- ✅ Keep documentation updated

---

*Last Updated: February 2026*
