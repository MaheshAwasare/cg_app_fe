import React, { useRef, useEffect, useState } from 'react';
import { Moon, Sun, LogOut, User as UserIcon, Crown, Home, Phone, BarChart, Book, Library, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store';

const Header: React.FC = () => {
  const { darkMode, toggleDarkMode, user, logout } = useStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const navigate = useNavigate();
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const contactInfoRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
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
  };

  const handleDashboardClick = () => {
    navigate('/user-dashboard');
  };

  const handleSubjectsClick = () => {
    navigate('/subjects');
  };

  const handleBundlesClick = () => {
    navigate('/bundles');
  };

  // Check if user has a free plan
  const isFreePlan = user?.plan === 'FREE';
  
  const menuItems = [
    {
      label: 'Home',
      icon: Home,
      onClick: handleHomeClick,
      isActive: location.pathname === '/'
    },
    {
      label: 'Dashboard',
      icon: BarChart,
      onClick: handleDashboardClick,
      isActive: location.pathname === '/user-dashboard'
    },
    {
      label: 'Subjects',
      icon: Book,
      onClick: handleSubjectsClick,
      isActive: location.pathname === '/subjects'
    },
    {
      label: 'Bundles',
      icon: Library,
      onClick: handleBundlesClick,
      isActive: location.pathname === '/bundles'
    }
  ];
  
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-lg backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={handleHomeClick}
          >
            <img
              src="/cg_logo_2.jpeg"
              alt="ConceptGood Logo"
              className="h-10 w-auto rounded-lg"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              ConceptGood
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={item.onClick}
                className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2
                  ${item.isActive 
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-300' 
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Right section */}
          <div className="flex items-center space-x-3">
            {/* Contact Info */}
            <div ref={contactInfoRef} className="relative">
              <button
                onClick={() => setShowContactInfo(!showContactInfo)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
              >
                <Phone size={20} />
              </button>
              
              {showContactInfo && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</p>
                      <a 
                        href="mailto:support@conceptgood.com" 
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                      >
                        support@conceptgood.com
                      </a>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone</p>
                      <a 
                        href="tel:+911234567899" 
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                      >
                        +91 1234567899
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Upgrade Button */}
            {isFreePlan && (
              <button
                onClick={handleUpgradeClick}
                className="hidden sm:flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Crown size={18} className="mr-2" />
                Upgrade to Pro
              </button>
            )}

            {/* User Menu */}
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-primary-200 dark:border-primary-700"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center">
                    <UserIcon size={16} className="text-primary-600 dark:text-primary-300" />
                  </div>
                )}
                <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="font-medium text-gray-800 dark:text-white">{user?.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">@{user?.username}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center px-3 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;