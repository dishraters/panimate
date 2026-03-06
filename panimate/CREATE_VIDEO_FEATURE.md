# Panimate Create Video Feature - Implementation Plan

## Pricing Tiers

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | Voice → animated words appear on screen, 15sec, shareable link |
| Pro | $0.99 | Enhanced animations, transitions, 30sec, HD download |
| Premium | $10 | Manual animation review, custom edits, 60sec, 4K, priority |

## Files to Modify

### 1. `/src/app/page.tsx` - Update pricing section
- Change Free to $0
- Change Standard to $0.99  
- Change Premium to $10
- Add "Manual Review" badge to Premium

### 2. `/src/app/create/page.tsx` - Add upgrade flow
- Add tier selection before recording
- Show upgrade prompts after recording
- Integrate Stripe Checkout

### 3. Create `/src/app/api/checkout/route.ts` - Stripe checkout

## Stripe Setup Needed
- Stripe account
- Publishable key + Secret key
- Product IDs for each tier

## Implementation Steps
1. Update pricing UI on main page
2. Add tier selector to create flow
3. Create Stripe checkout endpoint
4. Add "processing" animation during generation
5. Handle webhooks for payment confirmation
