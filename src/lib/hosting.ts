import type { LovinglyEvent, PlanTier, HostingStatus, HostingExtensionRecord } from '../types';

export interface PlanConfig {
  id: PlanTier;
  name: string;
  days: number;
  sites: number;
  price: number;
  description: string;
}

export const HOSTING_PLANS: Record<PlanTier, PlanConfig> = {
  free: {
    id: 'free',
    name: 'Free Starter',
    days: 15,
    sites: 1,
    price: 0,
    description: '1st page free with 15 days of live hosting (includes watermark)',
  },
  basic_49: {
    id: 'basic_49',
    name: 'Extra Basic Page',
    days: 30,
    sites: 1,
    price: 49,
    description: '30 days live hosting for 1 extra basic page (includes watermark)',
  },
  premium_99: {
    id: 'premium_99',
    name: 'Premium Page',
    days: 30,
    sites: 1,
    price: 99,
    description: '30 days live hosting with all pro features & Watermark-Free experience',
  },
  pro_499: {
    id: 'pro_499',
    name: 'Pro Creator Pack',
    days: 60,
    sites: 7,
    price: 499,
    description: '1 free page + 6 additional pages (7 total) with pro features & Watermark-Free experience',
  },
  single_49: {
    id: 'single_49',
    name: 'Extra Basic Page',
    days: 30,
    sites: 1,
    price: 49,
    description: '30 days live hosting for 1 extra basic page (includes watermark)',
  },
};

/**
 * Determines whether a page should display a platform watermark based on its plan tier.
 * Free Starter (free) and Extra Basic Page (basic_49, single_49) include watermarks.
 * Premium Page (premium_99) and Pro Creator Pack (pro_499) are Watermark-Free.
 */
export function hasWatermark(event: Partial<LovinglyEvent>): boolean {
  if (event.isLifetime) return false;
  if (event.planTier === 'premium_99' || event.planTier === 'pro_499') return false;
  if (event.tier === 'premium' || event.tier === 'standard') return false;
  return true;
}

export const EXTENSION_PRICING = {
  extend_30_days: {
    type: 'extension_30_days' as const,
    label: '+30 Days Hosting Extension',
    days: 30,
    price: 49,
    description: 'Add 30 extra days of live hosting to this page alone',
  },
  lifetime_single: {
    type: 'lifetime_single' as const,
    label: 'Life Long Hosting (Single Page)',
    days: Infinity,
    isLifetime: true,
    price: 299,
    description: 'Permanent lifetime hosting for this page alone, never expires',
  },
};

/**
 * Calculates initial hosting validity timestamps based on chosen plan tier
 */
export function calculateInitialHosting(
  planTier: PlanTier = 'free',
  startDate: Date = new Date()
): {
  planTier: PlanTier;
  hostingDurationDays: number;
  publishedAt: string;
  expiresAt: string;
  isLifetime: boolean;
} {
  const plan = HOSTING_PLANS[planTier] || HOSTING_PLANS.free;
  const days = plan.days;
  const publishedAt = startDate.toISOString();
  const expiryDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);

  return {
    planTier,
    hostingDurationDays: days,
    publishedAt,
    expiresAt: expiryDate.toISOString(),
    isLifetime: false,
  };
}

