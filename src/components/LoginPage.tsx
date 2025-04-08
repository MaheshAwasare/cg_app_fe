import React, { useState, useEffect } from 'react';
import { BookOpen, User, Lock, LogIn, AlertCircle, Mail, Phone, UserPlus, ArrowLeft } from 'lucide-react';
import useStore from '../store';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  // Login state
  const [identifier, setIdentifier] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  // Registration state
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [regPin, setRegPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [regError, setRegError] = useState('');
  const [regIsLoading, setRegIsLoading] = useState(false);
  
  const { login, register, darkMode, toggleDarkMode, isAuthenticated } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Check if we should show registration form based on URL parameter
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('register') === 'true') {
      setIsRegistering(true);
    }
  }, [location]);

  useEffect(() => {
    // If user is already authenticated, redirect to appropriate page
    if (isAuthenticated) {
      const state = location.state as { redirectTo?: string; initialQuery?: string } | null;
      if (state?.redirectTo) {
        navigate(state.redirectTo, { state: { initialQuery: state.initialQuery } });
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, navigate, location]);
  
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (!identifier || !pin) {
      setLoginError('Please enter both username/email and PIN');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await login(identifier, pin);
      if (success) {
        const state = location.state as { redirectTo?: string; initialQuery?: string } | null;
        if (state?.redirectTo) {
          navigate(state.redirectTo, { state: { initialQuery: state.initialQuery } });
        } else {
          navigate('/dashboard');
        }
      } else {
        setLoginError('Invalid username/email or PIN');
      }
    } catch (error) {
      setLoginError('An error occurred during login');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    
    // Validate inputs
    if (!regUsername || !email || !mobile || !regPin || !confirmPin || !fullName) {
      setRegError('Please fill in all fields');
      return;
    }
    
    if (regPin !== confirmPin) {
      setRegError('PINs do not match');
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setRegError('Please enter a valid email address');
      return;
    }
    
    // Simple mobile validation (10 digits)
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
      setRegError('Please enter a valid 10-digit mobile number');
      return;
    }
    
    // PIN validation (4 digits)
    const pinRegex = /^\d{4}$/;
    if (!pinRegex.test(regPin)) {
      setRegError('PIN must be exactly 4 digits');
      return;
    }
    
    setRegIsLoading(true);
    
    try {
      const success = await register(regUsername, email, mobile, regPin, confirmPin, fullName);
      if (success) {
        // Reset form and show success message
        setRegUsername('');
        setEmail('');
        setMobile('');
        setRegPin('');
        setConfirmPin('');
        setFullName('');
        setRegistrationSuccess(true);
        
        // After 3 seconds, switch back to login
        setTimeout(() => {
          setRegistrationSuccess(false);
          setIsRegistering(false);
        }, 3000);
      } else {
        setRegError('Username already exists');
      }
    } catch (error) {
      setRegError('An error occurred during registration');
      console.error(error);
    } finally {
      setRegIsLoading(false);
    }
  };
  
  const switchToRegister = () => {
    setLoginError('');
    setIsRegistering(true);
    // Update URL without reloading the page
    navigate('/login?register=true', { replace: true });
  };
  
  const switchToLogin = () => {
    setRegError('');
    setIsRegistering(false);
    // Update URL without reloading the page
    navigate('/login', { replace: true });
  };

  const handleBackToHome = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-primary-600 dark:bg-primary-800 text-white transition-colors">
      <header className="w-full py-4 px-6 flex justify-between items-center border-b border-primary-500 dark:border-primary-700">
        <div className="flex items-center cursor-pointer" onClick={handleBackToHome}>
          <BookOpen className="text-white mr-2" size={28} />
          <h1 className="text-xl font-bold text-white">ConceptGood</h1>
        </div>
        
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-primary-500 hover:bg-primary-700 text-white transition-colors"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          )}
        </button>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-primary-900 shadow-lg rounded-lg p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 dark:bg-primary-700 rounded-full mb-4">
                <BookOpen className="text-white" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-primary-800 dark:text-white">
                {registrationSuccess 
                  ? 'Registration Successful!' 
                  : isRegistering 
                    ? 'Create an Account' 
                    : 'Welcome to ConceptGood'}
              </h2>
              <p className="text-gray-600 dark:text-primary-200 mt-2">
                {registrationSuccess 
                  ? 'Redirecting to login...' 
                  : 'Learn any concept in just 2 minutes'}
              </p>
            </div>
            
            {registrationSuccess ? (
              <div className="mb-6 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center text-green-700 dark:text-green-400 justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <span>Registration successful! You can now log in.</span>
              </div>
            ) : isRegistering ? (
              <>
                {regError && (
                  <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center text-red-700 dark:text-red-400">
                    <AlertCircle size={18} className="mr-2 flex-shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}
                
                <form onSubmit={handleRegisterSubmit}>
                  <div className="mb-4">
                    <label htmlFor="reg-username" className="block text-sm font-medium mb-1 text-primary-800 dark:text-primary-200">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className="text-primary-600" />
                      </div>
                      <input
                        id="reg-username"
                        type="text"
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-primary-300 dark:border-primary-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-primary-800 dark:text-white text-gray-800"
                        placeholder="Choose a username"
                        disabled={regIsLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="full-name" className="block text-sm font-medium mb-1 text-primary-800 dark:text-primary-200">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className="text-primary-600" />
                      </div>
                      <input
                        id="full-name"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-primary-300 dark:border-primary-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-primary-800 dark:text-white text-gray-800"
                        placeholder="Enter your full name"
                        disabled={regIsLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium mb-1 text-primary-800 dark:text-primary-200">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={18} className="text-primary-600" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-primary-300 dark:border-primary-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-primary-800 dark:text-white text-gray-800"
                        placeholder="Enter your email"
                        disabled={regIsLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="mobile" className="block text-sm font-medium mb-1 text-primary-800 dark:text-primary-200">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone size={18} className="text-primary-600" />
                      </div>
                      <input
                        id="mobile"
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-primary-300 dark:border-primary-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-primary-800 dark:text-white text-gray-800"
                        placeholder="Enter 10-digit mobile number"
                        disabled={regIsLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="reg-pin" className="block text-sm font-medium mb-1 text-primary-800 dark:text-primary-200">
                      PIN
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={18} className="text-primary-600" />
                      </div>
                      <input
                        id="reg-pin"
                        type="password"
                        maxLength={4}
                        value={regPin}
                        onChange={(e) => setRegPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                        className="w-full pl-10 pr-3 py-2 border border-primary-300 dark:border-primary-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-primary-800 dark:text-white text-gray-800"
                        placeholder="Enter 4-digit PIN"
                        disabled={regIsLoading}
                      />
                    </div>
                    <p className="text-xs text-primary-700 dark:text-primary-300 mt-1">
                      Please use a 4-digit PIN for security
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="confirm-pin" className="block text-sm font-medium mb-1 text-primary-800 dark:text-primary-200">
                      Confirm PIN
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={18} className="text-primary-600" />
                      </div>
                      <input
                        id="confirm-pin"
                        type="password"
                        maxLength={4}
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                        className="w-full pl-10 pr-3 py-2 border border-primary-300 dark:border-primary-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-primary-800 dark:text-white text-gray-800"
                        placeholder="Confirm your PIN"
                        disabled={regIsLoading}
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={regIsLoading}
                    className="w-full flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {regIsLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : (
                      <UserPlus size={18} className="mr-2" />
                    )}
                    {regIsLoading ? 'Registering...' : 'Register'}
                  </button>
                  
                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      onClick={switchToLogin}
                      className="text-primary-600 hover:text-primary-800 dark:text-primary-300 dark:hover:text-primary-200 flex items-center justify-center mx-auto"
                    >
                      <ArrowLeft size={16} className="mr-1" />
                      Back to Login
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                {loginError && (
                  <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center text-red-700 dark:text-red-400">
                    <AlertCircle size={18} className="mr-2 flex-shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}
                
                <form onSubmit={handleLoginSubmit}>
                  <div className="mb-4">
                    <label htmlFor="identifier" className="block text-sm font-medium mb-1 text-primary-800 dark:text-primary-200">
                      Username or Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className="text-primary-600" />
                      </div>
                      <input
                        id="identifier"
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-primary-300 dark:border-primary-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-primary-800 dark:text-white text-gray-800"
                        placeholder="Enter username or email"
                        disabled={isLoading}
                      />
                    </div>
                    <p className="text-xs text-primary-700 dark:text-primary-300 mt-1">
                      Demo credentials: "user" or "admin"
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="pin" className="block text-sm font-medium mb-1 text-primary-800 dark:text-primary-200">
                      PIN
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={18} className="text-primary-600" />
                      </div>
                      <input
                        id="pin"
                        type="password"
                        maxLength={4}
                        value={pin}
                        onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                        className="w-full pl-10 pr-3 py-2 border border-primary-300 dark:border-primary-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-primary-800 dark:text-white text-gray-800"
                        placeholder="Enter 4-digit PIN"
                        disabled={isLoading}
                      />
                    </div>
                    <p className="text-xs text-primary-700 dark:text-primary-300 mt-1">
                      Demo PINs: "1234" for user, "9999" for admin
                    </p>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : (
                      <LogIn size={18} className="mr-2" />
                    )}
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </button>
                  
                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      onClick={switchToRegister}
                      className="text-primary-600 hover:text-primary-800 dark:text-primary-300 dark:hover:text-primary-200"
                    >
                      Don't have an account? Register now
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
          
          <div className="mt-6 text-center text-sm text-white">
            <p>
              ConceptGood helps you understand complex concepts in just 2 minutes.
              <br />
              {isRegistering ? 'Join us today!' : 'Sign in to start learning!'}
            </p>
          </div>
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-white border-t border-primary-500 dark:border-primary-700">
        <p>© {new Date().getFullYear()} ConceptGood. Learn any concept in 2 minutes.</p>
      </footer>
    </div>
  );
};

export default LoginPage;