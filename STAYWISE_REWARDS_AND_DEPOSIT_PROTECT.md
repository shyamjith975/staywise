# Staywise: Rent Rewards (WisePoints) + Zero-Deposit Protection (Deposit Protect)

## Executive Summary & Product Vision

Staywise unites property management software with tenant financial enablement. By synthesizing the proven customer-retention dynamics of **Bilt Rewards** with an institutional **Zero-Deposit Protection** framework adapted specifically for Indian tenancy law and RBI/IRDAI financial realities, Staywise transforms rent from a transactional expense into a high-loyalty, low-friction living experience.

```
+-----------------------------------------------------------------------------------+
|                                 STAYWISE PLATFORM                                 |
+-----------------------------------------+-----------------------------------------+
|        1. STAYWISE REWARDS              |       2. DEPOSIT PROTECT                |
|           (WisePoints)                  |          (Zero-Deposit)                 |
+-----------------------------------------+-----------------------------------------+
| * Earn on verified on-time UPI rent     | * ₹0 upfront cash lock for tenants      |
| * Double-entry auditable ledger         | * ₹1,00,000 institutional guarantee     |
| * Redeem for rent credits & merchants   | * Digital baseline condition reports    |
| * Sustainable unit economics & caps     | * 14-day claims adjudication desk       |
+-----------------------------------------+-----------------------------------------+
                                      |
                                      v
    +-------------------------------------------------------------------+
    | Connected Rental Flywheel: Higher Retention + Zero Arrears + Trust |
    +-------------------------------------------------------------------+
```

---

## 1. What Staywise Learned from Bilt & What Was Adapted for India

### The Core Bilt Insights
1. **Housing Payments as an Engagement Engine**: Rent is typically a household's largest single monthly expense. Rewarding on-time payments turns rent day into a high-sentiment milestone.
2. **Hyper-Local Merchant Ecosystem**: Points become substantially more valuable when tenants can redeem them for neighborhood fitness, dining, groceries, and home services.
3. **Multi-Utility Points Currency**: Restricting points to negligible fractional rent discounts limits engagement; offering a flexible rewards balance creates strong retention.

### Strategic Adaptations for the Indian Market
* **Payment Rails**: In the US, Bilt relies on co-branded Mastercard credit cards, ACH, and interchange fees. In India, Staywise utilizes **UPI (Unified Payments Interface)**, **AutoPay / e-Mandates**, and **NEFT/IMPS escrow nodal accounts**, ensuring zero merchant surcharge friction.
* **Fixed-Value Sustainable Economics**: Instead of uncapped 1-3% cashback on high rents (which would destroy SaaS unit economics), Staywise provides **fixed monthly reward bonuses** (e.g., 100 WisePoints for on-time payment), merchant-sponsored bonuses, and annual streaks.
* **Regulatory Compliance**: Rather than issuing unsecured consumer credit, Staywise structures Deposit Protect as an **IRDAI-compliant group master policy / institutional guarantee** backed by licensed Indian general insurers or regulated escrow guarantee trusts.

---

## 2. Staywise Rewards (WisePoints) Architecture

> [!IMPORTANT]
> **Tenant-Only Exclusivity**: WisePoints is **strictly for tenants / residents**. Property owners do not earn, hold, or redeem WisePoints. Landlords benefit via **Deposit Protect** institutional protection (guaranteeing against unpaid rent and property damage) and significantly higher on-time rent payment collection rates driven by tenant points incentives.

### Currency Valuation & Double-Entry Ledger
* **Base Valuation**: 100 WisePoints ≈ ₹50 redemption parity (₹0.50 / point value in goods/services).
* **Double-Entry Ledger Entity (`rewards_ledger`)**: Every transaction records `transaction_type` (`EARNED`, `REDEEMED`, `REVERSED`, `EXPIRED`, `PENDING`), points delta, partner references, and monetary cost tracking.
* **Strict Anti-Collusion Rules**: Points are only awarded upon bank-verified invoice settlement. Reversed or disputed payments trigger an immediate points clawback. AI agents cannot mutate balances directly.

### Launch Earning Rules

