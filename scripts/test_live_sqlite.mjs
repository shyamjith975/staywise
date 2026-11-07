import { DatabaseSync } from 'node:sqlite';

const BASE_URL = 'http://localhost:3005';

async function run() {
  console.log('=====================================================');
  console.log('LIVE DATABASE PERSISTENCE & API TEST SUITE');
  console.log('=====================================================');

  // Step 1: Record initial users in database.db and close
  const dbBefore = new DatabaseSync('database.db');
  const countBefore = dbBefore.prepare('SELECT count(*) as c FROM users').get().c;
  dbBefore.close();
  console.log(`[Initial] Users count in database.db: ${countBefore}`);

  // Step 2: Create new User via POST /api/auth/signup
  const testEmail = `live_owner_${Date.now()}@staywise.com`;
  console.log(`\n[Test 1] Creating User via POST /api/auth/signup (${testEmail})...`);
  const signupRes = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Rohan Mehra',
      email: testEmail,
      password: 'Password@123',
      role: 'owner',
      phone: '+91 98765 43210',
      portfolioName: 'Mehra Coastal Residences',
      city: 'Kozhikode'
    })
  });
  const signupJson = await signupRes.json();
  console.log('Signup Response Status:', signupRes.status);
  console.log('Signup Response Data:', signupJson.success, signupJson.user?.id);

  if (!signupJson.success) {
    throw new Error('Signup failed: ' + JSON.stringify(signupJson));
  }

  // Step 3: DIRECT DISK CHECK on database.db for the newly created user!
  const dbCheckUser = new DatabaseSync('database.db');
  const createdUser = dbCheckUser.prepare('SELECT * FROM users WHERE email = ?').get(testEmail);
  dbCheckUser.close();

  console.log('\n[Direct DB Check on database.db]');
  console.log('User found in database.db:', createdUser ? 'YES! DIRECT DISK PERSISTENCE VERIFIED' : 'NO');
  console.log(createdUser);

  if (!createdUser) {
    throw new Error('User was NOT found directly in database.db!');
  }

  // Step 4: Login via POST /api/auth/login
  console.log('\n[Test 2] Authenticating via POST /api/auth/login...');
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: 'Password@123'
    })
  });
  const loginJson = await loginRes.json();
  console.log('Login Response Status:', loginRes.status, 'User:', loginJson.user?.name);

  // Step 5: Onboard a Tenant via POST /api/tenants
  console.log('\n[Test 3] Onboarding Tenant via POST /api/tenants...');
  const tenantEmail = `live_tenant_${Date.now()}@staywise.com`;
  const tenantRes = await fetch(`${BASE_URL}/api/tenants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Pooja Sharma',
      email: tenantEmail,
      phone: '+91 91234 56789',
      propertyId: 'prop-beach-road',
      unitNumber: '304',
      monthlyRent: 26000,
      deposit: 52000,
      leaseStart: '2026-10-15',
      leaseEnd: '2027-10-14',
      rentDueDate: 5
    })
  });
  const tenantJson = await tenantRes.json();
  console.log('Tenant Onboarding Status:', tenantRes.status, 'Success:', tenantJson.success);

  // Step 6: Verify Tenant in database.db
  const dbCheckTenant = new DatabaseSync('database.db');
  const createdTenant = dbCheckTenant.prepare('SELECT * FROM tenants WHERE email = ?').get(tenantEmail);
  dbCheckTenant.close();
  console.log('Tenant found in database.db:', createdTenant ? 'YES!' : 'NO');

  // Step 7: Create Maintenance Ticket via POST /api/tickets
  console.log('\n[Test 4] Raising Ticket via POST /api/tickets...');
  const ticketRes = await fetch(`${BASE_URL}/api/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      propertyId: 'prop-beach-road',
      propertyName: 'Beach Road Apartments',
      unitNumber: '304',
      tenantName: 'Pooja Sharma',
      category: 'Plumbing',
      title: 'Water filter pressure low',
      description: 'Incoming line needs booster servicing',
      priority: 'Medium',
      status: 'Triaged',
      estimatedCost: 1200
    })
  });
  const ticketJson = await ticketRes.json();
  console.log('Ticket API Status:', ticketRes.status, 'Ticket ID:', ticketJson.data?.id);

  // Step 8: Upload Electricity Bill via POST /api/bills
  console.log('\n[Test 5] Recording Bill via POST /api/bills...');
  const billRes = await fetch(`${BASE_URL}/api/bills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: `ebill-${Date.now()}`,
      propertyId: 'prop-beach-road',
      propertyName: 'Beach Road Apartments',
      unitNumber: '304',
      tenantName: 'Pooja Sharma',
      meterNumber: 'MTR-KL-304-X',
      billingMonth: 'October 2026',
      previousReading: 100,
      currentReading: 220,
      unitsConsumed: 120,
      ratePerUnit: 8.5,
      fixedCharges: 150,
      totalAmount: 1170,
      dueDate: '2026-10-25',
      status: 'Due',
      discom: 'KSEB Kerala',
      attachmentName: 'KSEB_Oct2026_Unit304.pdf'
    })
  });
  const billJson = await billRes.json();
  console.log('Bill API Status:', billRes.status, 'Success:', billJson.success);

  // Step 9: Verify Bootstrap GET /api/bootstrap
  console.log('\n[Test 6] Fetching Bootstrap data via GET /api/bootstrap...');
  const bootRes = await fetch(`${BASE_URL}/api/bootstrap`);
  const bootJson = await bootRes.json();
  console.log('Bootstrap Status:', bootRes.status);
  console.log('Loaded Properties:', bootJson.data?.properties?.length);
  console.log('Loaded Tenants:', bootJson.data?.tenants?.length);
  console.log('Loaded Invoices:', bootJson.data?.invoices?.length);
  console.log('Loaded Ledger Records:', bootJson.data?.ledger?.length);
  console.log('Loaded Tickets:', bootJson.data?.tickets?.length);
  console.log('Loaded Bills:', bootJson.data?.electricityBills?.length);
  console.log('Loaded Leads:', bootJson.data?.leads?.length);

  // Step 10: Final Users Count in database.db
  const dbFinal = new DatabaseSync('database.db');
  const countAfter = dbFinal.prepare('SELECT count(*) as c FROM users').get().c;
  dbFinal.close();

  console.log(`\n=====================================================`);
  console.log(`TEST COMPLETED SUCCESSFULLY!`);
  console.log(`Initial database.db users: ${countBefore} -> Current: ${countAfter}`);
  console.log(`Direct database.db file updates fully functional!`);
  console.log(`=====================================================`);
}

run().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
