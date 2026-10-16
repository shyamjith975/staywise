/**
 * ============================================================================
 * TEST SCRIPT: VERIFY ANGITH LOGIN & PROPERTY MATCHING
 * ============================================================================
 */

const BASE_URL = 'http://localhost:3005';

async function testAngithLogin() {
  console.log('----------------------------------------------------');
  console.log('TEST 1: Authenticating as Angith (angithnk@gmail.com)');
  console.log('----------------------------------------------------');

  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'angithnk@gmail.com',
      password: '12345678@abc',
      role: 'owner'
    })
  });

  const data = await res.json();
  console.log('Status:', res.status);
  console.log('Response:', data);

  if (!res.ok || !data.success) {
    throw new Error(`Login failed: ${JSON.stringify(data)}`);
  }

  const u = data.user;
  console.log(`\nReturned User Profile:`);
  console.log(`- ID: ${u.id}`);
  console.log(`- Name: ${u.name}`);
  console.log(`- Email: ${u.email}`);
  console.log(`- Role: ${u.role}`);

  if (u.name !== 'Angith') {
    throw new Error(`CRITICAL FAILURE: Expected name "Angith", but got "${u.name}"!`);
  }
  console.log('\n>>> SUCCESS: Login returned "Angith", NOT "Rohan"!');

  console.log('\n----------------------------------------------------');
  console.log('TEST 2: Fetching Properties Owned by Angith');
  console.log('----------------------------------------------------');

  const propRes = await fetch(`${BASE_URL}/api/properties?ownerId=${u.id}`);
  const propData = await propRes.json();
  console.log('Properties Status:', propRes.status);
  console.log(`Found ${propData.count} properties owned by Angith:`);
  for (const p of propData.data) {
    console.log(`- [${p.id}] ${p.name} (OwnerId: ${p.ownerId}, Portfolio: ${p.portfolio})`);
    if (p.ownerId !== u.id) {
      throw new Error(`Property ${p.id} ownerId (${p.ownerId}) does not match user ${u.id}`);
    }
  }
  console.log('>>> SUCCESS: All properties correctly matched to user_id!');

  console.log('\n----------------------------------------------------');
  console.log('TEST 3: Demo Role Switcher Canonical Account Verification');
  console.log('----------------------------------------------------');

  const demoRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: 'owner' })
  });
  const demoData = await demoRes.json();
  console.log('Demo Owner Name:', demoData.user.name, 'Email:', demoData.user.email);
  if (demoData.user.email !== 'owner@staywise.com') {
    throw new Error(`Expected demo owner to be owner@staywise.com, but got ${demoData.user.email}`);
  }
  console.log('>>> SUCCESS: Demo role switcher returns canonical owner Vikram Singhania, never Angith or Rohan!');

  console.log('\n================ ALL API TESTS PASSED ================');
}

testAngithLogin().catch(err => {
  console.error('\nTest Failed with Error:', err);
  process.exit(1);
});
