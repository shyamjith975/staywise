# 🏢 Staywise — Complete System Specifications, Architecture & Production Database Design

Welcome to the comprehensive technical documentation for **Staywise**, an institutional-grade, multi-asset property management operating system built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

---

## 📑 Table of Contents

1. [Executive Overview & Core Capabilities](#1-executive-overview--core-capabilities)
2. [Technology Stack Breakdown](#2-technology-stack-breakdown)
3. [Restricted Administrative Architecture (`/admin`)](#3-restricted-administrative-architecture-admin)
4. [Production Database Architecture & Schema Specification](#4-production-database-architecture--schema-specification)
5. [Multi-Persona Role-Based Access Control (RBAC)](#5-multi-persona-role-based-access-control-rbac)
6. [Core Operational & Financial Modules](#6-core-operational--financial-modules)
7. [Repository File Map & Code Organization](#7-repository-file-map--code-organization)
8. [Developer Indications & Extension Guide](#8-developer-indications--extension-guide)
9. [Local Development & Deployment Guide](#9-local-development--deployment-guide)

---

## 1. Executive Overview & Core Capabilities

**Staywise** unifies the entire lifecycle of diverse real estate portfolios into a cohesive operating platform. Unlike legacy property software limited to residential rentals, Staywise natively operates across four distinct real estate categories:
- **Residential**: Multi-unit apartments, villas, and duplexes.
- **PG & Co-Living**: Granular bed-level occupancy grids, room gender sharing types, and meal plan tracking.
- **Commercial & Industrial**: Area-based leasing (sq. ft.), Common Area Maintenance (CAM) dynamic expense recovery, and visitor gate logs.
- **EstateOS & Hospitality**: Luxury villas, boutique hotel keys, short-term turnaround tracking, and smart guest check-ins.

---

## 2. Technology Stack Breakdown

| Component | Technology | Rationale & Purpose |
| :--- | :--- | :--- |
| **Language** | **TypeScript 5.x** | Strict end-to-end typing across domain models, props, and actions. Prevents runtime anomalies. |
| **Frontend Framework** | **Next.js 16.3 (App Router)** | React 19 architecture compiled with Turbopack for rapid compilation and optimized bundle delivery. |
| **Styling** | **Tailwind CSS v4 + Vanilla CSS** | Bespoke luxury aesthetic using parchment surfaces (`#fcfbf7`, `#f7f6f2`), deep obsidian typography (`#19251f`), subtle emerald yield badges, and responsive layouts. |
| **Iconography** | **Lucide React** | Lightweight, tree-shakable SVG icon suite. |
| **Animations** | **Canvas-Confetti** | Rewarding visual micro-interactions upon rent payment and milestone completions. |
| **State & Business Logic** | **React Context (`AppStateContext.tsx`)** | Centralized in-memory reactive data layer that simulates a high-throughput backend with optimistic updates and statutory accounting. |
| **Production Database** | **PostgreSQL 15+ / Supabase / Prisma** | Decoupled schema models in `src/types/index.ts` ready for 1:1 relational database table mapping. |

---

## 3. Restricted Administrative Architecture (`/admin`)

To ensure privacy, institutional security, and compliance, **Super Admin governance has been completely decoupled from the public user portal**:

### Security & Access Control Design
1. **Public View Isolation**:
   - The public login page (`/`) **does not show** the Super Admin option. Only resident and owner accounts (Owner, Tenant, Estate Manager) are visible.
   - Public users navigating the application cannot see administrative verification queues, platform surveillance metrics, or influencer commission engines.
2. **Dedicated Restricted Route (`/admin`)**:
   - Administrative features are hosted exclusively on a dedicated URL route: `http://localhost:3005/admin` (or `https://your-domain.com/admin`).
3. **High-Security Admin Gateway**:
   - Unauthenticated visits to `/admin` display an encrypted governance barrier.
   - Requires administrative identity (`admin@staywise.com`), Master Key (`Admin@123`), and 2FA Security Token PIN (`849201`).
   - Displays client IP recording notice and security audit logs.
4. **Super Admin Capabilities on `/admin`**:
   - **Property Legal Document Verification Queue**: Audits submitted Title Deeds, Fire Safety NOCs, Occupancy Certificates, and Tax Receipts before approving properties for live listing.
   - **Platform Data Surveillance**: Clean read-only oversight of all tenants, portfolios, active invoices, total rent collections, and escrow disputes without onboarding clutter.
   - **Influencer Campaign & Promo Code Engine**: Generates unique affiliate promo codes (e.g. `KERALALUXURY`, `TECHPARKLIVING`) with customizable commission cuts (% or flat ₹), audience perks, and conversion tracking.
   - **Statutory Double-Entry Ledger Surveillance**: Real-time inspection of all platform debits, credits, and reference IDs.

---

## 4. Production Database Architecture & Schema Specification

For full SQL migrations, see the dedicated [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md).

### Core Database Entities

```
┌────────────────────────────────────────────────────────┐
│                   USERS & AUTH TABLE                   │
│   id, email, password_hash, full_name, role, is_active │
└───────────┬────────────────────────────────────────────┘
            │
            ├────────────────────────────────────────────┐
            ▼                                            ▼
┌───────────────────────┐                    ┌───────────────────────┐
│      PORTFOLIOS       │                    │        LEASES         │
│  id, owner_id, name   │                    │  id, unit_id, tenant  │
└───────────┬───────────┘                    └───────────┬───────────┘
            │                                            │
            ▼                                            ▼
┌───────────────────────┐                    ┌───────────────────────┐
│      PROPERTIES       │                    │     RENT_INVOICES     │
│ id, portfolio_id,     │                    │  id, lease_id, period,│
│ verification_status   │                    │  total_amount, status │
└───────────┬───────────┘                    └───────────────────────┘
            │
            ├──────────────────────┬──────────────────────┐
            ▼                      ▼                      ▼
┌───────────────────────┐┌──────────────────────┐┌──────────────────────┐
│    PROPERTY_UNITS     ││  PROPERTY_DOCUMENTS  ││    LEDGER_ENTRIES    │
│ unit_number, rent,    ││ title_deed, fire_noc,││ debit, credit, amount,│
│ security_deposit      ││ verified (Admin audit││ account_code, ref_id │
└───────────────────────┘└──────────────────────┘└──────────────────────┘
```

### Key Production Database Tables

1. **`users`**: Multi-role identity table supporting Owner, Tenant, Manager, Vendor, Admin, and Estate Director personas.
2. **`portfolios`**: Grouping entity allowing single owners to organize assets into multiple funds or regional holdings.
3. **`properties`**: Multi-asset property entity storing location, health score, expected yields, and `verification_status` (`PENDING`, `APPROVED`, `REJECTED`).
4. **`property_documents`**: Legal compliance repository (Title Deeds, Municipal NOCs, Fire Certificates) audited by Super Admin.
5. **`property_units`**: Unit-level inventory storing carpet area, base rent, deposit requirements, and occupancy flags.
6. **`pg_beds`**: Bed-level inventory for co-living operators with sharing types, rates, and meal plan flags.
7. **`leases`**: Tenancy contracts with lease dates, rent due dates, autopay enrollment, and digital agreement URLs.
8. **`rent_invoices`**: Itemized billing records tracking base rent, CAM, utilities, late penalties, payment rail, and status.
9. **`electricity_bills`**: Photographic sub-meter utility records with automated proportional tenant splits.
10. **`ledger_entries`**: Immutable statutory double-entry accounting records tracking debits, credits, and reference IDs.
11. **`moveflow_checklists` & `deposit_disputes`**: Photographic move-in/out check sheets and escrow dispute adjudication.
12. **`influencer_offers`**: Promo code tracking table storing influencer handles, commission structures, clicks, and conversions.

---

## 5. Multi-Persona Role-Based Access Control (RBAC)

Staywise implements six distinct personas:

| Persona | Role | Key Capabilities |
| :--- | :--- | :--- |
| **Vikram Singhania** | `owner` | Unified portfolio overview, yield metrics, document audit status (`⏳ Admin Doc Audit` vs `✓ Verified`), property add/edit with custom cover images. |
| **Shyam Sundar** | `tenant` | Self-boundary resident dashboard, UPI / Card / FlexPay rent payments, sub-meter bill splits, maintenance tickets, and referral earnings. |
| **Chief Admin** | `admin` | **Restricted to `/admin`**. Property document verification queue, full data surveillance, influencer promo codes, double-entry ledger audits. |
| **Arjun Das** | `manager` | Triage queue, physical lead visits, on-field maintenance dispatches, and property unit turnover. |
| **RapidCool HVAC** | `vendor` | Work order fulfillment, photo completion proofs, and automated escrow payout release requests. |
| **Manoj Kumar** | `estate_manager` | Luxury villa management, boutique hotel keys, short-term guest turnaround, and smart check-in workflows. |

---

## 6. Core Operational & Financial Modules

### RentFlow Financial Engine
- **Multi-Rail Checkout**: Direct integration with UPI, NetBanking, Credit/Debit Cards, Autopay, and flexible split installments (FlexPay).
- **Sub-Meter Electricity Billing**: Landlords upload utility invoices; the engine calculates proportional consumption and auto-appends charges to unit rent invoices.
- **Instant Digital Receipts**: Generates GST/tax-compliant rent receipts with HRA deduction indicators.

### MoveFlow Retention & Escrow Disputes
- **Photographic Digital Checklists**: Captures move-in and move-out asset conditions with timestamped photographic proof.
- **Deposit Settlement Calculator**: Automates allowable wear-and-tear deductions and protects tenant security deposits in escrow.
- **Arbitration Queue**: Allows tenants to contest unfair deductions and resolves disputes through mutual adjudication.

### Influencer Campaign & Promo Engine
- Managed exclusively on `/admin`.
- Super Admin creates custom promo codes (e.g. `KERALALUXURY`, `TECHPARKLIVING`).
- Configurable commission structures (flat ₹ or % cut of first month rent) with custom audience perks (e.g. *"₹1,500 Off First Month Rent"*).
- Real-time tracking of clicks, conversions, and accrued commissions.

---

## 7. Repository File Map & Code Organization

```
Staywise/
├── ARCHITECTURE.md                  # Complete technical guide for software engineers
├── DATABASE_ARCHITECTURE.md         # Production SQL schema, Prisma models, and RLS policies
├── README.md                        # Project landing page & quickstart
├── README2.md                       # This comprehensive architecture & design document
├── public/                          # Public static assets, images, icons
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── page.tsx             # DEDICATED RESTRICTED SUPER ADMIN PORTAL (/admin)
│   │   ├── globals.css              # Global styles & design tokens
│   │   ├── layout.tsx               # Root HTML wrapper and metadata
│   │   └── page.tsx                 # Main public application orchestrator (/)
│   ├── components/
│   │   ├── auth/
│   │   │   └── LoginView.tsx        # Public login view (Owner, Tenant, Estate Manager)
│   │   ├── dashboards/
│   │   │   ├── AdminDashboard.tsx   # Super Admin surveillance, audit queue, influencer engine
│   │   │   ├── OwnerDashboard.tsx   # Asset owner portfolio dashboard
│   │   │   ├── TenantDashboard.tsx  # Resident dashboard
│   │   │   ├── ManagerDashboard.tsx # Operations & field manager dashboard
│   │   │   ├── VendorDashboard.tsx  # Service contractor dashboard
│   │   │   └── EstateHospitalityDashboard.tsx # Luxury villa & hospitality dashboard
│   │   ├── layout/                  # Shared headers, navigation rails, tickers
│   │   └── modules/
│   │       ├── properties/          # Add/Edit Property modals with image pickers
│   │       ├── rentflow/            # Rent payments, receipts, bill split calculators
│   │       ├── pg/                  # PG bed grid & meal management
│   │       ├── commercial/          # CAM expenses & visitor management
│   │       ├── moveflow/            # Move-in/out inspections & deposit disputes
│   │       ├── maintenance/         # Maintenance ticket workflows
│   │       └── discovery/           # Find Next Home & referral discovery
│   ├── context/
│   │   └── AppStateContext.tsx      # Centralized state container & business logic
│   ├── data/
│   │   └── mockData.ts              # Seed database dataset
│   └── types/
│       └── index.ts                 # Canonical domain TypeScript models
```

---

## 8. Developer Indications & Extension Guide

The codebase includes explicit inline architectural docstrings:

- **[`src/types/index.ts`](./src/types/index.ts)**: Contains clear schema headers explaining how each TypeScript interface maps directly to relational database tables.
- **[`src/context/AppStateContext.tsx`](./src/context/AppStateContext.tsx)**: Documents the centralized state mutation patterns and provides guidance for replacing in-memory arrays with API routes or Server Actions.
- **[`src/app/page.tsx`](./src/app/page.tsx)**: Explains the dynamic view routing mechanism and strict role-based boundary enforcement.
- **[`src/app/admin/page.tsx`](./src/app/admin/page.tsx)**: Documents the security gateway architecture and credential validation workflow.

---

## 9. Local Development & Deployment Guide

### Prerequisites
- Node.js 18.0.0 or higher
- npm or pnpm

### Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build optimized production bundle
npm run build

# 4. Start production server
npm run start -- -p 3005
```

### URLs
- **Public Resident & Owner Portal**: `http://localhost:3005/`
- **Restricted Super Admin Governance Portal**: `http://localhost:3005/admin`