| Qualifying Tenancy Action | WisePoints Awarded | Monetary Liability | Funding Source | Eligibility Criteria |
|:--------------------------|:-------------------|:-------------------|:---------------|:---------------------|
| **Verified On-Time Rent** | **100 pts** | ₹50.00 | Staywise Platform | Rent cleared via UPI/AutoPay on or before the due date. |
| **Move-In Condition Report** | **100 pts** | ₹50.00 | Staywise Platform | Minimum 6 timestamped room & fixture photos uploaded. |
| **Lease Renewal via App** | **200 pts** | ₹100.00 | Shared (Owner / Staywise) | Completed digital 11-month lease agreement renewal. |
| **Verified Tenant Referral** | **300 pts** | ₹150.00 | Staywise Growth Budget | Referred resident signs lease and clears Month 1 rent. |
| **Local Merchant Purchases** | **150 pts** | ₹75.00 | 100% Merchant Funded | Order placed with participating neighborhood partner. |
| **12-Month Payment Streak**| **500 pts** | ₹250.00 | Staywise Platform | 12 consecutive verified on-time monthly rent payments. |

### Sustainable Economics & Liability Safeguards
1. **Monthly Liability Cap**: Maximum Staywise cost per tenant is capped at ₹50/month (100 pts).
2. **Breakage Rate**: Modeled on standard loyalty metrics with 25-30% point expiry / non-redemption over 18 months, reducing effective cost to ~₹35/tenant/month.
3. **Merchant Co-Funding**: 70% of partner voucher value is subsidized by merchants eager for high-intent urban resident footfall.

---

## 3. Points Redemption Store

```
+--------------------------------------------------------------------------------+
|                         WISEPOINTS REDEMPTION CHANNELS                         |
+-------------------+--------------------+-------------------+-------------------+
|    RENT CREDIT    |   HOME SERVICES    |   LOCAL MERCHANTS |  DEPOSIT PROTECT  |
+-------------------+--------------------+-------------------+-------------------+
| 200 pts = ₹100    | 250 pts = ₹300 off | 200 pts = ₹400 off| 150 pts = 50% off |
| Instant discount  | Urban Company deep | Cult.fit pass,    | Monthly protection|
| at rent checkout  | clean & repairs    | Blue Tokai coffee | service fee       |
+-------------------+--------------------+-------------------+-------------------+
```

1. **Direct Rent Invoice Credits**: Tenants can toggle `[x] Apply 200 WisePoints (-₹100)` directly within the `PayRentModal` checkout dialog.
2. **Home Deep Cleaning & Repairs**: Integrated with home service partners (Urban Company, Pepperfry) for move-in painting, AC servicing, and sofa sanitization.
3. **Neighborhood Merchant Network**:
   * **Cult.fit**: ₹400 voucher for gym and group fitness passes.
   * **Urban Company**: ₹300 off home deep cleaning & plumbing.
   * **Blue Tokai Coffee**: ₹200 off cafe brews and bean subscriptions.
   * **Nature's Basket**: ₹150 voucher for organic groceries.
   * **Pepperfry**: ₹500 off home decor and workstation furniture.
   * **Apollo 24|7**: ₹250 voucher for diagnostic health checkups.
4. **Deposit Protect Fee Offset**: Apply 150 points to discount the monthly protection premium by 50%.

---

## 4. Staywise Deposit Protect (Zero-Deposit Guarantee)

