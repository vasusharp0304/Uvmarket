# 📈 UV Market School

A comprehensive full-stack trading signals and subscription management platform built with Next.js 16, React 19, and Prisma ORM.

## 🌟 Features

### For Customers
- **Trading Signals**: Real-time buy/sell recommendations with entry, target, and stop-loss prices
- **Multiple Segments**: Equity, F&O, and Commodity trading signals
- **Signal Types**: Intraday, Swing, and Positional trading strategies
- **Performance Tracking**: Track signal performance with profit/loss percentages
- **Subscription Plans**: Flexible monthly, quarterly, and yearly subscription options
- **Payment Integration**: Seamless Razorpay payment gateway integration
- **Invoice Generation**: Automatic GST-compliant invoice generation
- **Referral System**: Earn rewards by referring new users
- **Chat Support**: In-app chatbot for instant support
- **Notifications**: Real-time notifications for new signals and updates
- **Mobile PWA**: Progressive Web App for mobile experience

### For Admins
- **Dashboard**: Comprehensive analytics and statistics
- **Signal Management**: Create, update, and manage trading signals
- **Customer Management**: View and manage all customers
- **Subscription Management**: Configure plans and track subscriptions
- **Payment Tracking**: Monitor all payments and transactions
- **Activity Logs**: Track all user activities and system events
- **Settings**: Customize branding, company info, and GST details
- **Export Data**: Download reports in CSV/Excel format

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- **Backend**: Next.js API Routes
- **Authentication**: NextAuth.js v4 with JWT sessions
- **Database**: Prisma ORM with SQLite (dev) / Turso (production)
- **Payment Gateway**: Razorpay
- **UI Icons**: Lucide React
- **Charts**: Recharts
- **PWA**: Next-PWA

## 📦 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/uv-market-school.git
cd uv-market-school
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Set up the database**
```bash
npx prisma generate
npx prisma db push
npm run seed
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**

Visit [http://localhost:3000](http://localhost:3000)

**Default admin credentials** (after seeding):
- Email: `admin@uvmarketschool.com`
- Password: `admin123`

## 🚀 Deployment

### Deploy to Vercel + Turso (100% Free)

We provide three comprehensive guides for deployment:

1. **[VERCEL_SETUP.md](./VERCEL_SETUP.md)** - Quick 5-minute deployment guide
2. **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Detailed step-by-step instructions
3. **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Complete checklist for production

#### Quick Deploy Steps:

1. **Set up Turso Database** (3 minutes)
   - Sign up at [turso.tech](https://turso.tech)
   - Create database and get credentials

2. **Deploy to Vercel** (2 minutes)
   - Push code to GitHub
   - Import to Vercel
   - Add environment variables

3. **Initialize Database** (1 minute)
   ```bash
   # Use our automated scripts
   ./scripts/setup-turso.sh        # Mac/Linux
   .\scripts\setup-turso.ps1       # Windows
   ```

4. **Access your app** 🎉
   - Visit: `https://your-project.vercel.app`

See [VERCEL_SETUP.md](./VERCEL_SETUP.md) for complete instructions.

## 📁 Project Structure

```
uv-market-school/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin panel pages
│   │   ├── dashboard/         # Customer dashboard
│   │   ├── api/               # API routes
│   │   └── ...                # Public pages
│   ├── components/            # React components
│   ├── lib/                   # Utilities and configs
│   │   ├── prisma.ts         # Database client
│   │   └── auth.ts           # NextAuth config
│   └── generated/prisma/      # Generated Prisma client
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.cjs              # Database seeding
├── public/                    # Static assets
├── scripts/                   # Deployment scripts
│   ├── setup-turso.sh        # Linux/Mac setup
│   └── setup-turso.ps1       # Windows setup
└── uploads/                   # File uploads (dev only)
```

## 🔐 Environment Variables

Required environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `TURSO_DATABASE_URL` | Turso database URL | `libsql://db.turso.io` |
| `TURSO_AUTH_TOKEN` | Turso auth token | `eyJ...` |
| `NEXTAUTH_SECRET` | NextAuth secret key | `random-32-char-string` |
| `NEXTAUTH_URL` | Application URL | `https://yourapp.com` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay public key (optional) | `rzp_live_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key (optional) | `secret...` |

See [`.env.example`](./.env.example) for complete reference.

## 🗃️ Database Schema

The application uses Prisma ORM with the following main models:

- **User**: User accounts with roles (ADMIN/CUSTOMER)
- **Signal**: Trading signals with performance tracking
- **SubscriptionPlan**: Subscription plan configurations
- **Payment**: Payment records and transactions
- **Invoice**: GST-compliant invoices
- **Notification**: User notifications
- **ActivityLog**: System activity tracking
- **ChatMessage**: Chat support messages
- **Referral**: Referral relationships
- **AppSettings**: Application configuration

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes to database
npm run seed         # Seed database with sample data
```

### Code Style

- TypeScript with strict mode
- ESLint for code quality
- Tailwind CSS for styling
- Follow existing patterns and conventions

## 🔒 Security

- JWT-based authentication with NextAuth.js
- Password hashing with bcryptjs
- Role-based access control (RBAC)
- SQL injection prevention with Prisma ORM
- CSRF protection
- Secure environment variable handling
- HTTPS enforced in production

## 📱 PWA Support

The application is configured as a Progressive Web App (PWA):
- Offline support
- Install to home screen
- Push notifications (ready)
- Service worker caching

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push to branch: `git push origin feature/your-feature`
5. Open a pull request

## 📄 License

This project is private and proprietary.

## 🆘 Support

### Documentation
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
- [Quick Setup Guide](./VERCEL_SETUP.md)

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Vercel Documentation](https://vercel.com/docs)
- [Turso Documentation](https://docs.turso.tech/)

## 🎯 Roadmap

- [ ] Email notifications
- [ ] SMS alerts for signals
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Mobile apps (iOS/Android)
- [ ] WhatsApp integration
- [ ] Telegram bot
- [ ] Advanced charting tools
- [ ] Portfolio tracking

## 🏆 Credits

Built with ❤️ for traders by UV Market School team.

### Technologies
- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Turso](https://turso.tech/) - Database hosting
- [Vercel](https://vercel.com/) - Deployment platform
- [Razorpay](https://razorpay.com/) - Payment gateway

---

**Version**: 0.1.0  
**Last Updated**: February 2026
