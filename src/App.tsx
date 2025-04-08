import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ConceptViewer from './components/ConceptViewer';
import ConceptHistory from './components/ConceptHistory';
import EmptyState from './components/EmptyState';
import LoginPage from './components/LoginPage';
import PricingPage from './components/PricingPage';
import UpgradePage from './components/UpgradePage';
import PaymentPage from './components/PaymentPage';
import HomePage from './components/HomePage';
import UserDashboard from './components/UserDashboard';
import useStore from './store';

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    // Redirect to login page with the return url
    return <Navigate to="/login" state={{ redirectTo: location.pathname }} replace />;
  }

  return <>{children}</>;
};

// Dashboard component to handle the location state
const Dashboard = () => {
  const location = useLocation();
  const { searchConcept, currentConcept, isAuthenticated, isLoading, user } = useStore();
  const initialQuery = location.state?.initialQuery;
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const loadingMessages = [
   "Establishing a connection to the knowledge base...",
    "Warming up the AI...",
    "Consulting the ancient algorithms...",
    "Decoding the secrets of the universe...",
    "Assembling the knowledge...",
    
    "Summoning digital spirits...",
    "Calibrating neural networks...",
    "Almost there...",
    "Engaging hyperdrive...",
    "Almost there...",
    
    "Brewing data potions...",
    "Planting information seeds...",
    "Harvesting binary stars...",
    "Chasing elusive bits...",
    "Refactoring reality...",
    "Synchronizing quantum states...",
    "Aligning celestial databases...",
    "Compiling cosmic code...",
    "Generating intelligent particles...",
    "Downloading wisdom...",
    "Unleashing the data kraken...",
    "Forging digital chains...",
    "Weaving the web of knowledge...",
    "Distilling essential data...",
    "Initializing cognitive functions...",
    "Activating thought processors...",
    "Fine-tuning the matrix...",
    
    "Invoking the data oracle...",
    "Sharpening the virtual blades...",
    "Constructing the information bridge...",
    "Transmuting bytes into insights...",
    "Navigating the information superhighway...",
    "Booting up the brain...",
    "Crunching numbers with gusto...",
    "Polishing the digital mirror...",
    "Loading the cognitive map...",
    "Connecting to the data stream...",
    "Feeding the algorithm...",
    "Gathering intellectual fuel...",
    "Establishing a connection to the knowledge base...",
    "Initiating the data transfer...",
    "Preparing the cognitive engine...",
    "Retrieving data from the cloud...",
    "Analyzing the information flow...",
    "Building the digital foundation...",
    "Optimizing the processing pipeline...",
    "Loading the intellectual framework...",
    "Indexing the knowledge repository..."
  ];

  useEffect(() => {
    if (initialQuery && isAuthenticated) {
      searchConcept(initialQuery);
    }
  }, [initialQuery, isAuthenticated]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLoadingMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ redirectTo: '/dashboard', initialQuery }} replace />;
  }

  return (
    <>
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8 mt-4">
          <SearchBar />
        </div>
        
        {currentConcept ? (
          <>
            <ConceptViewer />
            <ConceptHistory />
          </>
        ) : isLoading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-primary-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg text-primary-200">{loadingMessages[loadingMessageIndex]}</p>
          </div>
        ) : (
          <EmptyState />
        )}
      </main>
    </>
  );
};

function App() {
  const { darkMode } = useStore();
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  return (
    <Router>
      <div className="min-h-screen bg-primary-600 dark:bg-primary-800 dark:text-white transition-colors">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user-dashboard" 
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/pricing" element={<PricingPage />} />
          <Route 
            path="/upgrade" 
            element={
              <ProtectedRoute>
                <UpgradePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payment" 
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;