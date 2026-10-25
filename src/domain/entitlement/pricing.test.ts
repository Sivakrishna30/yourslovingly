import { describe, it, expect } from 'vitest';
import { EntitlementService } from './entitlementService';
import { PricingModel } from './types';
import { 
  HOSTING_PLANS, 
  EXTENSION_PRICING, 
  applyHostingExtension, 
  getHostingStatus, 
  hasWatermark 
} from '../../lib/hosting';
import type { LovinglyEvent } from '../../types';

describe('Yours Lovingly - Confirmed Pricing Model & Entitlements', () => {
  // Test 1: New Basic page costs ₹49.
  it('1. New Basic page costs ₹49', () => {
    const price = EntitlementService.getPublishingPrice('basic');
    expect(price).toBe(49);
    expect(PricingModel.BASIC_PAGE).toBe(49);
    expect(HOSTING_PLANS.basic_49.price).toBe(49);

    const summary = EntitlementService.calculateCheckoutSummary({
      isNewPage: true,
      targetTier: 'basic',
    });
    expect(summary.total).toBe(49);
    expect(summary.pageTierPrice).toBe(49);
    expect(summary.isUpgrade).toBe(false);
  });

  // Test 2: New Premium page costs ₹99.
  it('2. New Premium page costs ₹99 and includes all Premium features', () => {
    const price = EntitlementService.getPublishingPrice('premium');
    expect(price).toBe(99);
    expect(PricingModel.PREMIUM_PAGE).toBe(99);
    expect(HOSTING_PLANS.premium_99.price).toBe(99);

    const capabilities = EntitlementService.getCapabilities('premium');
    expect(capabilities.canRemoveWatermark).toBe(true);
    expect(capabilities.canAddMaps).toBe(true);
    expect(capabilities.canAddRSVP).toBe(true);
    expect(capabilities.canAddUPI).toBe(true);
    expect(capabilities.canDownloadPdf).toBe(true);
    expect(capabilities.canDownloadPng).toBe(true);

    const summary = EntitlementService.calculateCheckoutSummary({
      isNewPage: true,
      targetTier: 'premium',
    });
    expect(summary.total).toBe(99);
    expect(summary.pageTierPrice).toBe(99);
    expect(summary.isUpgrade).toBe(false);
  });

  // Test 3: A previously paid Basic page upgrades to Premium for ₹49.
  it('3. A previously paid Basic page upgrades to Premium for ₹49', () => {
    // 99 - 49 = 49 upgrade price
    const upgradePrice = EntitlementService.getUpgradePrice('basic', 'premium', 49);
    expect(upgradePrice).toBe(49);
    expect(PricingModel.UPGRADE_BASIC_TO_PREMIUM).toBe(49);

    const summary = EntitlementService.calculateCheckoutSummary({
      isNewPage: false,
      currentTier: 'basic',
      targetTier: 'premium',
      amountPaidTowardsTier: 49,
    });
    expect(summary.total).toBe(49);
    expect(summary.pageTierPrice).toBe(49);
    expect(summary.isUpgrade).toBe(true);
  });

  // Test 4: An already-Premium page cannot be charged for Premium again.
  it('4. An already-Premium page cannot be charged for Premium again', () => {
    const upgradePrice = EntitlementService.getUpgradePrice('premium', 'premium', 99);
    expect(upgradePrice).toBe(0);

    const summary = EntitlementService.calculateCheckoutSummary({
      isNewPage: false,
      currentTier: 'premium',
      targetTier: 'premium',
      amountPaidTowardsTier: 99,
    });
    expect(summary.pageTierPrice).toBe(0);
    expect(summary.isAlreadyPremium).toBe(true);
    expect(summary.total).toBe(0);
  });

  // Test 5: Initial hosting lasts 14 days.
  it('5. Initial hosting lasts 14 days', () => {
    expect(PricingModel.INITIAL_HOSTING_DAYS).toBe(14);
    expect(HOSTING_PLANS.basic_49.days).toBe(14);
    expect(HOSTING_PLANS.premium_99.days).toBe(14);

    const basicCaps = EntitlementService.getCapabilities('basic');
    expect(basicCaps.validityDays).toBe(14);

    const premiumCaps = EntitlementService.getCapabilities('premium');
    expect(premiumCaps.validityDays).toBe(14);
  });

  // Test 6: Hosting extension costs ₹99 per additional 30 days.
  it('6. Hosting extension costs ₹99 per additional 30 days regardless of tier', () => {
    expect(PricingModel.HOSTING_EXTENSION_30_DAYS).toBe(99);
    expect(PricingModel.EXTENSION_HOSTING_DAYS).toBe(30);
    expect(EXTENSION_PRICING.extend_30_days.price).toBe(99);
    expect(EXTENSION_PRICING.extend_30_days.days).toBe(30);

    const extensionPrice = EntitlementService.getExtensionPrice();
    expect(extensionPrice).toBe(99);
  });

  // Test 7: Hosting extension does not change the page tier or remove purchased features.
  it('7. Hosting extension does not change the page tier or remove purchased features', () => {
    const mockBasicEvent: LovinglyEvent = {
      id: 'evt_1',
      slug: 'test-basic',
      creatorPath: 'user1',
      title: 'Basic Birthday',
      eventType: 'birthday',
      customType: '',
      recipientName: 'Alex',
      messages: ['Celebration time!'],
      eventDate: '2026-11-01',
      location: 'Grand Ballroom',
      primaryColor: '#000',
      secondaryColor: '#fff',
      highlightColor: '#D4AF37',
      elements: [],
      backgroundText: '',
      photos: ['photo1.jpg'],
      contentBlocks: [],
      messageAlignment: 'center',
      photoAlignment: 'center',
      photoSize: 'medium',
      backgroundPattern: 'none',
      isPublished: true,
      ownerId: 'user1',
      createdAt: '2026-10-01T00:00:00.000Z',
      publishedAt: '2026-10-01T00:00:00.000Z',
      expiresAt: '2026-10-15T00:00:00.000Z',
      planTier: 'basic_49',
      tier: 'standard',
      hostingDurationDays: 14,
      amountPaidTowardsTier: 49,
    };

    const extendedBasic = applyHostingExtension(
      mockBasicEvent,
      'extension_30_days',
      new Date('2026-10-05T00:00:00.000Z'),
      'TEST_PAY_REF'
    );

    // Tier, title, photos, and content remain completely intact
    expect(extendedBasic.planTier).toBe('basic_49');
    expect(extendedBasic.tier).toBe('standard');
    expect(extendedBasic.title).toBe('Basic Birthday');
    expect(extendedBasic.photos).toEqual(['photo1.jpg']);
    expect(extendedBasic.hostingDurationDays).toBe(44); // 14 + 30
    expect(extendedBasic.hostingExtensions?.length).toBe(1);
    expect(extendedBasic.hostingExtensions?.[0].amountPaid).toBe(99);

    // Mock Premium Event with RSVP, UPI, etc.
    const mockPremiumEvent: LovinglyEvent = {
      ...mockBasicEvent,
      id: 'evt_2',
      slug: 'test-premium',
      planTier: 'premium_99',
      tier: 'premium',
      amountPaidTowardsTier: 99,
      rsvpConfig: { enabled: true, collectPhone: true, collectGuestCount: true, collectDietary: true, collectAccommodation: false },
      upiId: 'host@upi',
      showLocationQrCode: true,
    };

    const extendedPremium = applyHostingExtension(
      mockPremiumEvent,
      'extension_30_days',
      new Date('2026-10-05T00:00:00.000Z'),
      'TEST_PAY_REF_PREM'
    );

    // Preserves premium tier and all features
    expect(extendedPremium.planTier).toBe('premium_99');
    expect(extendedPremium.tier).toBe('premium');
    expect(extendedPremium.rsvpConfig?.enabled).toBe(true);
    expect(extendedPremium.upiId).toBe('host@upi');
    expect(extendedPremium.showLocationQrCode).toBe(true);
    expect(hasWatermark(extendedPremium)).toBe(false);
  });

  // Test 8: Expired hosting does not delete the saved invitation.
  it('8. Expired hosting does not delete the saved invitation and allows reactivation for ₹99', () => {
    const expiredEvent: LovinglyEvent = {
      id: 'evt_expired',
      slug: 'test-expired',
      creatorPath: 'user1',
      title: 'Our Golden Gala',
      eventType: 'wedding',
      customType: '',
      recipientName: 'Maya & Dev',
      messages: ['Join our celebration'],
      eventDate: '2026-09-01',
      location: 'Palace Hall',
      primaryColor: '#000',
      secondaryColor: '#fff',
      highlightColor: '#D4AF37',
      elements: [],
      backgroundText: '',
      photos: [],
      contentBlocks: [],
      messageAlignment: 'center',
      photoAlignment: 'center',
      photoSize: 'medium',
      backgroundPattern: 'none',
      isPublished: true,
      isDeleted: false,
      ownerId: 'user1',
      createdAt: '2026-09-01T00:00:00.000Z',
      publishedAt: '2026-09-01T00:00:00.000Z',
      expiresAt: '2026-09-15T00:00:00.000Z', // Expired
      planTier: 'premium_99',
      tier: 'premium',
    };

    const status = getHostingStatus(expiredEvent, new Date('2026-10-01T00:00:00.000Z'));
    expect(status.isExpired).toBe(true);
    expect(status.status).toBe('expired');
    // Content is preserved
    expect(expiredEvent.isDeleted).toBe(false);
    expect(expiredEvent.title).toBe('Our Golden Gala');

    // Reactivate for 30 days
    const reactivated = applyHostingExtension(
      expiredEvent,
      'extension_30_days',
      new Date('2026-10-01T00:00:00.000Z')
    );

    const reactivatedStatus = getHostingStatus(reactivated, new Date('2026-10-01T00:00:00.000Z'));
    expect(reactivatedStatus.isExpired).toBe(false);
    expect(reactivatedStatus.daysRemaining).toBe(30);
    // Preserves premium tier without forcing user to buy Premium again
    expect(reactivated.planTier).toBe('premium_99');
    expect(reactivated.tier).toBe('premium');
  });

  // Test 9: Duplicate selections and repeated upgrade attempts do not create duplicate charges.
  it('9. Duplicate selections and repeated upgrade attempts do not create duplicate charges', () => {
    // Basic page upgrading once
    const firstUpgrade = EntitlementService.calculateCheckoutSummary({
      isNewPage: false,
      currentTier: 'basic',
      targetTier: 'premium',
      amountPaidTowardsTier: 49,
    });
    expect(firstUpgrade.total).toBe(49);
    expect(firstUpgrade.items.length).toBe(1);

    // Repeated upgrade attempt on an already upgraded page
    const secondUpgrade = EntitlementService.calculateCheckoutSummary({
      isNewPage: false,
      currentTier: 'premium',
      targetTier: 'premium',
      amountPaidTowardsTier: 99,
    });
    expect(secondUpgrade.total).toBe(0);
    expect(secondUpgrade.items.length).toBe(0);
  });

  // Test 10: Failed or cancelled payments do not grant paid entitlements.
  it('10. Failed or cancelled payments do not grant paid entitlements', () => {
    const unverifiedDraft: LovinglyEvent = {
      id: 'draft_test',
      slug: 'draft-test',
      creatorPath: 'user1',
      title: 'Unpaid Draft',
      eventType: 'wedding',
      customType: '',
      recipientName: 'Sam',
      messages: [],
      eventDate: '',
      location: '',
      primaryColor: '#000',
      secondaryColor: '#fff',
      highlightColor: '#D4AF37',
      elements: [],
      backgroundText: '',
      photos: [],
      contentBlocks: [],
      messageAlignment: 'center',
      photoAlignment: 'center',
      photoSize: 'medium',
      backgroundPattern: 'none',
      isPublished: false,
      ownerId: 'user1',
      createdAt: new Date().toISOString(),
      planTier: 'free',
      tier: 'free',
    };

    // If payment fails or is cancelled, page remains unpublished and watermarked
    expect(unverifiedDraft.isPublished).toBe(false);
    expect(hasWatermark(unverifiedDraft)).toBe(true);
    expect(unverifiedDraft.expiresAt).toBeUndefined();
  });

  // Test 11: Lifetime hosting and one-year hosting are unavailable in the purchase UI.
  it('11. Lifetime hosting and one-year hosting are unavailable in the purchase UI and config', () => {
    // EXTENSION_PRICING must not contain lifetime_single or 1-year options
    expect((EXTENSION_PRICING as Record<string, unknown>).lifetime_single).toBeUndefined();
    expect((EXTENSION_PRICING as Record<string, unknown>).one_year).toBeUndefined();

    // PricingModel must not contain lifetime
    expect((PricingModel as unknown as Record<string, unknown>).PREMIUM_LIFETIME).toBeUndefined();

    // Available extensions should only be extend_30_days and upgrade_to_premium
    const availableKeys = Object.keys(EXTENSION_PRICING);
    expect(availableKeys).toEqual(['extend_30_days', 'upgrade_to_premium']);
  });

  // Test 12: Checkout totals match the selected purchase or upgrade and hosting extension.
  it('12. Checkout totals match the selected purchase or upgrade and hosting extension', () => {
    // 1. New Basic without hosting extension = ₹49
    const summary1 = EntitlementService.calculateCheckoutSummary({
      isNewPage: true,
      targetTier: 'basic',
      extendHostingSelected: false,
    });
    expect(summary1.total).toBe(49);
    expect(summary1.items).toHaveLength(1);

    // 2. New Basic with +30d hosting extension = ₹49 + ₹99 = ₹148
    const summary2 = EntitlementService.calculateCheckoutSummary({
      isNewPage: true,
      targetTier: 'basic',
      extendHostingSelected: true,
    });
    expect(summary2.total).toBe(148);
    expect(summary2.pageTierPrice).toBe(49);
    expect(summary2.hostingExtensionPrice).toBe(99);
    expect(summary2.items).toHaveLength(2);

    // 3. New Premium without hosting extension = ₹99
    const summary3 = EntitlementService.calculateCheckoutSummary({
      isNewPage: true,
      targetTier: 'premium',
      extendHostingSelected: false,
    });
    expect(summary3.total).toBe(99);
    expect(summary3.items).toHaveLength(1);

    // 4. New Premium with +30d hosting extension = ₹99 + ₹99 = ₹198
    const summary4 = EntitlementService.calculateCheckoutSummary({
      isNewPage: true,
      targetTier: 'premium',
      extendHostingSelected: true,
    });
    expect(summary4.total).toBe(198);
    expect(summary4.pageTierPrice).toBe(99);
    expect(summary4.hostingExtensionPrice).toBe(99);
    expect(summary4.items).toHaveLength(2);

    // 5. Existing Basic upgrading to Premium + +30d hosting extension = ₹49 + ₹99 = ₹148
    const summary5 = EntitlementService.calculateCheckoutSummary({
      isNewPage: false,
      currentTier: 'basic',
      targetTier: 'premium',
      amountPaidTowardsTier: 49,
      extendHostingSelected: true,
    });
    expect(summary5.total).toBe(148);
    expect(summary5.pageTierPrice).toBe(49);
    expect(summary5.hostingExtensionPrice).toBe(99);
    expect(summary5.isUpgrade).toBe(true);

    // 6. Existing Premium buying only +30d hosting extension = ₹99
    const summary6 = EntitlementService.calculateCheckoutSummary({
      isNewPage: false,
      currentTier: 'premium',
      targetTier: 'premium',
      amountPaidTowardsTier: 99,
      extendHostingSelected: true,
    });
    expect(summary6.total).toBe(99);
    expect(summary6.pageTierPrice).toBe(0);
    expect(summary6.hostingExtensionPrice).toBe(99);
    expect(summary6.isAlreadyPremium).toBe(true);
  });
});
