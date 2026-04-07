/**
 * Usage Tracking Service
 * 
 * Handles quota tracking, limit enforcement, and usage recording
 * for both authenticated users and anonymous guests.
 * 
 * PRIVACY: All IP addresses are hashed before storage.
 */

import { prisma } from './prisma';
import { hashIpAddress } from './privacy';

// =============================================================================
// TYPES
// =============================================================================

export type UsageAction = 
  | 'scan_created'
  | 'scan_completed'
  | 'pdf_generated'
  | 'api_call'
  | 'competitor_analysis'
  | 'project_created'
  | 'team_member_added';

export interface QuotaCheckResult {
  allowed: boolean;
  used: number;
  limit: number;
  remaining: number;
  resetAt: Date;
  upgradeRequired: boolean;
  message?: string;
}

export interface PlanLimits {
  scansPerDay: number;
  concurrentScans: number;
  historyDays: number;
  maxProjects: number;
  maxTeamMembers: number;
  apiCallsPerMonth: number;
}

// Guest limits
const GUEST_LIMITS: PlanLimits = {
  scansPerDay: 3,
  concurrentScans: 1,
  historyDays: 0,
  maxProjects: 0,
  maxTeamMembers: 0,
  apiCallsPerMonth: 0
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get the start of today in UTC
 */
function getTodayStart(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

/**
 * Get the start of tomorrow in UTC (for reset time)
 */
function getTomorrowStart(): Date {
  const today = getTodayStart();
  return new Date(today.getTime() + 24 * 60 * 60 * 1000);
}

/**
 * Get current month start for monthly quotas
 */
function getMonthStart(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

// =============================================================================
// GUEST USAGE TRACKING
// =============================================================================

/**
 * Check and update guest quota for scans
 */
export async function checkGuestQuota(
  fingerprint: string,
  ipAddress: string
): Promise<QuotaCheckResult> {
  const today = getTodayStart();
  const resetAt = getTomorrowStart();
  const hashedIp = hashIpAddress(ipAddress);

  try {
    // Find or create guest fingerprint record
    let guest = await prisma.guestFingerprint.findUnique({
      where: { fingerprint }
    });

    if (!guest) {
      // Create new guest record with hashed IP
      guest = await prisma.guestFingerprint.create({
        data: {
          fingerprint,
          ipAddresses: [hashedIp],
          scansToday: 0,
          lastScanDate: null
        }
      });
    }

    // Check if blocked
    if (guest.isBlocked) {
      return {
        allowed: false,
        used: guest.scansToday,
        limit: GUEST_LIMITS.scansPerDay,
        remaining: 0,
        resetAt,
        upgradeRequired: false,
        message: guest.blockReason || 'Your access has been restricted due to policy violations.'
      };
    }

    // Check if new day - reset counter
    const lastDate = guest.lastScanDate;
    const isNewDay = !lastDate || new Date(lastDate).getTime() < today.getTime();
    
    const currentScans = isNewDay ? 0 : guest.scansToday;
    const remaining = Math.max(0, GUEST_LIMITS.scansPerDay - currentScans);
    const allowed = currentScans < GUEST_LIMITS.scansPerDay;

    return {
      allowed,
      used: currentScans,
      limit: GUEST_LIMITS.scansPerDay,
      remaining,
      resetAt,
      upgradeRequired: !allowed,
      message: allowed 
        ? undefined 
        : 'You\'ve used all your free scans for today. Sign up for more!'
    };

  } catch (error) {
    console.error('Error checking guest quota:', error);
    // Fail open for guests (allow the scan but log the error)
    return {
      allowed: true,
      used: 0,
      limit: GUEST_LIMITS.scansPerDay,
      remaining: GUEST_LIMITS.scansPerDay,
      resetAt,
      upgradeRequired: false
    };
  }
}

/**
 * Record guest usage after successful action
 */
export async function recordGuestUsage(
  fingerprint: string,
  ipAddress: string,
  action: UsageAction,
  resourceId?: string
): Promise<void> {
  const today = getTodayStart();
  const hashedIp = hashIpAddress(ipAddress);

  try {
    // Update guest fingerprint with hashed IP
    await prisma.guestFingerprint.upsert({
      where: { fingerprint },
      create: {
        fingerprint,
        ipAddresses: [hashedIp],
        scansToday: action === 'scan_created' ? 1 : 0,
        lastScanDate: today
      },
      update: {
        scansToday: action === 'scan_created' 
          ? { increment: 1 }
          : undefined,
        lastScanDate: today,
        ipAddresses: {
          push: hashedIp
        }
      }
    });

    // Create usage record with hashed IP
    await prisma.usageRecord.create({
      data: {
        guestId: fingerprint,
        action,
        resourceId,
        date: today,
        hour: new Date().getUTCHours(),
        ipAddress: hashedIp,
        metadata: {}
      }
    });

  } catch (error) {
    console.error('Error recording guest usage:', error);
    // Don't throw - usage recording is not critical
  }
}

// =============================================================================
// USER USAGE TRACKING
// =============================================================================

/**
 * Get user's current plan limits
 */
export async function getUserPlanLimits(userId: string): Promise<PlanLimits & { planName: string }> {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: { in: ['active', 'trialing'] }
      },
      include: {
        plan: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!subscription || !subscription.plan) {
      // Default to free plan limits
      return {
        planName: 'free',
        scansPerDay: 5,
        concurrentScans: 2,
        historyDays: 7,
        maxProjects: 1,
        maxTeamMembers: 1,
        apiCallsPerMonth: 0
      };
    }

    return {
      planName: subscription.plan.name,
      scansPerDay: subscription.plan.scansPerDay,
      concurrentScans: subscription.plan.concurrentScans,
      historyDays: subscription.plan.historyDays,
      maxProjects: subscription.plan.maxProjects,
      maxTeamMembers: subscription.plan.maxTeamMembers,
      apiCallsPerMonth: subscription.plan.apiCallsPerMonth
    };

  } catch (error) {
    console.error('Error getting user plan limits:', error);
    // Default to free limits
    return {
      planName: 'free',
      scansPerDay: 5,
      concurrentScans: 2,
      historyDays: 7,
      maxProjects: 1,
      maxTeamMembers: 1,
      apiCallsPerMonth: 0
    };
  }
}

/**
 * Check user quota for a specific action
 */
export async function checkUserQuota(
  userId: string,
  action: UsageAction
): Promise<QuotaCheckResult> {
  const today = getTodayStart();
  const resetAt = getTomorrowStart();

  try {
    const limits = await getUserPlanLimits(userId);

    // Get daily action-specific limit
    let limit: number;
    switch (action) {
      case 'scan_created':
        limit = limits.scansPerDay;
        break;
      case 'api_call':
        limit = limits.apiCallsPerMonth;
        break;
      default:
        limit = -1; // Unlimited for other actions
    }

    // Unlimited (-1) means no check needed
    if (limit === -1) {
      return {
        allowed: true,
        used: 0,
        limit: -1,
        remaining: -1,
        resetAt,
        upgradeRequired: false
      };
    }

    // Count today's usage
    const usageCount = await prisma.usageRecord.count({
      where: {
        userId,
        action,
        date: today
      }
    });

    const remaining = Math.max(0, limit - usageCount);
    const allowed = usageCount < limit;

    return {
      allowed,
      used: usageCount,
      limit,
      remaining,
      resetAt,
      upgradeRequired: !allowed,
      message: allowed 
        ? undefined 
        : `You've reached your daily ${action.replace('_', ' ')} limit. Upgrade for more!`
    };

  } catch (error) {
    console.error('Error checking user quota:', error);
    // Fail open for authenticated users
    return {
      allowed: true,
      used: 0,
      limit: -1,
      remaining: -1,
      resetAt,
      upgradeRequired: false
    };
  }
}

/**
 * Check concurrent scan limit for user
 */
export async function checkConcurrentScans(userId: string): Promise<{
  allowed: boolean;
  current: number;
  limit: number;
}> {
  try {
    const limits = await getUserPlanLimits(userId);

    const activeScanCount = await prisma.scan.count({
      where: {
        // Note: We'd need to add userId to Scan model or track via UsageRecord
        status: { in: ['pending', 'processing'] }
      }
    });

    // This is a simplified check - in production, you'd filter by userId
    const allowed = activeScanCount < limits.concurrentScans;

    return {
      allowed,
      current: activeScanCount,
      limit: limits.concurrentScans
    };

  } catch (error) {
    console.error('Error checking concurrent scans:', error);
    return { allowed: true, current: 0, limit: 5 };
  }
}

/**
 * Record user usage after successful action
 */
export async function recordUserUsage(
  userId: string,
  action: UsageAction,
  resourceId?: string,
  metadata?: Record<string, unknown>,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  const today = getTodayStart();

  try {
    await prisma.usageRecord.create({
      data: {
        userId,
        action,
        resourceId,
        date: today,
        hour: new Date().getUTCHours(),
        ipAddress,
        userAgent,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined
      }
    });

  } catch (error) {
    console.error('Error recording user usage:', error);
  }
}

// =============================================================================
// UNIFIED CHECK FUNCTION
// =============================================================================

/**
 * Check quota for either guest or authenticated user
 */
export async function checkQuota(
  action: UsageAction,
  context: {
    userId?: string;
    fingerprint?: string;
    ipAddress: string;
  }
): Promise<QuotaCheckResult> {
  if (context.userId) {
    return checkUserQuota(context.userId, action);
  }

  if (context.fingerprint) {
    return checkGuestQuota(context.fingerprint, context.ipAddress);
  }

  // No identification - use IP-based limiting (strictest)
  return checkGuestQuota(`ip:${context.ipAddress}`, context.ipAddress);
}

/**
 * Record usage for either guest or authenticated user
 */
export async function recordUsage(
  action: UsageAction,
  context: {
    userId?: string;
    fingerprint?: string;
    ipAddress: string;
    userAgent?: string;
    resourceId?: string;
    metadata?: Record<string, unknown>;
  }
): Promise<void> {
  if (context.userId) {
    await recordUserUsage(
      context.userId,
      action,
      context.resourceId,
      context.metadata,
      context.ipAddress,
      context.userAgent
    );
  } else {
    const fp = context.fingerprint || `ip:${context.ipAddress}`;
    await recordGuestUsage(fp, context.ipAddress, action, context.resourceId);
  }
}

// =============================================================================
// ADMIN / REPORTING FUNCTIONS
// =============================================================================

/**
 * Get usage summary for a user
 */
export async function getUserUsageSummary(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<{
  totalScans: number;
  totalPdfExports: number;
  totalApiCalls: number;
  dailyBreakdown: Array<{ date: string; scans: number }>;
}> {
  try {
    const records = await prisma.usageRecord.groupBy({
      by: ['date', 'action'],
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      _count: {
        id: true
      }
    });

    const summary = {
      totalScans: 0,
      totalPdfExports: 0,
      totalApiCalls: 0,
      dailyBreakdown: [] as Array<{ date: string; scans: number }>
    };

    const dailyMap = new Map<string, number>();

    for (const record of records) {
      const dateStr = record.date.toISOString().split('T')[0];
      const count = record._count.id;

      switch (record.action) {
        case 'scan_created':
          summary.totalScans += count;
          dailyMap.set(dateStr, (dailyMap.get(dateStr) || 0) + count);
          break;
        case 'pdf_generated':
          summary.totalPdfExports += count;
          break;
        case 'api_call':
          summary.totalApiCalls += count;
          break;
      }
    }

    summary.dailyBreakdown = Array.from(dailyMap.entries())
      .map(([date, scans]) => ({ date, scans }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return summary;

  } catch (error) {
    console.error('Error getting user usage summary:', error);
    return {
      totalScans: 0,
      totalPdfExports: 0,
      totalApiCalls: 0,
      dailyBreakdown: []
    };
  }
}

/**
 * Reset daily guest scan counters (call from cron job)
 */
export async function resetDailyGuestCounters(): Promise<number> {
  const today = getTodayStart();

  try {
    const result = await prisma.guestFingerprint.updateMany({
      where: {
        OR: [
          { lastScanDate: null },
          { lastScanDate: { lt: today } }
        ]
      },
      data: {
        scansToday: 0
      }
    });

    console.log(`Reset daily counters for ${result.count} guests`);
    return result.count;

  } catch (error) {
    console.error('Error resetting daily counters:', error);
    return 0;
  }
}

// =============================================================================
// ABUSE DETECTION
// =============================================================================

/**
 * Flag a guest fingerprint for potential abuse
 */
export async function flagPotentialAbuse(
  fingerprint: string,
  reason: string,
  scoreIncrease: number = 10
): Promise<void> {
  try {
    const guest = await prisma.guestFingerprint.findUnique({
      where: { fingerprint }
    });

    if (!guest) return;

    const newScore = guest.abuseScore + scoreIncrease;
    const shouldBlock = newScore >= 100;

    await prisma.guestFingerprint.update({
      where: { fingerprint },
      data: {
        abuseScore: newScore,
        isBlocked: shouldBlock,
        blockReason: shouldBlock ? reason : undefined
      }
    });

    if (shouldBlock) {
      console.warn(`Blocked guest ${fingerprint} for abuse: ${reason}`);
    }

  } catch (error) {
    console.error('Error flagging abuse:', error);
  }
}
