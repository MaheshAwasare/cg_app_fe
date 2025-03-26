import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Elements, 
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';
import { CreditCard, ArrowLeft, Shield, Calendar, Lock } from 'lucide-react';
import { STRIPE_CONFIG } from '../config/stripe';
import useStore from '../store';

const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

interface PaymentFormProps {
  amount: number;
  period: string;
  discount: number;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ amount, period, discount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const { user } = useStore();
  const navigate = useNavigate();
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setProcessing(true);
    setError(null);
    
    try {
      // Create payment intent
      const response = await fetch('http://localhost:8080/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          period,
          discount,
          username: user?.username
        }),
      });
      
      const { clientSecret } = await response.json();
      
      // Get card element
      const cardNumber = elements.getElement(CardNumberElement);
      if (!cardNumber) return;
      
      // Confirm payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumber,
          billing_details: {
            name: user?.name,
            email: user?.email
          },
        },
      });
      
      if (stripeError) {
        setError(stripeError.message || 'An error occurred');
      } else if (paymentIntent.status === 'succeeded') {
        // Payment successful, update subscription
        await fetch('http://localhost:8080/payment-success', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            username: user?.username,
            period,
            discount
          }),
        });
        
        // Redirect to success page
        navigate('/', { state: { paymentSuccess: true } });
      }
    } catch (err) {
      setError('An error occurred while processing your payment');
      console.error('Payment error:', err);
    } finally {
      setProcessing(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Card Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <CreditCard className="h-5 w-5 text-gray-400" />
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-4 py-3">
              <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Expiry Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-4 py-3">
                <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              CVC
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-4 py-3">
                <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-3 rounded-lg">
          {error}
        </div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full flex items-center justify-center px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition disabled:opacity-50"
      >
        {processing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5 mr-2" />
            Pay ₹{amount}
          </>
        )}
      </button>
    </form>
  );
};

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { amount, period, discount } = location.state || { amount: 0, period: 'month', discount: 0 };
  
  if (!amount) {
    navigate('/upgrade');
    return null;
  }
  
  return (
    <div className="min-h-screen bg-primary-600 dark:bg-primary-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-white mb-8 hover:text-primary-200 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>
        
        <div className="bg-white dark:bg-primary-900 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-primary-800 dark:text-white mb-6">
              Complete Your Payment
            </h2>
            
            <div className="bg-primary-50 dark:bg-primary-800/50 rounded-lg p-4 mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-primary-800 dark:text-white">Subscription:</span>
                <span className="text-primary-800 dark:text-white">Premium ({period}ly)</span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between mb-2">
                  <span className="text-primary-800 dark:text-white">Discount:</span>
                  <span className="text-green-600 dark:text-green-400">{discount}% off</span>
                </div>
              )}
              <div className="flex items-center justify-between text-lg font-bold">
                <span className="text-primary-800 dark:text-white">Total:</span>
                <span className="text-primary-800 dark:text-white">₹{amount}</span>
              </div>
            </div>
            
            <div className="mb-8">
              <Elements stripe={stripePromise}>
                <PaymentForm amount={amount} period={period} discount={discount} />
              </Elements>
            </div>
            
            <div className="flex items-center justify-center text-sm text-primary-600 dark:text-primary-400">
              <Shield size={16} className="mr-2" />
              Secure payment powered by Stripe
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;