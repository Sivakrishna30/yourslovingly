/**
 * Approved Entitlement Tiers
 * - basic: ₹49 (watermarked, 15 days)
 * - premium: ₹99 (no watermark, maps, rsvp, 15 days)
 * - free: Draft mode only
 */
export type EntitlementTier = 'free' | 'basic' | 'premium';

/**
 * Approved Pricing Model
 */
export const PricingModel = {
  BASIC_INVITE: 49,
  PREMIUM_INVITE: 99,
  BASIC_EXTENSION_30_DAYS: 49,
  PREMIUM_EXTENSION_30_DAYS: 99,
  PREMIUM_LIFETIME: 999,
  UPGRADE_BASIC_TO_PREMIUM: 49,
} as const;
