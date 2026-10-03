# 🏢 Staywise — Universal Real Estate & Asset Operating System

[![TypeScript](https://img.shields.io/badge/Language-TypeScript_5-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Framework-Next.js_16.3-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/UI-React_19-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-38b2ac.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()

> **Staywise** is an institutional-grade, multi-asset property management platform built for modern landlords, co-living operators, commercial hubs, luxury estate hosts, and residents. It unifies operations, lease management, rent collection, sub-meter billing, statutory double-entry accounting, and platform governance into one unified experience.

---

## 🌟 Core Highlights & Capabilities

- **Unified Multi-Asset Universe**:
  - **Residential Portfolios**: High-end apartments, independent duplexes, and villas.
  - **PG & Co-Living Engine**: Live bed-level interactive grid, room-type allocations, meal plan logs, and dynamic occupancy heatmaps.
  - **Commercial CAM Hubs**: Sq.ft.-based leasing, Common Area Maintenance (CAM) dynamic expense recovery, and tenant visitor logs.
  - **EstateOS & Hospitality**: Luxury villas, boutique hotel keys, short-term turnaround tracking, and smart guest check-ins.
- **RentFlow Financial Engine**:
  - Multi-rail payment checkout: UPI, NetBanking, Debit/Credit Cards, Autopay, and flexible installment plans (FlexPay).
  - Sub-meter electricity split calculator with photographic bill upload and audit modal.
  - Automated PDF/digital rent receipt generation with tax invoices and HRA deduction markers.
- **Double-Entry Ledger & Escrow Settlement**:
  - Statutory accounting system tracking debit and credit legs with audit references.
  - Smart security deposit escrow holding with photographic move-in/out checklists and dispute adjudication.
- **Super Admin Governance & Surveillance**:
  - Clean platform overview without onboarding clutter.
  - Property Verification Queue: Admin doc audit for title deeds, fire NOCs, and municipal approvals before properties go live.
  - Platform-wide data surveillance: total clients, tenants, active invoices, and escrow disputes.
  - Influencer & Referral Engine: Generate custom promo codes (flat ₹ or % commission) for affiliate influencers with audience perks.

---

## 🛠️ Technology Stack Breakdown

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Language** | **TypeScript 5.x** | Strict end-to-end type safety across domain entities and UI. |
| **Frontend Framework** | **Next.js 16.3 (App Router)** | High-performance React 19 architecture with Turbopack. |
| **Styling** | **Tailwind CSS v4** | Warm architectural parchment design system (`#fcfbf7`, `#19251f`, emerald accents). |
| **Icons** | **Lucide React** | Scalable vector icons. |
| **State Management** | **React Context (`AppStateContext`)** | Centralized, reactive state store with optimistic updates and event dispatchers. |
| **Database Readiness** | **PostgreSQL / Supabase / Prisma** | Schema-ready interfaces in `src/types/index.ts` for instant ORM mapping. |

For deep technical details, see the complete [Architecture & Developer Guide (ARCHITECTURE.md)](./ARCHITECTURE.md).

---

## 👥 Personas & Demo Accounts

Staywise includes one-click role switching with preloaded production-grade mock data:

| Persona | Role | Key Functionality |
| :--- | :--- | :--- |
| **Vikram Singhania** | `owner` | Portfolio aggregation, yield metrics, document audit badges, add/edit property with custom cover images. |
| **Shyam Sundar** | `tenant` | Tenant dashboard, UPI/FlexPay rent payments, electricity bill splitting, maintenance tickets, and referral earnings. |
| **Chief Admin** | `admin` | Legal document verification queue, platform data surveillance (tenants, invoices, disputes), and influencer campaign generator. |
| **Arjun Das** | `manager` | Operations triage queue, vendor dispatches, and field inspections. |
| **RapidCool HVAC** | `vendor` | Work order fulfillment, job photo uploads, and escrow payment claims. |
| **Manoj Kumar** | `estate_manager` | Luxury villa management, Airbnb turnover, and guest concierge services. |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm**

### Quick Setup

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/staywise.git
cd staywise

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port specified in terminal) to view the application.

### Production Build

```bash
# Build optimized production bundle
npm run build

# Start production server
npm run start -- -p 3005
```

---

## 📁 Key File Index for Developers

- **Domain Types & Schemas**: [`src/types/index.ts`](./src/types/index.ts)
- **Central State & Business Logic**: [`src/context/AppStateContext.tsx`](./src/context/AppStateContext.tsx)
- **Main View Router Shell**: [`src/app/page.tsx`](./src/app/page.tsx)
- **Dashboards**: [`src/components/dashboards/`](./src/components/dashboards/)
- **Core Feature Modules**: [`src/components/modules/`](./src/components/modules/)
- **Architecture Guide**: [`ARCHITECTURE.md`](./ARCHITECTURE.md)
