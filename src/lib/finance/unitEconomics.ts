/**
 * ============================================================================
 * STAYWISE PLATFORM — RENT PROCESSING & DEPOSIT ASSIST UNIT ECONOMICS
 * ============================================================================
 * Financial models, partner risk underwriting, and fee reconciliation:
 * 
 * 1. Rent Processing Unit Economics:
 *    - Payment rail breakdown (UPI, NetBanking, Debit/Credit Card)
 *    - Interchange, Gateway MDR, Platform Take-Rate, Escrow Float yield
 * 
 * 2. Deposit Assist Underwriting & Risk Controls:
 *    - Allows zero/fractional upfront security deposit via surety bond
 *    - Partner NBFC/Insurer risk-sharing (80% insurer coverage, 20% first-loss reserve)
 *    - Resident credit score & income-to-rent risk underwriting algorithm
 *    - Escrow lockout triggers on MoveFlow inspection disputes
 * ============================================================================
 */

export type PaymentRail = 'UPI' | 'NET_BANKING' | 'DEBIT_CARD' | 'CREDIT_CARD';

export interface RentProcessingEconomics {
  rentAmount: number;
  rail: PaymentRail;
  gatewayMdrCost: number;      // Direct gateway cost
  platformFeeCharged: number;   // Billed to tenant/owner
  escrowFloatYield: number;     // 4.5% annualized yield during 3-day settlement
  netContributionMargin: number;// Net profit/loss on transaction
  contributionMarginPct: number;
}

export interface DepositAssistApplication {
  applicantId: string;
  monthlyRent: number;
  securityDepositRequired: number; // E.g. 3x or 6x monthly rent
  monthlyIncome: number;
  creditScore: number;             // Experian / CIBIL (300 - 900)
  previousDisputesCount: number;
  employmentType: 'SALARIED' | 'SELF_EMPLOYED' | 'STUDENT';
}

export interface DepositAssistUnderwritingResult {
  decision: 'APPROVED_TIER_1' | 'APPROVED_TIER_2' | 'REQUIRES_CO_SIGNER' | 'DECLINED';
  riskScore: number;             // 0 - 100 (Higher = safer)
  monthlySuretyFeeInr: number;   // Non-refundable fee paid by resident
  upfrontDepositPaid: number;    // Reduced deposit (e.g. 1 month instead of 6)
  partnerInsurerCoverageInr: number; // 80% coverage
  platformFirstLossReserveInr: number; // 20% reserve
  reasons: string[];
}

export class FinancialOperationsManager {
  private static instance: FinancialOperationsManager;

  private constructor() {}

  public static getInstance(): FinancialOperationsManager {
    if (!FinancialOperationsManager.instance) {
      FinancialOperationsManager.instance = new FinancialOperationsManager();
    }
    return FinancialOperationsManager.instance;
  }

  /**
   * Calculates unit economics on rent collection
   */
  public calculateRentProcessingEconomics(rentAmount: number, rail: PaymentRail): RentProcessingEconomics {
    let mdrRate = 0;
    let fixedFee = 0;
    let platformFee = 0;

    switch (rail) {
      case 'UPI':
        mdrRate = 0; // Statutory 0% MDR on UPI in India
        fixedFee = 0;
        platformFee = 15; // Convenience / instant reconciliation fee
        break;
      case 'NET_BANKING':
        mdrRate = 0;
        fixedFee = 8.00;
        platformFee = 18.00;
        break;
      case 'DEBIT_CARD':
        mdrRate = 0.009; // 0.90%
        platformFee = Math.round(rentAmount * 0.01);
        break;
      case 'CREDIT_CARD':
        mdrRate = 0.0185; // 1.85% interchange
        platformFee = Math.round(rentAmount * 0.021); // 2.1% charged to payer
        break;
    }

    const gatewayMdrCost = Math.round((rentAmount * mdrRate + fixedFee) * 100) / 100;
    
    // Escrow float yield: 4.5% annual on funds held 3 days during reconciliation
    const escrowFloatYield = Math.round(((rentAmount * 0.045) / 365) * 3 * 100) / 100;

    const netContributionMargin = Math.round((platformFee - gatewayMdrCost + escrowFloatYield) * 100) / 100;
    const contributionMarginPct = platformFee > 0 ? Math.round((netContributionMargin / platformFee) * 100) : 100;

    return {
      rentAmount,
      rail,
      gatewayMdrCost,
      platformFeeCharged: platformFee,
      escrowFloatYield,
      netContributionMargin,
      contributionMarginPct
    };
  }

