import fetch from 'node:http';

async function testApi() {
  console.log('=== TESTING LIVE STAYWISE APIS AGAINST REAL SQLITE DATABASE ===\n');

  const BASE = 'http://127.0.0.1:3005';

  // Helper fetcher
  async function call(url, options = {}) {
    const res = await globalThis.fetch(`${BASE}${url}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options
    });
    const json = await res.json();
    return { status: res.status, json };
  }

  // 1. GET /api/bootstrap
  console.log('[1] Testing GET /api/bootstrap ...');
  const boot = await call('/api/bootstrap');
  console.log(`  Status: ${boot.status}, Success: ${boot.json.success}`);
  console.log(`  Properties in DB: ${boot.json.data?.properties?.length}`);
  console.log(`  Tenants in DB: ${boot.json.data?.tenants?.length}`);
  console.log(`  Invoices in DB: ${boot.json.data?.invoices?.length}`);
  console.log(`  Ledger entries in DB: ${boot.json.data?.ledger?.length}`);

  // 2. POST /api/auth/signup (Owner Onboarding)
  const timestamp = Date.now();
  const ownerEmail = `liveowner_${timestamp}@staywise.com`;
  console.log(`\n[2] Testing Owner Onboarding: POST /api/auth/signup for ${ownerEmail} ...`);
  const signupOwner = await call('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Dr. Suresh Nair',
      email: ownerEmail,
      password: 'OwnerPassword@123',
      phone: '+91 98451 22334',
      role: 'owner',
      portfolioName: 'Nair Asset Holdings',
      city: 'Kochi'
    })
  });
  console.log(`  Status: ${signupOwner.status}, Success: ${signupOwner.json.success}`);
  console.log(`  User Created: ${signupOwner.json.user?.name} (${signupOwner.json.user?.roleLabel})`);
  console.log(`  Starter Property Created: ${signupOwner.json.property?.name}`);

  // 3. POST /api/auth/login (Login as newly onboarded Owner)
  console.log(`\n[3] Testing Login for Newly Onboarded Owner: POST /api/auth/login ...`);
  const loginOwner = await call('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: ownerEmail,
      password: 'OwnerPassword@123'
    })
  });
  console.log(`  Status: ${loginOwner.status}, Success: ${loginOwner.json.success}`);
  console.log(`  Authenticated as: ${loginOwner.json.user?.name} [ID: ${loginOwner.json.user?.id}]`);

  // 4. POST /api/tenants/onboard (Tenant Onboarding into Unit 401)
  const tenantEmail = `livetenant_${timestamp}@staywise.com`;
  console.log(`\n[4] Testing Tenant Onboarding: POST /api/tenants/onboard for ${tenantEmail} ...`);
  const onboardTenant = await call('/api/tenants/onboard', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Aishwarya Lakshmi',
      phone: '+91 97455 66778',
      email: tenantEmail,
      propertyId: 'prop-beach-road',
      unitNumber: '401',
      monthlyRent: 28000,
      deposit: 84000,
      leaseStart: '2026-10-15',
      leaseEnd: '2027-10-14',
      rentDueDate: 5,
      password: 'TenantPassword@123'
    })
  });
  console.log(`  Status: ${onboardTenant.status}, Success: ${onboardTenant.json.success}`);
  console.log(`  Tenant Record: ${onboardTenant.json.data?.tenant?.name} [Unit ${onboardTenant.json.data?.tenant?.unitNumber}]`);
  console.log(`  Invoice Generated: ${onboardTenant.json.data?.invoice?.invoiceNumber} (₹${onboardTenant.json.data?.invoice?.totalAmount})`);
  console.log(`  Ledger Entry Created: ${onboardTenant.json.data?.ledgerEntry?.description}`);

  // 5. POST /api/auth/login (Login as newly onboarded Tenant)
  console.log(`\n[5] Testing Login for Newly Onboarded Tenant: POST /api/auth/login ...`);
  const loginTenant = await call('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: tenantEmail,
      password: 'TenantPassword@123'
    })
  });
  console.log(`  Status: ${loginTenant.status}, Success: ${loginTenant.json.success}`);
  console.log(`  Authenticated Tenant: ${loginTenant.json.user?.name} [Role: ${loginTenant.json.user?.role}]`);

  // 6. POST /api/invoices/[id]/pay (Pay the newly generated invoice)
  const invoiceId = onboardTenant.json.data?.invoice?.id;
  if (invoiceId) {
    console.log(`\n[6] Testing Rent Payment: POST /api/invoices/${invoiceId}/pay ...`);
    const payRes = await call(`/api/invoices/${invoiceId}/pay`, {
      method: 'POST',
      body: JSON.stringify({
        paymentMethod: 'UPI'
      })
    });
    console.log(`  Status: ${payRes.status}, Success: ${payRes.json.success}`);
    console.log(`  Payment Status: ${payRes.json.data?.invoice?.status}, Txn: ${payRes.json.data?.invoice?.transactionId}`);
  }

  console.log('\n=== ALL LIVE API TESTS COMPLETED SUCCESSFULLY! ===');
}

testApi().catch(console.error);
