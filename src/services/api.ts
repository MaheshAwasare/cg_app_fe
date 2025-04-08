import { SubscriptionTier, SubscriptionPeriod, User } from '../types';
import useStore from '../store';

const API_BASE_URL = 'http://localhost:5000/api';
const API_TIMEOUT = 30000; // 30 seconds timeout

import axios from 'axios';

// Create axios instance with default config
const apiClient = axios.create({
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Token interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle unauthorized responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Clear auth state and redirect to login
      useStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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
    const response = await apiClient.post(`${API_BASE_URL}/confirm-payment`, {
      paymentIntentId,
      username,
      subscriptionPeriod
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try again.');
    }
    console.error('Error confirming payment:', error);
    throw error;
  }
};

export const getUserStatus = async (username: string): Promise<{ success: boolean; data?: User; message?: string }> => {
  try {
    const response = await apiClient.get(`/api/user/status?username=${username}`);
    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
      return { success: false, message: 'Request timed out. Please try again.' };
    }
    console.error('API error:', error);
    return { success: false, message: 'Network error' };
  }
};

export const loginUser = async (username: string, password: string): Promise<{ success: boolean; data?: User; token?: string; message?: string }> => {
  try {
    console.log("Login Starts for - ", username, password);
    const response = await apiClient.post(`${API_BASE_URL}/auth/login`, {
      username,
      password
    });

    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }

    return { 
      success: true, 
      data: response.data.user,
      token: response.data.token 
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        return { success: false, message: 'Login request timed out. Please try again.' };
      }
      if (error.response?.status === 401) {
        return { success: false, message: 'Invalid username or password' };
      }
    }
    console.error('Login error:', error);
    return { success: false, message: 'Login failed' };
  }
};

export const registerUser = async (username: string, email: string, mobile: string, pin: string, fullName: string): Promise<{ success: boolean; message?: string }> => {
  const confirm_pin = pin;
  console.log("Registration Starts for ", username, JSON.stringify({ username, email, mobile, pin, confirm_pin, fullName }));
  try {
    const response = await apiClient.post(`${API_BASE_URL}/auth/register`, {
      username,
      email,
      mobile,
      pin,
      confirm_pin,
      fullName
    });

    return { success: true };
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
      return { success: false, message: 'Registration request timed out. Please try again.' };
    }
    console.error('Registration error:', error);
    return { success: false, message: 'Registration failed. Please try again.' };
  }
};

export const subscribeUser = async (username: string, tier: SubscriptionTier, period: SubscriptionPeriod): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await apiClient.post(`${API_BASE_URL}/user/subscribe`, {
      username,
      tier,
      period
    });

    return { success: true };
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
      return { success: false, message: 'Subscription request timed out. Please try again.' };
    }
    console.error('Subscription error:', error);
    return { success: false, message: 'Subscription failed. Please try again.' };
  }
};