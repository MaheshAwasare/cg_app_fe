import React, { useRef, useEffect, useState } from 'react';
import { Moon, Sun, Settings, LogOut, User as UserIcon, Layout, Crown, Home, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store';
import AIProviderSelector from './AIProviderSelector';
import PromptTemplateSelector from './PromptTemplateSelector';

const Header: React.FC = () => {
  const { darkMode, toggleDarkMode, difficulty, setDifficulty, clearCurrentConcept, user, logout } = useStore();
  const [showSettings, setShowSettings] = React.useState(false);
  const [showTemplates, setShowTemplates] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const navigate = useNavigate();
 
  const settingsRef = useRef<HTMLDivElement>(null);
  const templatesRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const contactInfoRef = useRef<HTMLDivElement>(null);
 
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
      if (templatesRef.current && !templatesRef.current.contains(event.target as Node)) {
        setShowTemplates(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (contactInfoRef.current && !contactInfoRef.current.contains(event.target as Node)) {
        setShowContactInfo(false);
      }
    }
   
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
 
  const handleUpgradeClick = () => {
    navigate('/upgrade');
  };
 
  const handleHomeClick = () => {
    navigate('/');
    clearCurrentConcept();
  };

  // Check if user has a free plan
  const isFreePlan = user?.plan === 'FREE';
  console.log("USER ", user);
  console.log("IS FREE PLAN ", isFreePlan)
  return (
    <header className="w-full py-4 px-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <div
        className="flex items-center cursor-pointer"
        onClick={handleHomeClick}
      >
        <img
          src="/cg_logo_2.jpeg"
          alt="ConceptGood Logo"
          className="h-12 w-auto mr-3"
        />
        <h1 className="text-2xl font-bold text-primary-600 dark:text-white">ConceptGood</h1>
      </div>
     
      <div className="flex items-center space-x-4">
        <button
          onClick={handleHomeClick}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-primary-600 dark:text-white flex items-center"
          aria-label="Home"
          title="Home"
        >
          <Home size={20} className="mr-1" />
          <span className="text-sm font-medium">Home</span>
        </button>

        <div ref={contactInfoRef} className="relative">
          <button
            onClick={() => {
              setShowContactInfo(!showContactInfo);
              setShowSettings(false);
              setShowTemplates(false);
              setShowUserMenu(false);
            }}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-primary-600 dark:text-white flex items-center"
            aria-label="Contact Us"
            title="Contact Us"
          >
            <Phone size={20} className="mr-1" />
            <span className="text-sm font-medium">Contact Us</span>
          </button>
          
          {showContactInfo && (
            <div className="absolute top-12 right-0 z-10 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Contact Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</p>
                  <a href="mailto:support@conceptgood.com" className="text-primary-600 dark:text-primary-400 text-sm hover:underline">
                    support@conceptgood.com
                  </a>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</p>
                  <a href="tel:+1-800-123-4567" className="text-primary-600 dark:text-primary-400 text-sm hover:underline">
                    +91 1234567899
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Only show upgrade button if user has a free plan */}
        {isFreePlan && (
          <button
            onClick={handleUpgradeClick}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all shadow-sm"
          >
            <Crown size={18} className="mr-2" />
            Upgrade to Pro
          </button>
        )}
       
        <div className="relative">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as any)}
            className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-1 pl-3 pr-8 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-400 text-gray-800 dark:text-white"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
       
       {/**  <div ref={templatesRef}>
          <button
            onClick={() => {
              setShowTemplates(!showTemplates);
              setShowSettings(false);
              setShowContactInfo(false);
            }}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-primary-600 dark:text-white"
            aria-label="Template Settings"
            title="Select Explanation Style"
          >
            <Layout size={20} />
          </button>
         
          {showTemplates && (
            <div className="absolute top-16 right-6 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <PromptTemplateSelector onClose={() => setShowTemplates(false)} />
            </div>
          )}
        </div>
      
        <div ref={settingsRef}>
          <button
            onClick={() => {
              setShowSettings(!showSettings);
              setShowTemplates(false);
              setShowContactInfo(false);
            }}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-primary-600 dark:text-white"
            aria-label="AI Provider Settings"
            title="Select AI Provider"
          >
            <Settings size={20} />
          </button>
         
          {showSettings && (
            <div className="absolute top-16 right-6 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <AIProviderSelector onClose={() => setShowSettings(false)} />
            </div>
          )}
        </div>
         */}
       
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-primary-600 dark:text-white"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
       
        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowContactInfo(false);
            }}
            className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="User menu"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-600"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <UserIcon size={16} className="text-gray-600 dark:text-white" />
              </div>
            )}
          </button>
         
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <p className="font-medium text-gray-800 dark:text-white">{user?.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">@{user?.username}</p>
              </div>
              <div className="p-2">
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-left text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;