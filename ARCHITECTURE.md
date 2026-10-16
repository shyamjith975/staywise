# Staywise — Technical Architecture & Developer Guide

Welcome to the **Staywise** codebase! This document serves as the comprehensive engineering guide for software engineers, product architects, and full-stack developers working on this application.

---

## 1. System Overview & Technology Stack

| Layer | Technology | Details / Rationale |
| :--- | :--- | :--- |
| **Language** | **TypeScript 5.x** | 100% strict type safety across domain models, UI props, and state actions. |
| **Frontend Framework** | **Next.js 16.3 (App Router)** | High-performance React 19 framework using Turbopack for lightning-fast bundling. |
| **Styling & Design System** | **Tailwind CSS v4 + Vanilla CSS** | Bespoke luxury aesthetic: parchment background (`#fcfbf7`), obsidian typography (`#19251f`), subtle emerald metrics, and responsive flex/grid layouts. |
| **Icons & Visuals** | **Lucide React** | Ultra-crisp, tree-shakable SVG icon suite. |
| **Micro-Interactions** | **Canvas-Confetti** | Rewarding visual feedback upon rent payment completions and tenant actions. |
| **Persistent Data & Storage** | **SQLite 3 (ACID Relational Engine)** | Fully persistent relational database (`database.db`) with 17+ SQL tables for Users, Properties, Units, Tenants, Invoices, Ledger, Tickets, and Subscriptions. Multi-tab synchronization via `BroadcastChannel` and `/api/bootstrap`. |
| **Security & Authentication** | **SHA-256 Encryption & HMAC-SHA256 Tokens** | Passwords stored as 64-character SHA-256 cryptographic hashes with constant-time verification. Stateless HMAC-SHA256 signed session tokens. Layer 7 Token-Bucket rate limiting and OWASP Top 10 security headers enforced in `src/proxy.ts`. |
| **Backend & API Architecture** | **Next.js 16 Route Handlers (REST)** | Authoritative server endpoints under `src/app/api/*` with anti-tampering validations, double-entry ledger settlement, and PostgreSQL/Prisma-ready repository abstraction in `src/lib/db/database.ts`. |

---

## 2. Directory Structure & Code Organization

```
Staywise/
├── public/                       # Static public assets, architectural images, SVG icons
├── src/
│   ├── app/                      # Next.js App Router root
│   │   ├── globals.css           # Global typography, color tokens, and custom scrollbars
│   │   ├── layout.tsx            # Global HTML shell, viewport, and metadata
│   │   └── page.tsx              # Main entry point: switches views based on role & activeView
│   ├── components/
│   │   ├── auth/                 # Multi-role authentication & demo credential picker
│   │   │   └── LoginView.tsx     # One-click persona switcher (Owner, Tenant, Manager, Admin, etc.)
│   │   ├── dashboards/           # Role-specific executive overview dashboards
│   │   │   ├── OwnerDashboard.tsx             # Vikram Singhania (Asset & yield metrics, audit badges)
│   │   │   ├── TenantDashboard.tsx            # Shyam Sundar (Lease details, flex rent payments)
│   │   │   ├── AdminDashboard.tsx             # Super Admin (Property verification & platform surveillance)
│   │   │   ├── ManagerDashboard.tsx          # Arjun Das (Operations, triage queue, on-field tasks)
│   │   │   ├── VendorDashboard.tsx           # RapidCool HVAC (Service jobs, escrow settlements)
│   │   │   └── EstateHospitalityDashboard.tsx# Manoj Kumar (Luxury villas, Airbnb turnaround)
│   │   ├── layout/               # Universal UI layout components
│   │   │   ├── TopHeader.tsx          # Role switcher, portfolio selector, and live notifications
│   │   │   ├── FloatingNavRail.tsx    # Primary navigation rail with responsive dock
│   │   │   ├── MobileNav.tsx          # Dedicated mobile bottom drawer & menu
│   │   │   ├── LiveActivityTicker.tsx # Real-time platform event ticker
│   │   │   └── GlobalSearchModal.tsx  # Universal Cmd/Ctrl+K search modal
│   │   └── modules/              # Domain-specific business modules
│   │       ├── properties/            # Property listings, Add Property modal, Edit Property modal
│   │       ├── rentflow/              # Rent collection, UPI/FlexPay, electricity split calculator
│   │       ├── pg/                    # PG & Co-living live bed grid, meal planner, room occupancy
│   │       ├── commercial/            # Commercial units, CAM expenses, tenant visitor logs
│   │       ├── moveflow/              # Move-in/out inspections, dispute resolution, deposit payouts
│   │       ├── maintenance/           # Ticket creation, vendor assignment, SLA tracking
│   │       ├── leasing/               # Leads CRM & visit scheduling pipeline
│   │       ├── discovery/             # "Find Next Home" resident referral engine
│   │       ├── ai/                    # Staywise AI copilot & predictive portfolio alerts
│   │       ├── analytics/             # Financial cash flow forecasting & occupancy charts
│   │       └── settings/              # Platform configurations & profile settings
│   ├── context/
│   │   └── AppStateContext.tsx   # Centralized reactive state store, handlers & dispatchers
│   ├── data/
│   │   └── mockData.ts           # Realistic seed dataset (Portfolios, Properties, Ledger, Leases)
│   └── types/
│       └── index.ts              # Canonical TypeScript interfaces for all domain models
├── package.json                  # Dependencies and execution scripts
├── tsconfig.json                 # TypeScript compiler options
└── README.md                     # Executive project overview
```

