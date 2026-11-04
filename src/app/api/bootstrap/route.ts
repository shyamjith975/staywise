import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '../../../lib/db';
import { getAuthenticatedUser } from '../../../lib/security/authorization';

import { 
  getBootstrapCache, 
  setBootstrapCache, 
  invalidateBootstrapCache, 
  BOOTSTRAP_CACHE_TTL 
} from '../../../lib/cache/apiCache';

export function clearBootstrapCache() {
  invalidateBootstrapCache();
}

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(req);
    const queryUserId = req.nextUrl.searchParams.get('userId');
    const targetUserId = queryUserId || auth?.user.id || null;

    let userRole = auth?.user.role;
    let userEmail = auth?.user.email;
    if (queryUserId) {
      const u = await db.users.findById(queryUserId);
      if (u) {
        userRole = u.role;
        userEmail = u.email;
      }
    } else if (!userRole && targetUserId) {
      const u = await db.users.findById(targetUserId);
      if (u) {
        userRole = u.role;
        userEmail = u.email;
      }
    }

    const isSuperAdmin = userRole === 'admin';
    const isDemoAccount = userEmail === 'owner@staywise.com' || targetUserId === 'user-owner-vikram' || targetUserId === 'demo-owner' || (targetUserId === null && req.nextUrl.searchParams.get('demo') === 'true');

    // Fast-path: Check in-memory cache and client ETag (HTTP 304)
    const cacheKey = `${targetUserId || 'anon'}:${userRole || 'public'}:${isDemoAccount}`;
    const cached = getBootstrapCache(cacheKey);
    const clientEtag = req.headers.get('if-none-match');

    if (cached) {
      if (clientEtag && clientEtag === cached.etag) {
        return new NextResponse(null, {
          status: 304,
          headers: {
            'ETag': cached.etag,
            'Cache-Control': 'private, max-age=15, stale-while-revalidate=45',
            'X-Staywise-Cache': 'HIT_304'
          }
        });
      }

      return NextResponse.json({
        success: true,
        data: cached.data
      }, {
        headers: {
          'ETag': cached.etag,
          'Cache-Control': 'private, max-age=15, stale-while-revalidate=45',
          'X-Staywise-Cache': 'HIT_RAM'
        }
      });
    }

    // Unauthenticated requests without demo flag receive clean empty dataset without burning DB queries
    if (!targetUserId && !isDemoAccount) {
      const emptyData = {
        properties: [],
        tenants: [],
        invoices: [],
        ledger: [],
        depositDisputes: [],
        influencerOffers: [],
        tickets: [],
        pgBeds: [],
        pgRooms: [],
        pgMeals: [],
        commercialUnits: [],
        camExpenses: [],
        commercialVisitors: [],
        estateAssets: [],
        staff: [],
        electricityBills: [],
        subscription: null,
        leads: [],
        utilities: [],
        aiInsights: [],
        moveFlowChecklist: [],
        referrals: [],
        users: [],
        tenantConnectionRequests: [],
        rewardsAccount: null,
        rewardsLedger: [],
        rewardRules: [],
        merchantOffers: [],
        depositApplications: [],
        protectionContracts: [],
        conditionReports: [],
        protectionClaims: []
      };

      const etag = `W/"${crypto.createHash('md5').update(JSON.stringify(emptyData)).digest('hex').slice(0, 16)}"`;
      setBootstrapCache(cacheKey, emptyData, etag);

      if (clientEtag && clientEtag === etag) {
        return new NextResponse(null, {
          status: 304,
          headers: {
            'ETag': etag,
            'Cache-Control': 'private, max-age=30, stale-while-revalidate=60',
            'X-Staywise-Cache': 'REVALIDATED_304'
          }
        });
      }

      return NextResponse.json({
        success: true,
        data: emptyData
      }, {
        headers: {
          'ETag': etag,
          'Cache-Control': 'private, max-age=30, stale-while-revalidate=60',
          'X-Staywise-Cache': 'MISS_ANON'
        }
      });
    }

    const [
      allProperties,
      allTenants,
      allInvoices,
      allLedger,
      allDisputes,
      allInfluencerOffers,
      allTickets,
      allPgBeds,
      allPgRooms,
      allPgMeals,
      allCommercialUnits,
      allCamExpenses,
      allCommercialVisitors,
      allEstateAssets,
      allStaff,
      allBills,
      allSubscription,
      allLeads,
      allUtilities,
      allAiInsights,
      allMoveFlowChecklist,
      allReferrals,
      allUsers,
      allTenantConnections,
      allRewardRules,
      allMerchantOffers,
      allDepositApps,
      allProtectionContracts,
      allConditionReports,
      allProtectionClaims
    ] = await Promise.all([
      db.properties.findMany(),
      db.tenants.findMany(),
      db.invoices.findMany(),
      db.ledger.findMany(),
      db.disputes.findMany(),
      db.influencerOffers.findMany(),
      db.tickets.findMany(),
      db.pg.getBeds(),
      db.pg.getRooms(),
      db.pg.getMeals(),
      db.commercial.getUnits(),
      db.commercial.getExpenses(),
      db.commercial.getVisitors(),
      db.estate.getAssets(),
      db.estate.getStaff(),
      db.bills.findMany(),
      db.subscriptions.getForUser(targetUserId || undefined),
      db.leads.findMany(),
      db.utilities.findMany(),
      db.aiInsights.findMany(),
      db.moveFlow.findMany(),
      db.referrals.findMany(),
      db.users.findMany(),
      db.tenantConnections.findMany(),
      db.rewards.getRules(),
      db.rewards.getOffers(),
      db.depositProtect.getApplications(),
      db.depositProtect.getContracts(),
      db.depositProtect.getConditionReports(),
      db.depositProtect.getClaims()
    ]);

    const activeUserAccount = targetUserId 
      ? await db.rewards.getAccount(targetUserId)
      : (isDemoAccount ? await db.rewards.getAccount('user-tenant-shyam') : null);

    const activeLedger = targetUserId 
      ? await db.rewards.getLedger(targetUserId)
      : (isDemoAccount ? await db.rewards.getLedger() : []);

    let responseData: any;


    // For Super Admin or Demo Account: return platform-wide catalog
    if (isSuperAdmin || isDemoAccount) {
      responseData = {
        properties: allProperties,
        tenants: allTenants,
        invoices: allInvoices,
        ledger: allLedger,
        depositDisputes: allDisputes,
        influencerOffers: allInfluencerOffers,
        tickets: allTickets,
        pgBeds: allPgBeds,
        pgRooms: allPgRooms,
        pgMeals: allPgMeals,
        commercialUnits: allCommercialUnits,
        camExpenses: allCamExpenses,
        commercialVisitors: allCommercialVisitors,
        estateAssets: allEstateAssets,
        staff: allStaff,
        electricityBills: allBills,
        subscription: allSubscription,
        leads: allLeads,
        utilities: allUtilities,
        aiInsights: allAiInsights,
        moveFlowChecklist: allMoveFlowChecklist,
        referrals: allReferrals,
        users: allUsers.map(({ password, ...u }) => u),
        tenantConnectionRequests: allTenantConnections,
        rewardsAccount: activeUserAccount,
        rewardsLedger: activeLedger,
        rewardRules: allRewardRules,
        merchantOffers: allMerchantOffers,
        depositApplications: allDepositApps,
        protectionContracts: allProtectionContracts,
        conditionReports: allConditionReports,
        protectionClaims: allProtectionClaims
      };
    } else {

    const userProperties = allProperties.filter(p => p.ownerId === targetUserId);
    const userPropIds = userProperties.map(p => p.id);
    const userPropNames = userProperties.map(p => p.name.toLowerCase());

    // Approved connection emails for this owner
    const approvedTenantEmails = allTenantConnections
      .filter(r => (r.ownerId === targetUserId || (userEmail && r.ownerEmail?.toLowerCase() === userEmail.toLowerCase()) || (r.propertyId && userPropIds.includes(r.propertyId))) && r.status === 'APPROVED')
      .map(r => r.tenantEmail?.toLowerCase() || '');

    const userTenants = (userRole === 'tenant')
      ? allTenants.filter(t => t.userId === targetUserId || (userEmail && t.email.toLowerCase() === userEmail.toLowerCase()))
      : allTenants.filter(t => 
          userPropIds.includes(t.propertyId) || 
          (t.propertyName && userPropNames.includes(t.propertyName.toLowerCase())) ||
          (t.email && approvedTenantEmails.includes(t.email.toLowerCase()))
        );
    const userTenantIds = userTenants.map(t => t.id);

    const userInvoices = (userRole === 'tenant')
      ? allInvoices.filter(i => userTenantIds.includes(i.tenantId) || (userEmail && i.tenantName?.toLowerCase().includes(userEmail.toLowerCase())))
      : allInvoices.filter(i => userPropIds.includes(i.propertyId) || userTenantIds.includes(i.tenantId));

    const userTickets = (userRole === 'tenant')
      ? allTickets.filter(t => userTenants.some(ut => ut.propertyId === t.propertyId && ut.unitNumber === t.unitNumber))
      : allTickets.filter(t => userPropIds.includes(t.propertyId));

    const userBills = (userRole === 'tenant')
      ? allBills.filter(b => userTenants.some(ut => ut.propertyId === b.propertyId && ut.unitNumber === b.unitNumber))
      : allBills.filter(b => userPropIds.includes(b.propertyId));

    const userLedger = (userRole === 'tenant')
      ? allLedger.filter(l => (targetUserId && l.referenceId.includes(targetUserId)) || userTenantIds.some(tid => l.referenceId.includes(tid)))
      : allLedger.filter(l => userPropIds.some(pid => l.referenceId.includes(pid)));

    const userEstateNames = userProperties.map(p => p.name);
    const userEstateAssets = allEstateAssets.filter(a => userEstateNames.includes(a.estateName));
    const userStaff = allStaff.filter(s => userEstateNames.includes(s.estateName));
    const userUtilities = allUtilities.filter(u => userEstateNames.includes(u.estateName));

    const userPgRooms = allPgRooms.filter(r => userPropIds.includes(r.propertyId));
    const userPgRoomIds = userPgRooms.map(r => r.id);
    const userPgRoomNumbers = userPgRooms.map(r => r.roomNumber);
    const userPgBeds = allPgBeds.filter(b => 
      userPgRoomIds.includes(b.roomId) || userPgRoomNumbers.includes(b.roomNumber)
    );

    const userCommercialUnits = allCommercialUnits.filter(u => userPropIds.includes(u.propertyId || ''));

    const userMoveFlowChecklist = userTenants.length > 0 ? allMoveFlowChecklist : [];
    const userDepositDisputes = allDisputes.filter(d => 
      userPropIds.includes(d.propertyId) || userTenants.some(t => t.name === d.tenantName)
    );

      responseData = {
        properties: userProperties,
        tenants: userTenants,
        invoices: userInvoices,
        ledger: userLedger,
        depositDisputes: userDepositDisputes,
        influencerOffers: [],
        tickets: userTickets,
        pgBeds: userPgBeds,
        pgRooms: userPgRooms,
        pgMeals: userPgRooms.length > 0 ? allPgMeals : [],
        commercialUnits: userCommercialUnits,
        camExpenses: userCommercialUnits.length > 0 ? allCamExpenses : [],
        commercialVisitors: userCommercialUnits.length > 0 ? allCommercialVisitors : [],
        estateAssets: userEstateAssets,
        staff: userStaff,
        electricityBills: userBills,
        subscription: allSubscription,
        leads: [],
        utilities: userUtilities,
        aiInsights: userProperties.length > 0 ? allAiInsights : [],
        moveFlowChecklist: userMoveFlowChecklist,
        referrals: [],
        users: allUsers.map(({ password, ...u }) => u),
        tenantConnectionRequests: (userRole === 'tenant')
          ? allTenantConnections.filter(r => r.tenantUserId === targetUserId || (userEmail && r.tenantEmail?.toLowerCase() === userEmail.toLowerCase()))
          : allTenantConnections.filter(r => 
              (r.ownerId && r.ownerId === targetUserId) || 
              (userEmail && r.ownerEmail && r.ownerEmail.toLowerCase() === userEmail.toLowerCase()) || 
              (r.propertyId && userPropIds.includes(r.propertyId)) ||
              (r.propertyName && userPropNames.includes(r.propertyName.toLowerCase()))
            ),
        rewardsAccount: activeUserAccount,
        rewardsLedger: activeLedger,
        rewardRules: allRewardRules,
        merchantOffers: allMerchantOffers,
        depositApplications: (userRole === 'tenant')
          ? allDepositApps.filter(a => a.tenantId === targetUserId)
          : allDepositApps.filter(a => a.ownerId === targetUserId || userPropIds.includes(a.propertyId)),
        protectionContracts: (userRole === 'tenant')
          ? allProtectionContracts.filter(c => c.tenantId === targetUserId)
          : allProtectionContracts.filter(c => c.ownerId === targetUserId || userPropIds.includes(c.propertyId)),
        conditionReports: (userRole === 'tenant')
          ? allConditionReports.filter(cr => cr.tenantId === targetUserId)
          : allConditionReports.filter(cr => userPropIds.includes(cr.propertyId)),
        protectionClaims: (userRole === 'tenant')
          ? allProtectionClaims.filter(cl => cl.tenantId === targetUserId)
          : allProtectionClaims.filter(cl => cl.ownerId === targetUserId || userPropIds.includes(cl.propertyId))
      };
    }


    const etag = `W/"${crypto.createHash('md5').update(JSON.stringify(responseData)).digest('hex').slice(0, 16)}"`;
    setBootstrapCache(cacheKey, responseData, etag);

    if (clientEtag && clientEtag === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          'ETag': etag,
          'Cache-Control': 'private, max-age=15, stale-while-revalidate=45',
          'X-Staywise-Cache': 'REVALIDATED_304'
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: responseData
    }, {
      headers: {
        'ETag': etag,
        'Cache-Control': 'private, max-age=15, stale-while-revalidate=45',
        'X-Staywise-Cache': 'MISS_COMPUTED'
      }
    });

  } catch (error) {
    console.error('[API /api/bootstrap] Error loading database data:', error);
    return NextResponse.json(
      { success: false, error: 'Database read failure' },
      { status: 500 }
    );
  }
}
