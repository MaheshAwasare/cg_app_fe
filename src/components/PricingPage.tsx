import React, { useState, useEffect } from 'react';
import { Check, CreditCard } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import useStore from '../store';
import { PRICING_PLANS } from '../config/premium';
import { STRIPE_CONFIG } from '../config/stripe';
import { SubscriptionPeriod, SubscriptionTier } from '../types';
import { useNavigate } from 'react-router-dom';
import { confirmPayment } from '../services/api';

const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);

const PricingPage: React.FC = () => {
  const [period, setPeriod] = useState<SubscriptionPeriod>('month');
  const [isProcessing, setIsProcessing] = useState(false);
  const { user, subscribe } = useStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check for payment status in URL when returning from Stripe
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntentId = urlParams.get('payment_intent');
    const paymentStatus = urlParams.get('payment_status');
    
    if (paymentIntentId && paymentStatus === 'succeeded') {
      handlePaymentSuccess(paymentIntentId);
    }
  }, []);
  
  const handlePaymentSuccess = async (paymentIntentId: string) => {
    if (!user) return;
    
    try {
      await confirmPayment({
        paymentIntentId,
        username: user.username,
        subscriptionPeriod: period
      });
      
      await subscribe('premium', period);
      navigate('/');
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };
  
  const handleSubscribe = async (tier: SubscriptionTier) => {
    if (tier === 'free') {
      await subscribe(tier, period);
      navigate('/');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe not loaded');
      
      const priceId = STRIPE_CONFIG.prices[period].premium;
      
      // Create checkout session
      const response = await fetch('http://localhost:8080/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          username: user?.username,
          period
        }),
      });
      
      const session = await response.json();
      
      // Redirect to Stripe checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id
      });
      
      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const plans = PRICING_PLANS[period];
  const discount = period === 'year' ? 10 : 0;
  
  return (
    <div className="min-h-screen bg-primary-600 dark:bg-primary-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h1>
          <p className="text-primary-100 text-lg">
            Get access to premium features and enhance your learning experience
          </p>
          
          <div className="mt-8 inline-flex items-center bg-primary-700 dark:bg-primary-900 rounded-lg p-1">
            <button
              onClick={() => setPeriod('month')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                period === 'month'
                  ? 'bg-primary-500 text-white'
                  : 'text-primary-200 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setPeriod('year')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                period === 'year'
                  ? 'bg-primary-500 text-white'
                  : 'text-primary-200 hover:text-white'
              }`}
            >
              Yearly
              {discount > 0 && (
                <span className="ml-2 inline-block px-2 py-0.5 text-xs bg-green-500 text-white rounded-full">
                  Save {discount}%
                </span>
              )}
            </button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {Object.entries(plans).map(([tier, plan]) => (
            <div
              key={tier}
              className="bg-white dark:bg-primary-900 rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold text-primary-800 dark:text-white mb-4">
                  {plan.name}
                </h2>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-primary-800 dark:text-white">
                    ₹{plan.price}
                  </span>
                  <span className="text-primary-600 dark:text-primary-300 ml-2">
                    /{plan.period}
                  </span>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-primary-700 dark:text-primary-200">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleSubscribe(tier as SubscriptionTier)}
                  disabled={isProcessing || (user?.subscription?.tier === tier)}
                  className={`w-full flex items-center justify-center px-4 py-3 rounded-lg text-white font-medium transition ${
                    tier === 'premium'
                      ? 'bg-primary-600 hover:bg-primary-700'
                      : 'bg-primary-500 hover:bg-primary-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : user?.subscription?.tier === tier ? (
                    'Current Plan'
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      {tier === 'free' ? 'Start Free' : 'Upgrade Now'}
                    </>
                  )}
                </button>
              </div>
              
              {tier === 'premium' && (
                <div className="bg-primary-50 dark:bg-primary-800 px-8 py-4">
                  <p className="text-sm text-primary-600 dark:text-primary-300">
                    Premium features include access to all explanation styles, priority AI processing, and premium support.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-primary-100">
            Questions? Contact our support team at support@conceptgood.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;