---

## 3. Core Architectural Concepts

### A. Persona-Driven Role-Based Access Control (RBAC)
Staywise supports six distinct personas defined in `src/types/index.ts` (`UserRole`):
1. **`owner` (Vikram Singhania)**: Aggregated portfolio command center, financial yield tracking, property lifecycle management with cover image picker, and verification audit indicators.
2. **`tenant` (Shyam Sundar)**: Strict self-boundary tenant dashboard. Pay rent via UPI/Card/FlexPay, upload & split sub-meter electricity bills, raise maintenance tickets, and earn through property referrals.
3. **`admin` (Chief Admin)**: Platform Governance & Surveillance:
   - **No Onboarding Clutter**: Dedicated read-only surveillance of all platform tenants, portfolios, total payments, and escrow disputes.
   - **Property Verification Queue**: Audits submitted legal deeds, occupancy certificates, and fire safety NOCs before approving properties for live listing.
   - **Influencer & Referral Engine**: Configures promo codes (`KERALALUXURY`, `TECHPARKLIVING`) with customizable commission cuts (% or flat ₹) and tracking metrics.
4. **`manager` (Arjun Das)**: Field operations, unit turnover, maintenance dispatch, and physical lead visits.
5. **`vendor` (RapidCool HVAC)**: Job dispatch board, photo proof uploads, and automated escrow payout release requests.
6. **`estate_manager` (Manoj Kumar)**: Luxury estates, boutique hotels, and vacation rentals with smart check-in workflows.

### B. Unified Multi-Asset Universe
Unlike traditional software limited to apartments, Staywise manages:
- **Residential**: Flats, independent villas, penthouses.
- **PG & Co-Living**: Granular bed-level occupancy grids, room gender allocations, and meal plan tracking.
- **Commercial & Industrial**: Area-based leasing (sq. ft.), Common Area Maintenance (CAM) dynamic expense recovery, and visitor management.
- **Estate Hospitality**: Short-term stay turnaround, key handovers, and guest services.

### C. Financial Integrity: Double-Entry Ledger & Escrow
All monetary transactions (rent, security deposits, vendor payouts, influencer commissions) generate immutable `LedgerEntry` records in `AppStateContext.tsx`:
- Tracks debit and credit legs.
- Simulates statutory double-entry accounting with audit reference IDs.
- Protects security deposits in smart escrow until MoveFlow checkout inspections are validated.

---

## 4. How State Flows in the Application

```
┌────────────────────────────────────────────────────────┐
│                   src/data/mockData.ts                 │
│         (Initial seeded properties, tenants, etc.)      │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│             src/context/AppStateContext.tsx            │
│   - Holds master reactive state (useState / handlers)  │
│   - Exposes business actions:                          │
│       * addProperty (sets PENDING audit status)        │
│       * approveProperty (Admin verification)           │
│       * payRent / splitElectricityBill                 │
│       * addInfluencerOffer / toggleOffer               │
│       * recordLedgerEntry                              │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                    src/app/page.tsx                    │
│    (Main App Shell & Router by activeRole / activeView) │
└───────────────────────────┬────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
┌───────────────────────┐       ┌───────────────────────┐
│  src/components/      │       │  src/components/      │
│     dashboards/       │       │       modules/        │
│  (Owner, Admin, etc.) │       │  (RentFlow, PG, etc.) │
└───────────────────────┘       └───────────────────────┘
```

---

## 5. Production Database Engine & Security Architecture

Staywise utilizes a persistent relational engine (`database.db`) paired with authoritative Next.js 16 REST endpoints:

1. **Persistent Relational Database**:
   - The engine is implemented in `src/lib/db/database.ts` using Node.js 22's ACID-compliant `node:sqlite` binary interface (`DatabaseSync`), matching the schema defined in `DATABASE_ARCHITECTURE.md`.
   - SQL tables include `users`, `properties`, `property_units`, `tenants`, `invoices`, `ledger`, `tickets`, `subscriptions`, and asset engine tables.
   - For PostgreSQL/Supabase production deployment, the repository methods in `src/lib/db/database.ts` provide an isolated data access layer that swaps out SQL drivers without altering UI modules.
2. **SHA-256 Cryptographic Authentication**:
   - Passwords are encrypted as 64-character SHA-256 hashes (`src/lib/security/auth.ts`) with constant-time verification (`crypto.timingSafeEqual`) to prevent timing attacks.
   - User creation, tenant onboarding, and password reset (`/api/auth/change-password`) automatically encrypt passwords.
   - Session authentication uses cryptographically signed HMAC-SHA256 tokens (`createSessionToken`).
3. **Layer 7 Rate Limiter & OWASP Security Headers**:
   - Enforced natively via Next.js 16's `src/proxy.ts`.
   - Rate limiting: 15 req/min on `/api/auth/*` endpoints and 120 req/min on standard endpoints.
   - Security headers: X-Frame-Options (SAMEORIGIN), X-Content-Type-Options (nosniff), Referrer-Policy, Permissions-Policy.
4. **Anti-Tampering Financial Controls**:
   - Rent settlement (`POST /api/invoices/[id]/pay`) looks up the authoritative balance directly from the database and detects Burp Suite price-tampering attacks.
   - Subscriptions are verified with HMAC-SHA256 tamper-proof seals (`subscriptionCatalog.ts`).

---

## 6. How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Build for production
npm run build

# 4. Start production server
npm run start -- -p 3005
```
