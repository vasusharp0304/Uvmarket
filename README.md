# UV Market School

A full-stack Next.js application for a trading-signals/subscription business. Includes a public marketing site, authenticated customer dashboard, and admin panel for managing customers, trading signals, subscription plans, payments, and branding.

## 🚀 Quick Links

- **[Quick Start Guide](./QUICKSTART.md)** - Fast track to deployment
- **[Deployment Guide](./DEPLOYMENT.md)** - Detailed deployment instructions
- **[Admin Login after deployment**](#admin-login-credentials)

## Features

- **Authentication**: NextAuth v4 with Credentials provider (email/password)
- **Role-Based Access**: Admin and Customer roles with protected routes
- **Trading Signals**: Full CRUD for trading signals with status tracking
- **Subscription Management**: Plan creation and user subscription tracking
- **Payments**: Razorpay integration for payment processing
- **Dashboard**: Customer and admin dashboards with statistics
- **Invoicing**: Automatic invoice generation with GST support
- **Notifications**: In-app notifications and activity logging
- **Chat/Support**: Built-in chat system with bot responses

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- **Backend**: Next.js Route Handlers
- **Database**: Prisma v7 with SQLite/Turso (LibSQL) support
- **Authentication**: NextAuth v4 with JWT sessions
- **Payments**: Razorpay

## Getting Started Locally

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd uv-market-school
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set:
```env
DATABASE_URL=file:./dev.db
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-generate-with-openssl-rand-base64-32
```

4. Initialize and seed the database:
```bash
npx prisma generate
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Admin Login Credentials

After running the seed script:

- **Email**: `uvmarketsignal@gmail.com`
- **Password**: `Admin@123456`

⚠️ **Important**: Change the password immediately after first login!

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:seed` - Seed database with admin user and demo data
- `npm run db:seed:prod` - Seed production database (admin only)
- `npm run lint` - Run ESLint

## Project Structure

```
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding script
├── src/
│   ├── app/               # Next.js App Router pages and API routes
│   ├── components/        # React components
│   ├── lib/               # Utility functions and configurations
│   └── types/             # TypeScript type definitions
├── scripts/               # Utility scripts
├── vercel.json           # Vercel configuration
└── DEPLOYMENT.md         # Deployment guide
```

## Environment Variables

### Required for Production

| Variable | Description |
|----------|-------------|
| `NEXTAUTH_URL` | Your deployed application URL |
| `NEXTAUTH_SECRET` | Secret key for NextAuth.js (generate with `openssl rand -base64 32`) |
| `TURSO_DATABASE_URL` | Turso database URL (e.g., `libsql://your-db.turso.io`) |
| `TURSO_AUTH_TOKEN` | Turso authentication token |

### Optional

| Variable | Description |
|----------|-------------|
| `RAZORPAY_KEY_ID` | Razorpay API Key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay API Key Secret |
| `DATABASE_URL` | Local SQLite database URL (development only) |

## Deployment

### Deploy to Vercel

The easiest way to deploy is using Vercel:

1. **[Quick Start Guide](./QUICKSTART.md)** - Step-by-step deployment instructions
2. **[Deployment Guide](./DEPLOYMENT.md)** - Comprehensive deployment documentation

### Key Deployment Steps

1. Set up a Turso database
2. Generate NextAuth secret: `openssl rand -base64 32`
3. Connect your repository to Vercel
4. Add environment variables in Vercel dashboard
5. Deploy
6. Seed the database by visiting `/api/admin/seed`
7. Login with admin credentials

## Database

This project uses Prisma as the ORM with two database options:

- **Development**: Local SQLite database (`dev.db`)
- **Production**: Turso (LibSQL) cloud database

### Database Seeding

Run the seed script to create the admin user and demo data:
```bash
npm run db:seed
```

For production deployment, use:
```bash
npm run db:seed:prod
```

Or trigger it via API after deployment:
```
https://your-app.vercel.app/api/admin/seed
```

## Authentication

The application uses NextAuth.js v4 with the following configuration:

- **Provider**: Credentials (email/password)
- **Session Strategy**: JWT
- **Roles**: ADMIN, CUSTOMER
- **Password Hashing**: bcryptjs

## Payment Integration

Payments are processed through Razorpay:

1. Configure Razorpay API keys in environment variables
2. Create subscription plans in admin panel
3. Customers can purchase plans through the dashboard
4. Invoices are automatically generated

## Security Considerations

- Always use HTTPS in production (Vercel handles this automatically)
- Change the default admin password immediately
- Rotate `NEXTAUTH_SECRET` regularly
- Remove the `/api/admin/seed` endpoint after initial deployment
- Keep dependencies updated
- Review and update environment variables regularly

## Troubleshooting

### Build Errors

- Ensure all dependencies are installed: `npm install`
- Check TypeScript errors in the build output
- Verify Prisma schema is valid

### Database Connection Issues

- Verify database URL and credentials
- Check that Turso database is active (for production)
- Ensure `prisma generate` was run

### Authentication Issues

- Verify `NEXTAUTH_SECRET` is set correctly
- Ensure `NEXTAUTH_URL` matches your domain exactly
- Check that admin user exists in database

## Support

For deployment issues, see:
- [Deployment Guide](./DEPLOYMENT.md)
- [Quick Start Guide](./QUICKSTART.md)
- Check Vercel deployment logs
- Review Turso database status

## License

[Your License Here]

## Contributing

[Your Contribution Guidelines Here]