### The Problem in Indian Renting
* **Tenants**: Must lock up ₹50,000 to ₹3,00,000 (2 to 10 months' rent) in upfront refundable deposits, straining liquidity during relocations.
* **Landlords**: Deal with endless disputes during checkout over minor paint scuffs, delayed deposit repayments, and legal friction.

### The Solution: Institutional Guarantee
* **₹0 Upfront Deposit**: The tenant moves in without locking capital.
* **Small Monthly Protection Fee**: The tenant pays ₹600–₹1,200/month (e.g., ₹750/month for a ₹25,000/month flat).
* **₹1,00,000 Landlord Guarantee**: Landlord receives an institutional policy (`SW-DP-2026-KL902`) providing guaranteed payout for:
  1. Unpaid rent arrears (up to 3 months / specified limit).
  2. Documented tenant-caused physical damage beyond normal wear and tear.
  3. Pre-agreed checkout deep clean and repainting costs.

### Digital Property Condition Baseline (`property_condition_reports`)
* Mandatory move-in audit with timestamped photos of walls, appliances, electricals, and sanitary fixtures.
* Move-out audit compares checkout photos against the move-in baseline to identify legitimate damage versus ordinary wear and tear.

### Claims & Dispute Settlement Desk (`protection_claims`)
1. **Owner Submission**: Landlord files a claim with photographic proof, repair quotation, and tenant ledger.
2. **7-Day Review Window**: Tenant reviews evidence and can either accept or submit counter-evidence.
3. **14-Day Direct Settlement**: Approved claims are paid directly to the landlord's verified bank account via NEFT/IMPS.

### Regulatory Structure (IRDAI Compliance)
* Staywise does not act as an uncertified insurance risk bearer.
* Policies are underwritten by authorized Indian general insurers (e.g., ICICI Lombard, HDFC ERGO) or backed by a regulated corporate surety trust.
* Staywise operates as a corporate technology facilitator and group policy administrator under IRDAI master policy guidelines.

---

## 5. End-to-End Implementation Architecture

### Database Schema (relational tables in `database.db`)

```sql
-- 1. WisePoints Rewards Accounts
CREATE TABLE IF NOT EXISTS rewards_accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  tier TEXT NOT NULL DEFAULT 'SILVER',
  current_balance INTEGER NOT NULL DEFAULT 0,
  lifetime_earned INTEGER NOT NULL DEFAULT 0,
  lifetime_redeemed INTEGER NOT NULL DEFAULT 0,
  streak_months INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. WisePoints Auditable Ledger
CREATE TABLE IF NOT EXISTS rewards_ledger (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  points INTEGER NOT NULL,
  transaction_type TEXT NOT NULL, -- 'EARNED', 'REDEEMED', 'REVERSED', 'EXPIRED', 'PENDING'
  activity_code TEXT NOT NULL,    -- 'ON_TIME_RENT', 'LEASE_RENEWAL', 'MOVE_IN_REPORT', 'REFERRAL', 'MERCHANT_PERK'
  description TEXT NOT NULL,
  reference_id TEXT,
  reference_type TEXT,
  monetary_value REAL NOT NULL DEFAULT 0.0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Reward Earning Rules Engine
CREATE TABLE IF NOT EXISTS reward_rules (
  id TEXT PRIMARY KEY,
  activity_code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  points_awarded INTEGER NOT NULL,
  cooldown_days INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  funding_source TEXT NOT NULL DEFAULT 'STAYWISE'
);

-- 4. Merchant Voucher Offers
CREATE TABLE IF NOT EXISTS merchant_offers (
  id TEXT PRIMARY KEY,
  merchant_name TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  points_required INTEGER NOT NULL,
  discount_value REAL NOT NULL,
  logo_url TEXT,
  banner_color TEXT,
  terms TEXT,
  is_featured INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1
);

-- 5. Zero-Deposit Protection Applications
CREATE TABLE IF NOT EXISTS deposit_protection_applications (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL,
  unit_number TEXT NOT NULL,
  tenant_user_id TEXT NOT NULL,
  tenant_name TEXT NOT NULL,
  tenant_email TEXT NOT NULL,
  owner_user_id TEXT NOT NULL,
  monthly_rent REAL NOT NULL,
  avoided_deposit REAL NOT NULL,
  monthly_fee REAL NOT NULL,
  coverage_amount REAL NOT NULL,
  risk_tier TEXT NOT NULL DEFAULT 'STANDARD',
  status TEXT NOT NULL DEFAULT 'SUBMITTED',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. Active Protection Contracts
CREATE TABLE IF NOT EXISTS protection_contracts (
  id TEXT PRIMARY KEY,
  application_id TEXT NOT NULL,
  policy_number TEXT NOT NULL UNIQUE,
  property_id TEXT NOT NULL,
  unit_number TEXT NOT NULL,
  tenant_user_id TEXT NOT NULL,
  owner_user_id TEXT NOT NULL,
  underwriter_name TEXT NOT NULL DEFAULT 'Staywise Institutional Guarantee Trust',
  coverage_amount REAL NOT NULL,
  monthly_fee REAL NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  terms_document_url TEXT
);

-- 7. Digital Baseline Condition Reports
CREATE TABLE IF NOT EXISTS property_condition_reports (
  id TEXT PRIMARY KEY,
  contract_id TEXT,
  property_id TEXT NOT NULL,
  unit_number TEXT NOT NULL,
  report_type TEXT NOT NULL, -- 'MOVE_IN', 'MOVE_OUT', 'PERIODIC'
  conducted_by_user_id TEXT NOT NULL,
  conducted_by_name TEXT NOT NULL,
  conducted_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'VERIFIED',
  overall_rating TEXT NOT NULL DEFAULT 'EXCELLENT',
  summary_notes TEXT,
  items_json TEXT NOT NULL DEFAULT '[]'
);

-- 8. Protection Claims & Settlement Desk
CREATE TABLE IF NOT EXISTS protection_claims (
  id TEXT PRIMARY KEY,
  contract_id TEXT NOT NULL,
  policy_number TEXT NOT NULL,
  property_id TEXT NOT NULL,
  unit_number TEXT NOT NULL,
  claimant_user_id TEXT NOT NULL,
  claim_type TEXT NOT NULL, -- 'UNPAID_RENT', 'PROPERTY_DAMAGE', 'CLEANING_RESTORATION'
  amount_claimed REAL NOT NULL,
  amount_approved REAL NOT NULL DEFAULT 0.0,
  amount_settled REAL NOT NULL DEFAULT 0.0,
  status TEXT NOT NULL DEFAULT 'UNDER_REVIEW',
  description TEXT NOT NULL,
  evidence_urls_json TEXT NOT NULL DEFAULT '[]',
  adjudication_notes TEXT
);
```

### Full-Stack Module Inventory

| Layer | File / Module | Responsibility |
|:------|:--------------|:---------------|
| **Domain Types** | `src/types/index.ts` | Complete TypeScript models for RewardsAccount, RewardsLedgerEntry, RewardRule, MerchantOffer, DepositProtectionApplication, ProtectionContract, PropertyConditionReport, ProtectionClaim. |
| **ID Generator** | `src/lib/utils/uniqueId.ts` | Structured prefixes: `rwe-`, `dpapp-`, `dpct-`, `SW-DP-YYYY-XXXX`, `pcr-`, `clm-`. |
| **Database & Engine** | `src/lib/db/database.ts` | Relational tables, indexes, repository methods (`db.rewards.*`, `db.depositProtect.*`), initial seed data. |
| **Bootstrap API** | `src/app/api/bootstrap/route.ts` | Auto-hydrates tenant and owner personas with live rewards balances, ledger, policies, reports, and claims. |
| **Rewards API** | `src/app/api/rewards/route.ts` | GET rewards balances/rules/offers; POST to award points. |
| **Redemption API** | `src/app/api/rewards/redeem/route.ts` | POST to validate balance and redeem points for rent discounts or merchant vouchers with unique code generation. |
| **Deposit Protect API** | `src/app/api/deposit-protect/route.ts` | Manages applications and active policy contracts. |
| **Condition Reports API** | `src/app/api/deposit-protect/condition-reports/route.ts` | Uploads move-in/move-out photo audits and auto-awards +100 WisePoints. |
| **Claims API** | `src/app/api/deposit-protect/claims/route.ts` | Manages filing, tenant dispute counter-evidence, and direct settlements. |
| **Invoice Settlement Loop** | `src/app/api/invoices/[id]/pay/route.ts` | Automatically awards +100 WisePoints to tenant upon on-time rent payment. |
| **Global Context** | `src/context/AppStateContext.tsx` | Provides `earnWisePoints`, `redeemWisePoints`, `applyForDepositProtect`, `submitConditionReport`, `submitProtectionClaim`, `settleProtectionClaim`. |
| **Rewards Hub UI** | `src/components/modules/rewards/StaywiseRewardsHub.tsx` | Premium rewards wallet, coupon code drawer, ways to earn, points history ledger, sustainable unit economics monitor. |
| **Deposit Protect Hub UI** | `src/components/modules/deposit/DepositProtectHub.tsx` | Dual-role cockpit: Tenant comparison calculator & policy card; Owner portfolio coverage, active claims filing, and dispute desk. |
| **Tenant Dashboard** | `src/components/dashboards/TenantDashboard.tsx` | Metric 3 WisePoints balance, Zero-Deposit Protection active guarantee badge, and onboarding links. |
| **Owner Dashboard** | `src/components/dashboards/OwnerDashboard.tsx` | Institutional protection portfolio banner and WisePoints tenant retention metrics. |
| **Checkout Integration** | `src/components/modules/rentflow/PayRentModal.tsx` | Instant `[x] Redeem 200 WisePoints (-₹100)` rent credit toggle + on-time points award confirmation. |
| **Navigation Rails** | `FloatingNavRail.tsx`, `MobileNav.tsx`, `page.tsx` | Full routing and responsive navigation for both features. |

---

## 6. How the Two Products Work Together

```
                                   TENANT LEASE CYCLE
                                           |
                                           v
                        +-------------------------------------+
                        | 1. Property Selected                |
                        |    Chooses Zero-Deposit Protection  |
                        |    (₹0 deposit, saves ₹60,000 cash) |
                        +------------------+------------------+
                                           |
                                           v
                        +-------------------------------------+
                        | 2. Move-In Baseline Inspection      |
                        |    Uploads room & fixture photos    |
                        |    ✦ Auto-awarded +100 WisePoints   |
                        +------------------+------------------+
                                           |
                                           v
                        +-------------------------------------+
                        | 3. On-Time Monthly Rent Payment     |
                        |    Pays via UPI / AutoPay           |
                        |    ✦ Auto-awarded +100 WisePoints   |
                        +------------------+------------------+
                                           |
                                           v
                        +-------------------------------------+
                        | 4. WisePoints Redemption Loop       |
                        |    * -₹100 Instant Rent Discount    |
                        |    * Urban Company Home Cleaning    |
                        |    * Cult.fit Gym Passes            |
                        +------------------+------------------+
                                           |
                                           v
                        +-------------------------------------+
                        | 5. Move-Out & Guaranteed Handover   |
                        |    Photos compared against baseline |
                        |    Landlord claims settled directly |
                        |    Tenant deposit held = ₹0 dispute |
                        +-------------------------------------+
```

---

## 7. Revenue Model for Staywise

| Revenue Stream | Payer | Monetization Structure | Target Contribution |
|:---------------|:------|:-----------------------|:--------------------|
| **Property-Management SaaS** | Property Owner | Monthly or annual subscription per unit/bed. | 45% |
| **Deposit Protect Distribution** | Tenant / Owner | Technology facilitation fee & distribution margin. | 30% |
| **Merchant Co-Marketing** | Brand Partners | Performance fee / commission per redeemed voucher. | 15% |
| **Premium Landlord Services** | Property Owner | Move-in condition inspections, agreement drafting, eSign. | 10% |

---

## 8. Phased Rollout Roadmap

* **Month 1 — Regulatory Review & Underwriter Onboarding**: Complete legal vetting with IRDAI-compliant insurance counsel and finalize underwriting terms with institutional general insurance partners.
* **Month 2 — WisePoints Beta Pilot**: Launch WisePoints with verified UPI on-time rent payment rewards, digital ledger, and initial 6 brand partners (Cult.fit, Urban Company, Blue Tokai, etc.).
* **Month 3 — Deposit Protect Cohort Rollout**: Activate Deposit Protect for selected residential properties and PG assets in Bangalore and Kochi.
* **Months 4–6 — Scale & Marketplace Expansion**: Roll out nationwide, track loss ratios, expand neighborhood merchant density, and optimize points redemption velocity.

---
*Staywise Architecture Reference Specification • Production Verified*
