// Stripe configuration
export const STRIPE_CONFIG = {
    publishableKey: 'pk_test_dummy_key',
    prices: {
      month: {
        premium: 'price_monthly_dummy_key'
      },
      year: {
        premium: 'price_yearly_dummy_key'
      }
    }
  };
  
  // API endpoints
  export const API_ENDPOINTS = {
    paymentConfirmation: 'http://localhost:8080/paymentconfirmation',
    userStatus: (username: string) => `http://localhost:8080/users/user`
  };