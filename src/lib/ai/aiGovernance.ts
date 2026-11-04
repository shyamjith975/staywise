/**
 * ============================================================================
 * STAYWISE PLATFORM — AI GOVERNANCE, QUOTA ENFORCEMENT & COST TRACKING
 * ============================================================================
 * Implements strict AI usage constraints:
 * 1. Hard monthly quotas per user and subscription tier
 * 2. Real-time cost-per-customer accounting (token input/output ledger)
 * 3. High-Value Gatekeeper: AI is restricted EXCLUSIVELY to high-ROI domains:
 *    - Sub-meter electricity bill OCR & OCR error correction
 *    - Lease agreement clause audit & statutory compliance verification
 *    - Dynamic rent yield forecasting & vacancy duration prediction
 *    - Emergency maintenance issue triage & vendor dispatch classification
 * ============================================================================
 */

export type AIOperationType = 
  | 'BILL_OCR_EXTRACTION'
  | 'LEASE_COMPLIANCE_AUDIT'
  | 'DYNAMIC_YIELD_OPTIMIZATION'
  | 'MAINTENANCE_TRIAGE'
  | 'TENANT_SCREENING_RISK'
  | 'GENERAL_COPILOT';

export interface UserAIQuotaConfig {
  tier: 'trial' | 'starter' | 'pro' | 'institutional';
  monthlyOperationsCap: number;
  monthlyCostCapUsd: number;
}

export const TIER_AI_LIMITS: Record<string, UserAIQuotaConfig> = {
  trial: { tier: 'trial', monthlyOperationsCap: 30, monthlyCostCapUsd: 0.15 },
  starter: { tier: 'starter', monthlyOperationsCap: 150, monthlyCostCapUsd: 0.75 },
  pro: { tier: 'pro', monthlyOperationsCap: 800, monthlyCostCapUsd: 4.00 },
  institutional: { tier: 'institutional', monthlyOperationsCap: 3500, monthlyCostCapUsd: 17.50 }
};

export interface AIUsageRecord {
  userId: string;
  operationsCount: number;
  totalTokensUsed: number;
  totalCostUsd: number;
  lastUsedAt: string;
}

export class AIGovernanceService {
  private static instance: AIGovernanceService;
  // In-memory telemetry cache (persisted to ledger on checkpoints)
  private usageMap: Map<string, AIUsageRecord> = new Map();

  private constructor() {}

  public static getInstance(): AIGovernanceService {
    if (!AIGovernanceService.instance) {
      AIGovernanceService.instance = new AIGovernanceService();
    }
    return AIGovernanceService.instance;
  }

  /**
   * Checks if an operation is high-value business automation.
   * Disallows unbounded low-value conversational chit-chat.
   */
  public isHighValueOperation(operation: AIOperationType): boolean {
    const highValueDomains: AIOperationType[] = [
      'BILL_OCR_EXTRACTION',
      'LEASE_COMPLIANCE_AUDIT',
      'DYNAMIC_YIELD_OPTIMIZATION',
      'MAINTENANCE_TRIAGE',
      'TENANT_SCREENING_RISK'
    ];
    return highValueDomains.includes(operation);
  }

  /**
   * Evaluates if the user has quota remaining for an AI operation.
   */
  public evaluateQuota(userId: string, tier: string = 'trial', operation: AIOperationType): {
    allowed: boolean;
    remainingOps: number;
    usedCostUsd: number;
    maxCostUsd: number;
    reason?: string;
  } {
    const limits = TIER_AI_LIMITS[tier] || TIER_AI_LIMITS.trial;
    const currentUsage = this.usageMap.get(userId) || {
      userId,
      operationsCount: 0,
      totalTokensUsed: 0,
      totalCostUsd: 0,
      lastUsedAt: new Date().toISOString()
    };

    // Check high-value filter
    if (!this.isHighValueOperation(operation) && operation === 'GENERAL_COPILOT') {
      // Allow general copilot only if under 20% of monthly quota
      if (currentUsage.operationsCount >= Math.floor(limits.monthlyOperationsCap * 0.2)) {
        return {
          allowed: false,
          remainingOps: Math.max(0, limits.monthlyOperationsCap - currentUsage.operationsCount),
          usedCostUsd: currentUsage.totalCostUsd,
          maxCostUsd: limits.monthlyCostCapUsd,
          reason: 'GENERAL_CHAT_QUOTA_EXHAUSTED: AI quota reserved for high-value tasks (OCR, Lease Audit, Yield Analytics).'
        };
      }
    }

    if (currentUsage.operationsCount >= limits.monthlyOperationsCap) {
      return {
        allowed: false,
        remainingOps: 0,
        usedCostUsd: currentUsage.totalCostUsd,
        maxCostUsd: limits.monthlyCostCapUsd,
        reason: `MONTHLY_QUOTA_REACHED: Limit of ${limits.monthlyOperationsCap} AI operations reached for tier '${tier}'.`
      };
    }

    if (currentUsage.totalCostUsd >= limits.monthlyCostCapUsd) {
      return {
        allowed: false,
        remainingOps: 0,
        usedCostUsd: currentUsage.totalCostUsd,
        maxCostUsd: limits.monthlyCostCapUsd,
        reason: `BUDGET_CAP_EXCEEDED: Monthly AI spend cap of $${limits.monthlyCostCapUsd.toFixed(2)} reached.`
      };
    }

    return {
      allowed: true,
      remainingOps: limits.monthlyOperationsCap - currentUsage.operationsCount,
      usedCostUsd: currentUsage.totalCostUsd,
      maxCostUsd: limits.monthlyCostCapUsd
    };
  }

  /**
   * Records completed AI invocation and computes dollar cost.
   * Based on Gemini Flash token economics ($0.0001 per 1K input tokens, $0.0004 per 1K output tokens).
   */
  public recordUsage(userId: string, inputTokens: number, outputTokens: number, operation: AIOperationType) {
    const estimatedCostUsd = (inputTokens / 1000) * 0.0001 + (outputTokens / 1000) * 0.0004;
    const current = this.usageMap.get(userId) || {
      userId,
      operationsCount: 0,
      totalTokensUsed: 0,
      totalCostUsd: 0,
      lastUsedAt: new Date().toISOString()
    };

    current.operationsCount += 1;
    current.totalTokensUsed += (inputTokens + outputTokens);
    current.totalCostUsd += estimatedCostUsd;
    current.lastUsedAt = new Date().toISOString();

    this.usageMap.set(userId, current);

    return {
      costUsd: estimatedCostUsd,
      totalCostForUser: current.totalCostUsd,
      operationsCount: current.operationsCount
    };
  }

  /**
   * Retrieves audit telemetry across all customers for finance reports
   */
  public getCustomerCostSummary(): {
    totalCustomersTracked: number;
    aggregateSpendUsd: number;
    averageCostPerCustomerUsd: number;
  } {
    let aggregateSpend = 0;
    for (const record of this.usageMap.values()) {
      aggregateSpend += record.totalCostUsd;
    }
    const count = this.usageMap.size;
    return {
      totalCustomersTracked: count,
      aggregateSpendUsd: aggregateSpend,
      averageCostPerCustomerUsd: count > 0 ? aggregateSpend / count : 0
    };
  }
}

export const aiGovernance = AIGovernanceService.getInstance();
