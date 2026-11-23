# GANIT ADDA — Complete Educational Worksheet E-Commerce Platform

> **Maths Made Simple, One Step at a Time.**  
> CBSE & NCERT Mathematics Worksheets, Chapter-wise Practice Materials, Question Banks, Mock Tests, and Step-by-Step Solutions (Classes VI to XII).

---

## 1. Overview & Architecture

**GANIT ADDA** is a modern, high-performance educational e-commerce platform built with Next.js 15 (App Router), TypeScript, Neon Serverless PostgreSQL, Framer Motion, and Vercel Blob.

### Key Highlights
- **Apple-Inspired Design System**: Refined maroon (`#651b32`, `#3e1022`), warm cream (`#fbf6ed`, `#f5ebd7`), and rich gold (`#c69a45`, `#9a742c`) palette. Includes glassmorphism navigation, responsive layouts, and strict `@media (prefers-reduced-motion: reduce)` accessibility support.
- **Fluid Micro-Interactions**: Built using `/apple-design` and `/animate` skills with Emil Kowalski spring motion physics (`damping: 24-28`, `stiffness: 260-320`), floating mathematical symbols ($\pi, \sqrt{x}, \sum, x^2, \int$), staggered grid reveals, animated statistics counters, and celebratory confetti upon purchase.
- **Complete E-Commerce Flow**: Dynamic cart drawer & page, coupon validation engine (flat ₹ / percentage off with minimum order requirements), Indian payment gateway integration (Razorpay & PayU abstraction with seamless test fallback), and order fulfillment.
- **Private, Secure Digital Delivery**: **Zero public exposure of raw paid PDF URLs.** Downloads are protected by server-side entitlement checks, database verification of completed orders, and HMAC-SHA256 signed 15-minute download tokens via `/api/downloads/[entitlementId]`.
- **Multi-Role Authentication**: Secure session cookies via JOSE JWT and bcrypt hashing for both **Customer** accounts (`/dashboard`, `/dashboard/orders`, `/dashboard/downloads`) and **Administrator** portal (`/admin`).
- **Comprehensive Admin Console**: Live business analytics (revenue, order counts, customer metrics), PDF worksheet uploader with preview PDF separation, order log viewer, dynamic coupon manager, lead enquiry responder, and platform settings.

---

## 2. Directory Structure

```
├── app/
│   ├── layout.tsx                # Root layout with CartProvider and metadata
│   ├── globals.css               # Ganit Adda CSS design tokens & animations
│   ├── page.tsx                  # Premium landing page with hero, stats, reviews, leads
│   ├── worksheets/               # Worksheet marketplace with search, filters & grid/list
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx       # Dedicated product page with sample preview & buy now
│   ├── ncert-solutions/          # Class 6-12 NCERT exercise directory
│   ├── study-materials/          # Formula sheets, revision notes, question banks
│   ├── mock-tests/               # Timed CBSE mock tests with rubrics & scoring
│   ├── cart/                     # Shopping cart with coupon redemption
│   ├── checkout/                 # Authenticated order summary & payment gateway launch
│   ├── payment/                  # Payment callbacks (/success with confetti, /failed)
│   ├── dashboard/                # Customer portal (Overview, Orders, Downloads, Profile)
│   ├── admin/                    # All-in-one administrator management console
│   ├── login/ & register/        # Authentication pages with input validation
│   ├── contact/ & about/         # Brand philosophy & interactive enquiry form
│   ├── privacy-policy/           # Legal compliance & electronic delivery terms
│   └── api/                      # 18+ secure serverless endpoints
├── components/
│   ├── Navbar.tsx                # Sticky glassmorphism header with animated cart badge
│   ├── Footer.tsx                # Comprehensive brand footer with contact details
│   ├── WorksheetCard.tsx         # Responsive product card with difficulty & discount badges
│   └── animations/
│       └── MotionWrappers.tsx    # Spring motion, FadeIn, Stagger, FloatingMathSymbols
├── db/
│   ├── schema.sql                # Complete 19-table PostgreSQL production schema
│   └── migrations/               # Incremental database migrations
├── lib/
│   ├── db.ts                     # Neon serverless client with resilient fallback
│   ├── auth.ts                   # Multi-role JWT session management & bcrypt helpers
│   ├── payment.ts                # Payment gateway abstraction (Razorpay, PayU, Sandbox)
│   ├── storage.ts                # HMAC-SHA256 signed tokens & protected PDF streaming
│   ├── coupons.ts                # Discount calculation & coupon validation engine
│   ├── email.ts                  # Transactional email service & HTML invoice generator
│   ├── worksheets.ts             # Catalog querying with multi-criteria filtering
│   └── mock-data.ts              # Authentic CBSE Classes 6-12 seed materials
└── backup_original/              # Preserved mirror of original codebase
```

