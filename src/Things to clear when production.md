Functions & Services That Are Impractical for Live Production
1. Automated WhatsApp & SMS Reminders (wa.me vs Cloud API)
Current State in Code:
Buttons call alert('WhatsApp Reminder Sent...') or generate a simple https://wa.me/?text=... link.
In EstateHospitalityDashboard.tsx, dispatching digital keys opens a manual WhatsApp web tab.
Why it's Impractical:
A landlord managing 50–200 units cannot manually click WhatsApp links for every rent reminder, receipt, or electricity bill.
If the owner closes their browser, no automated reminders are sent.
Production Fix:
Integrate the Meta WhatsApp Cloud API or Twilio / Gupshup.
Use server-side cron triggers to dispatch automated payment reminders and OTPs directly from the backend without opening browser windows.
2. Payment Gateway & Real-Time Escrow Settlement
Current State in Code:
In PayRentModal.tsx and RentFlowOverview.tsx, clicking "Pay via UPI" marks the invoice as 'Paid' and inserts a double-entry ledger entry directly via local state / /api/invoices/[id]/pay.
Why it's Impractical:
Real money is not actually debited from the tenant's bank account or credited to the landlord's escrow account.
In a real deployment, if an invoice is marked paid without payment gateway authorization, tenants can claim rent was paid without moving any funds.
Production Fix:
Plug in Razorpay Route (for India) or Stripe Connect (International) with webhook listeners (/api/payments/webhook). Invoices must only transition to 'Paid' when the gateway webhook fires payment.captured.
3. Government eKYC (Aadhaar OTP & NSDL PAN Verification)
Current State in Code:
In TenantDashboard.tsx and ExistingTenantWizardModal.tsx, KYC validation is performed using regex patterns (e.g. ^\d{12}$ for Aadhaar and ^[A-Z]{5}[0-9]{4}[A-Z]{1}$ for PAN).
Why it's Impractical:
A tenant can enter any dummy 12-digit number (e.g. 111122223333) and the UI marks them as "Verified Resident".
Legally, false Aadhaar/PAN entries violate KYC norms for rental agreements.
Production Fix:
Connect a licensed KYC API provider (e.g. Karza, Surepass, or Zoop.one).
Send an OTP to the mobile number registered with UIDAI and verify the digital signature before marking kycVerified = true.
4. PDF Generation (HRA Rent Receipts, Form 16 & Audit Statements)
Current State in Code:
Buttons in FinancialAnalyticsView.tsx call alert('Downloading official Form 16 / HRA Rent Receipt...') or open mock preview modals.
Why it's Impractical:
Tenants require signed, official PDF rent receipts with landlord PAN to claim HRA tax exemptions with their employers.
Production Fix:
Use a serverless PDF generator library (e.g. @react-pdf/renderer or puppeteer-core) at /api/invoices/[id]/pdf to generate downloadable PDF receipts.
5. Document & Photo Storage (Direct Base64 vs Object Storage)
Current State in Code:
Uploaded lease agreements, condition photos, and electricity bills are stored in memory or local SQLite BLOB/base64 strings.
Why it's Impractical:
SQLite database size will balloon rapidly when users upload high-resolution property inspection photos and multi-page lease PDFs.
Production Fix:
Use Amazon S3 or Cloudflare R2 with presigned upload URLs (/api/documents/upload). Store only the CDN URL in the database.
6. Live Telephony & Inspection Video Rooms
Current State in Code:
In OwnerDashboard.tsx:
tsx
onClick={() => alert('Live video inspection room generated')}
Why it's Impractical:
Clicking the button shows an alert dialog instead of launching an audio/video call.
Production Fix:
Replace with a Daily.co or Agora embed URL, or generate a Google Meet / Jitsi room link.
7. Hospitality OTA Channel Sync (Airbnb / Booking.com Two-Way Sync)
Current State in Code:
In EstateHospitalityDashboard.tsx, channels show "✓ Connected" statically.
Why it's Impractical:
Bookings made on Airbnb or Booking.com do not automatically populate unless an actual iCal feed or XML channel manager (e.g. Cloudbeds, Channex) is polled.
Production Fix:
Expose an iCal export route (/api/estate/ical/[villaId]) and a periodic background task to fetch external iCal feeds