  /**
   * Underwrites Deposit Assist applications using risk criteria
   */
  public underwriteDepositAssist(app: DepositAssistApplication): DepositAssistUnderwritingResult {
    let score = 50; // Neutral starting base
    const reasons: string[] = [];

    // 1. Income-to-rent ratio
    const rentRatio = app.monthlyIncome / app.monthlyRent;
    if (rentRatio >= 3.5) {
      score += 25;
      reasons.push('High income-to-rent buffer (>= 3.5x).');
    } else if (rentRatio >= 2.5) {
      score += 10;
      reasons.push('Acceptable income-to-rent ratio (>= 2.5x).');
    } else {
      score -= 25;
      reasons.push('High rent burden: income is less than 2.5x monthly rent.');
    }

    // 2. Credit score evaluation
    if (app.creditScore >= 760) {
      score += 25;
      reasons.push('Excellent credit tier (>= 760).');
    } else if (app.creditScore >= 680) {
      score += 10;
      reasons.push('Good credit profile (680 - 759).');
    } else if (app.creditScore < 600) {
      score -= 30;
      reasons.push('Sub-prime credit score (< 600).');
    }

    // 3. Past disputes & damage history
    if (app.previousDisputesCount > 0) {
      score -= (app.previousDisputesCount * 20);
      reasons.push(`History of ${app.previousDisputesCount} MoveFlow deposit disputes.`);
    }

    // 4. Employment Stability
    if (app.employmentType === 'SALARIED') {
      score += 5;
    }

    // Clamp score 0 - 100
    score = Math.max(0, Math.min(100, score));

    // Partner Underwriting thresholds
    if (score >= 75) {
      // Tier 1: Zero cash deposit upfront! Resident pays 1.8% monthly surety fee
      const monthlyFee = Math.round(app.monthlyRent * 0.018);
      return {
        decision: 'APPROVED_TIER_1',
        riskScore: score,
        monthlySuretyFeeInr: monthlyFee,
        upfrontDepositPaid: 0,
        partnerInsurerCoverageInr: Math.round(app.securityDepositRequired * 0.8),
        platformFirstLossReserveInr: Math.round(app.securityDepositRequired * 0.2),
        reasons
      };
    } else if (score >= 55) {
      // Tier 2: 1-month fractional deposit + 2.2% monthly surety fee
      const monthlyFee = Math.round(app.monthlyRent * 0.022);
      return {
        decision: 'APPROVED_TIER_2',
        riskScore: score,
        monthlySuretyFeeInr: monthlyFee,
        upfrontDepositPaid: app.monthlyRent, // 1 month instead of full required
        partnerInsurerCoverageInr: Math.round((app.securityDepositRequired - app.monthlyRent) * 0.8),
        platformFirstLossReserveInr: Math.round((app.securityDepositRequired - app.monthlyRent) * 0.2),
        reasons
      };
    } else if (score >= 40) {
      return {
        decision: 'REQUIRES_CO_SIGNER',
        riskScore: score,
        monthlySuretyFeeInr: 0,
        upfrontDepositPaid: app.securityDepositRequired,
        partnerInsurerCoverageInr: 0,
        platformFirstLossReserveInr: 0,
        reasons: [...reasons, 'Application requires a corporate guarantor or verified co-signer.']
      };
    } else {
      return {
        decision: 'DECLINED',
        riskScore: score,
        monthlySuretyFeeInr: 0,
        upfrontDepositPaid: app.securityDepositRequired,
        partnerInsurerCoverageInr: 0,
        platformFirstLossReserveInr: 0,
        reasons: [...reasons, 'Risk score fell below mandatory underwriting threshold. Full standard cash deposit required.']
      };
    }
  }
}

export const financialOperations = FinancialOperationsManager.getInstance();
