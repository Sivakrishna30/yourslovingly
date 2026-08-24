import type { EntitlementTier } from './types';
import { PricingModel } from './types';

export class EntitlementService {
  /**
   * Determine the price of publishing a new invite.
   */
  static getPublishingPrice(targetTier: EntitlementTier): number {
    if (targetTier === 'basic') return PricingModel.BASIC_INVITE;
    if (targetTier === 'premium') return PricingModel.PREMIUM_INVITE;
    return 0; // free/draft
  }

  /**
   * Determine the price to upgrade an existing published invite from basic to premium.
   */
  static getUpgradePrice(currentTier: EntitlementTier, targetTier: EntitlementTier): number {
    if (currentTier === 'basic' && targetTier === 'premium') {
      return PricingModel.UPGRADE_BASIC_TO_PREMIUM;
    }
    return 0;
  }

  /**
   * Determine the price of a validity extension.
   */
  static getExtensionPrice(tier: EntitlementTier, isLifetime: boolean): number {
    if (isLifetime) return PricingModel.PREMIUM_LIFETIME;
    if (tier === 'basic') return PricingModel.BASIC_EXTENSION_30_DAYS;
    if (tier === 'premium') return PricingModel.PREMIUM_EXTENSION_30_DAYS;
    return 0;
  }

  /**
   * Defines capabilities based on the entitlement tier.
   */
  static getCapabilities(tier: EntitlementTier) {
    return {
      canRemoveWatermark: tier === 'premium',
      canAddMaps: tier === 'premium',
      canAddSpotify: true, // Both can add Spotify based on previous logic (unless spec restricted)
      canAddRSVP: tier === 'premium',
      canAddUPI: tier === 'premium',
      validityDays: tier === 'free' ? 0 : 15,
    };
  }
}