export interface HostingStatusResult {
  status: HostingStatus;
  daysRemaining: number;
  hoursRemaining: number;
  isExpired: boolean;
  isLifetime: boolean;
  expiresAtDate: Date | null;
  formattedExpiry: string;
  planLabel: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

/**
 * Computes live hosting status, days remaining, expiration check, and formatting
 */
export function getHostingStatus(event: LovinglyEvent, referenceDate: Date = new Date()): HostingStatusResult {
  // Lifetime check
  if (event.isLifetime) {
    return {
      status: 'lifetime',
      daysRemaining: Infinity,
      hoursRemaining: Infinity,
      isExpired: false,
      isLifetime: true,
      expiresAtDate: null,
      formattedExpiry: 'Permanent (Never Expires)',
      planLabel: 'Life Long Hosting',
      badgeBg: 'bg-teal-50 text-teal-800',
      badgeText: 'Lifetime Active',
      badgeBorder: 'border-teal-200',
    };
  }

  // Derive expiration date
  const expiresAtDate: Date = event.expiresAt
    ? new Date(event.expiresAt)
    : (() => {
        const baseDate = new Date(event.publishedAt || event.createdAt || Date.now());
        const duration = event.hostingDurationDays || (event.tier === 'standard' ? 30 : event.tier === 'premium' ? 60 : 15);
        return new Date(baseDate.getTime() + duration * 24 * 60 * 60 * 1000);
      })();

  const nowMs = referenceDate.getTime();
  const expiryMs = expiresAtDate.getTime();
  const diffMs = expiryMs - nowMs;

  const isExpired = diffMs <= 0;
  const daysRemaining = isExpired ? 0 : Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  const hoursRemaining = isExpired ? 0 : Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60)));

  let status: HostingStatus;
  let badgeBg: string;
  let badgeText: string;
  let badgeBorder: string;

  if (isExpired) {
    status = 'expired';
    badgeBg = 'bg-rose-100 text-rose-800';
    badgeText = 'Hosting Expired';
    badgeBorder = 'border-rose-300';
  } else if (daysRemaining <= 3) {
    status = 'expiring_soon';
    badgeBg = 'bg-amber-100 text-amber-800';
    badgeText = `${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} left`;
    badgeBorder = 'border-amber-300';
  } else {
    status = 'active';
    badgeBg = 'bg-emerald-50 text-emerald-800';
    badgeText = `${daysRemaining} days left`;
    badgeBorder = 'border-emerald-200';
  }

  const formattedExpiry = expiresAtDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const planLabel = event.planTier
    ? HOSTING_PLANS[event.planTier]?.name || 'Standard Hosting'
    : event.tier === 'premium'
    ? 'Pro Creator Pack (60 Days)'
    : event.tier === 'standard'
    ? 'Premium Page (30 Days)'
    : 'Free Starter (15 Days)';

  return {
    status,
    daysRemaining,
    hoursRemaining,
    isExpired,
    isLifetime: false,
    expiresAtDate,
    formattedExpiry,
    planLabel,
    badgeBg,
    badgeText,
    badgeBorder,
  };
}

/**
 * Applies an extension or upgrade to an event document in a fully composable way.
 * Handles:
 * - Adding +30 days on top of existing active date (stacking)
 * - Adding +30 days from now if already expired (reactivation)
 * - Upgrading to Life Long hosting (₹299)
 */
export function applyHostingExtension(
  event: LovinglyEvent,
  extensionType: 'extension_30_days' | 'lifetime_single',
  now: Date = new Date(),
  paymentReference?: string
): LovinglyEvent {
  const currentStatus = getHostingStatus(event, now);
  const extensionRecord: HostingExtensionRecord = {
    id: 'ext_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    type: extensionType,
    amountPaid: extensionType === 'extension_30_days' ? 49 : 299,
    extendedAt: now.toISOString(),
    previousExpiresAt: event.expiresAt || null,
    paymentReference: paymentReference || 'PAY_' + Date.now(),
  };

  if (extensionType === 'lifetime_single') {
    extensionRecord.newExpiresAt = null;
    return {
      ...event,
      isLifetime: true,
      expiresAt: null,
      hostingExtensions: [...(event.hostingExtensions || []), extensionRecord],
    };
  }

  // extension_30_days (+30 days)
  let baseDate: Date;
  if (!currentStatus.isExpired && currentStatus.expiresAtDate) {
    // Stack onto existing expiration date
    baseDate = currentStatus.expiresAtDate;
  } else {
    // Start 30 days fresh from now
    baseDate = now;
  }

  const newExpiryDate = new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  extensionRecord.newExpiresAt = newExpiryDate.toISOString();

  const newTotalDuration = (event.hostingDurationDays || 15) + 30;

  return {
    ...event,
    isLifetime: false,
    expiresAt: newExpiryDate.toISOString(),
    hostingDurationDays: newTotalDuration,
    hostingExtensions: [...(event.hostingExtensions || []), extensionRecord],
  };
}
