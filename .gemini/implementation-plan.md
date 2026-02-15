# UV Market School - Feature Implementation Plan

## Current State (What Exists)
- ✅ Auth (Login/Register) with NextAuth  
- ✅ Admin Dashboard with Charts  
- ✅ Customer Dashboard with Signal Cards  
- ✅ Signal CRUD (basic)  
- ✅ Pricing Page  
- ✅ Razorpay Payment (basic)  
- ✅ Disclaimer Modal  
- ✅ Prisma + SQLite DB  

## Phase 1: Schema & Core Infrastructure (NOW)
1. **Prisma Schema Expansion** - Add models for:
   - Invoice, Notification, ActivityLog, Referral, ChatMessage
   - AppSettings (branding, GST, company details)
   - SubscriptionPlan (dynamic pricing)
   - Add emailVerified, referralCode fields to User
2. **Run migration**

## Phase 2: Admin Panel Enhancements
1. **Signal Management** - Chart image upload, edit/delete
2. **Customer Database** - Free + Paid user list, filters, search
3. **Subscription & Pricing Control** - CRUD for plans
4. **Invoice System** - Auto-generate, GST, customization
5. **App Branding** - Logo, colors, company details settings
6. **Subscription Lock** - Block expired users

## Phase 3: Customer Features
1. **Forgot Password** flow
2. **Recommendation History** with Date/Time filters
3. **Chart Download** capability
4. **Profit Calculator** & Capital Tracking
5. **Subscription Flow** improvements
6. **Professional Invoices** with disclaimers

## Phase 4: Notifications & Communication
1. **In-app Notifications** system
2. **Email Notifications** (signal alerts)
3. **Push Notifications** (via Service Worker)
4. **Chatbot** component

## Phase 5: PWA & Advanced
1. **PWA manifest + Service Worker**
2. **Email Verification**
3. **Activity Logging**
4. **Referral System**
5. **Data Export** (CSV/Excel)
6. **Rate Limiting & CSRF**
7. **Mobile Optimization**

## Phase 6: Documentation
1. API documentation
2. User guide
3. Admin guide
