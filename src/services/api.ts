import { SubscriptionTier, SubscriptionPeriod, User } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

import axios from 'axios';

export const confirmPayment = async ({
  paymentIntentId,
  username,
  subscriptionPeriod
}: {
  paymentIntentId: string;
  username: string;
  subscriptionPeriod: SubscriptionPeriod;
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/confirm-payment`, {
      paymentIntentId,
      username,
      subscriptionPeriod
    });

    return response.data;
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
};

export const getUserStatus = async (username: string): Promise<{ success: boolean; data?: User; message?: string }> => {
  try {
    const response = await fetch(`/api/user/status?username=${username}`);
    const data = await response.json();

    if (response.ok && data && typeof data === 'object') {
      return { success: true, data };
    } else {
      return { success: false, message: data.message || 'Failed to fetch user status' };
    }
  } catch (error) {
    console.error('API error:', error);
    return { success: false, message: 'Network error' };
  }
};

export const loginUser = async (username: string, password: string): Promise<{ success: boolean; data?: User; message?: string }> => {
  try {
    console.log("Login Starts for - ", username, password)
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      return { success: false, message: 'Invalid username or password' };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Login failed' };
  }
};

export const registerUser = async (username: string, email: string, mobile: string, pin: string,fullName:string): Promise<{ success: boolean; message?: string }> => {
  const confirm_pin =pin;
  console.log("Registration Starts for ", username, JSON.stringify({ username, email, mobile, pin, confirm_pin,fullName}))
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, mobile, pin, confirm_pin,fullName}),
    });

    if (!response.ok) {
      return { success: false, message: 'Registration failed' };
    }

    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'An error occurred' };
  }
};

export const subscribeUser = async (username: string, tier: SubscriptionTier, period: SubscriptionPeriod): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, tier, period }),
    });

    if (!response.ok) {
      return { success: false, message: 'Subscription failed' };
    }

    return { success: true };
  } catch (error) {
    console.error('Subscription error:', error);
    return { success: false, message: 'An error occurred' };
  }
};