---

## 3. Environment Configuration

Copy `.env.example` to `.env.local` and set your credentials:

```bash
# Database (Neon Serverless PostgreSQL)
DATABASE_URL="postgresql://user:password@ep-your-database.neon.tech/neondb?sslmode=require"

# JWT and Session Security (Generate a random 64-char string)
SESSION_SECRET="your-64-character-random-hex-string"
JWT_SECRET="your-64-character-random-hex-string"

# Super Administrator Credentials
ADMIN_EMAIL="admin@ganitadda.in"
ADMIN_PASSWORD_HASH="$2b$12$AYuaYQ2NOw3znlu7YSLrkeR.DYLyU3t0MrVzP5nYNuqHgUgu.bGy6"
# (Default development password: Admin@GanitAdda2026!)

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_token_here"

# Indian Payment Gateway Integration
PAYMENT_PROVIDER="RAZORPAY"
RAZORPAY_KEY_ID="rzp_live_or_test_key"
RAZORPAY_KEY_SECRET="your_razorpay_secret"
RAZORPAY_WEBHOOK_SECRET="your_razorpay_webhook_secret"

# Optional PayU Configuration
PAYU_MERCHANT_KEY=""
PAYU_MERCHANT_SALT=""

# Transactional Email (Resend)
RESEND_API_KEY=""
EMAIL_FROM="GANIT ADDA <notifications@ganitadda.in>"

# Public URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

---

## 4. Running the Project

### Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### Production Build & Launch
```bash
npm run build
npm run start
```

### Initializing the Neon Database
To run the full schema (19 tables including indices and audit logs) on your live Neon instance:
```bash
npm run db:init
```

### Generating an Admin Password Hash
```bash
npm run admin:hash -- "YourSuperSecurePassword123!"
```
Copy the resulting bcrypt hash into `ADMIN_PASSWORD_HASH` in `.env.local`.

---

## 5. Security & Verification Architecture

1. **Tamper-Proof Checkout**: Order subtotals and discounts are calculated strictly on the server from verified database prices. Frontend prices cannot be spoofed.
2. **HMAC Webhook Verification**: Razorpay and PayU webhooks verify raw cryptographic signatures before order fulfillment.
3. **Download Entitlements**: Digital assets are never linked directly to Vercel Blob URLs in client code. Requests route through `/api/downloads/[entitlementId]` which checks customer identity, active order payment status, and signs a short-lived download token.
4. **Idempotent Order Fulfillment**: Database transactions mark orders `SUCCESS`, create download entitlements, increment download counters, and log redemption events without risk of duplicate execution.

---

## 6. Default Test Accounts

- **Admin Console**: `/admin`
  - Email: `admin@ganitadda.in`
  - Password: `Admin@GanitAdda2026!`
- **Sample Coupons**:
  - `GANIT50` (Flat ₹50 off on orders above ₹199)
  - `BOARD10` (10% discount on all materials)
  - `TOPPER` (₹30 off)
- **Contact Details Preserved**:
  - Phone: `9874169625`
  - Email: `madeeasyganit@gmail.com`
  - WhatsApp: `+91 9874169625`
