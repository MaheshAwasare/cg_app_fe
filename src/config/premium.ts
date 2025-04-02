export const PREMIUM_TEMPLATES = ['one', 'two'] as const;

export const PRICING_PLANS = {
  month: {
    free: {
      name: 'Free',
      price: 0,
      period: 'month',
      features: [
        'Access to basic explanation styles',
        'Unlimited concept searches',
        'Dark mode support',
        'Save concept history'
      ]
    },
    premium: {
      name: 'Premium',
      price: 200,
      period: 'month',
      features: [
        'All Free features',
        'Access to all explanation styles',
        'Priority AI processing',
        'Ad-free experience',
        'Premium support'
      ]
    }
  },
  year: {
    free: {
      name: 'Free',
      price: 0,
      period: 'year',
      features: [
        'Access to basic explanation styles',
        'Unlimited concept searches',
        'Dark mode support',
        'Save concept history'
      ]
    },
    premium: {
      name: 'Premium',
      price: 2160, // 200 * 12 * 0.9 (10% discount)
      period: 'year',
      features: [
        'All Free features',
        'Access to all explanation styles',
        'Priority AI processing',
        'Ad-free experience',
        'Premium support'
      ]
    }
  }
};