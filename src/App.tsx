import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ConceptViewer from './components/ConceptViewer';
import ConceptHistory from './components/ConceptHistory';
import EmptyState from './components/EmptyState';
import LoginPage from './components/LoginPage';
import PricingPage from './components/PricingPage';
import UpgradePage from './components/UpgradePage';
import PaymentPage from './components/PaymentPage';
import useStore from './store';
import EmptyState1 from './components/EmptyState1';

function App() {
  const { darkMode, currentConcept, isAuthenticated } = useStore();
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  
  return (
    <Router>
      <div className="min-h-screen bg-primary-600 dark:bg-primary-800 dark:text-white transition-colors">
        <Header />
        
        <Routes>
          <Route path="/" element={
            <main className="container mx-auto py-8 px-4">
              <div className="mb-8 mt-4">
                <SearchBar />
              </div>
              
              {currentConcept ? (
                <>
                  <ConceptViewer />
                  <ConceptHistory />
                </>
              ) : (
                <><EmptyState /></>
              )}
            </main>
          } />
          
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/upgrade" element={<UpgradePage />} />
          <Route path="/payment" element={<PaymentPage />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        <footer className="py-6 text-center text-sm text-white dark:text-primary-100 border-t border-primary-500 dark:border-primary-700">
          <p>© {new Date().getFullYear()} ConceptGood. Learn any concept in 2 minutes.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App