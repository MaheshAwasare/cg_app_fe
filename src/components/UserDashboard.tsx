import React, { useState, useEffect } from 'react';
import { BarChart, Clock, Search, Calendar, ArrowUp, ArrowDown, AlertCircle, MessageCircle } from 'lucide-react';
import useStore from '../store';
import { formatDate } from '../utils/dateUtils';
import Header from './Header';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import ConceptPopup from './ConceptPopup';

interface UserStats {
  total_messages: number;
  last_message_date: string;
}

interface UserMessage {
  concept_name: string;
  ai_answer: string;
  created_date: string;
}

interface OpenConcept {
  query: string;
  content: string;
}

const API_BASE_URL = 'http://localhost:5000/api';

const UserDashboard: React.FC = () => {
  const { user, isAuthenticated } = useStore();
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [stats, setStats] = useState<UserStats | null>(null);
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [openConcepts, setOpenConcepts] = useState<OpenConcept[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated || !user || !user.username) {
      navigate('/login', { state: { redirectTo: '/user-dashboard' } });
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const headers = {
          'Authorization': `Bearer ${token}`
        };

        const [statsResponse, messagesResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/ai/user-stats/${user.username}`, { headers }),
          axios.get(`${API_BASE_URL}/ai/user-messages/${user.username}`, { headers })
        ]);

        if (!statsResponse.data || !messagesResponse.data) {
          throw new Error('Invalid response data');
        }

        setStats(statsResponse.data);
        setMessages(messagesResponse.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401 || err.response?.status === 404) {
            navigate('/login', { state: { redirectTo: '/user-dashboard' } });
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.username, location.pathname, isAuthenticated, navigate]);
  
  const getFilteredMessages = () => {
    const now = Date.now();
    const timeframes = {
      week: now - 7 * 24 * 60 * 60 * 1000,
      month: now - 30 * 24 * 60 * 60 * 1000,
      year: now - 365 * 24 * 60 * 60 * 1000
    };
    
    return messages.filter(message => 
      new Date(message.created_date).getTime() >= timeframes[timeframe]
    );
  };
  
  const getSortedMessages = () => {
    const filtered = getFilteredMessages();
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.created_date).getTime();
      const dateB = new Date(b.created_date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  };

  const handleConceptClick = (message: UserMessage) => {
    setOpenConcepts([...openConcepts, {
      query: message.concept_name,
      content: message.ai_answer
    }]);
  };
  
  const handleClosePopup = (index: number) => {
    const newOpenConcepts = [...openConcepts];
    newOpenConcepts.splice(index, 1);
    setOpenConcepts(newOpenConcepts);
  };
  
  const sortedMessages = getSortedMessages();

  if (!isAuthenticated || !user || !user.username) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-600 dark:bg-primary-800 dark:text-white transition-colors">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-primary-600 dark:bg-primary-800 dark:text-white transition-colors">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-primary-200">
            Welcome back, {user?.name}! Here's your learning activity overview.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500 rounded-lg flex items-center text-red-500">
            <AlertCircle className="mr-2" size={20} />
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-primary-900 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Search className="text-primary-600 dark:text-primary-400" size={24} />
              <span className="text-xs text-primary-500 dark:text-primary-400">All Time</span>
            </div>
            <h3 className="text-3xl font-bold text-primary-800 dark:text-white mb-1">
              {stats?.total_messages || 0}
            </h3>
            <p className="text-sm text-primary-600 dark:text-primary-400">
              Total Searches
            </p>
          </div>
          
          <div className="bg-white dark:bg-primary-900 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Clock className="text-primary-600 dark:text-primary-400" size={24} />
              <span className="text-xs text-primary-500 dark:text-primary-400">Last Activity</span>
            </div>
            <h3 className="text-xl font-bold text-primary-800 dark:text-white mb-1">
              {stats?.last_message_date ? formatDate(new Date(stats.last_message_date).getTime()) : 'Never'}
            </h3>
            <p className="text-sm text-primary-600 dark:text-primary-400">
              Last Search
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-primary-900 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-primary-800 dark:text-white">
              Search History
            </h2>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-primary-100 dark:bg-primary-800 rounded-lg p-1">
                {(['week', 'month', 'year'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeframe(t)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                      timeframe === t
                        ? 'bg-white dark:bg-primary-700 text-primary-800 dark:text-white shadow-sm'
                        : 'text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-white'
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                className="p-2 rounded-lg bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-white transition"
              >
                {sortOrder === 'desc' ? <ArrowDown size={20} /> : <ArrowUp size={20} />}
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {sortedMessages.map((message, index) => (
              <div
                key={index}
                onClick={() => handleConceptClick(message)}
                className="flex items-center justify-between p-4 bg-primary-50 dark:bg-primary-800/50 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-800 transition cursor-pointer"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-primary-800 dark:text-white mb-1">
                    {message.concept_name}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-primary-600 dark:text-primary-400">
                    <span className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {formatDate(new Date(message.created_date).getTime())}
                    </span>
                  </div>
                </div>
                <MessageCircle size={20} className="text-primary-400" />
              </div>
            ))}
            
            {sortedMessages.length === 0 && (
              <div className="text-center py-8 text-primary-600 dark:text-primary-400">
                No searches found for this timeframe
              </div>
            )}
          </div>
        </div>
      </div>

      {openConcepts.map((concept, index) => (
        <ConceptPopup
          key={index}
          query={concept.query}
          content={concept.content}
          onClose={() => handleClosePopup(index)}
        />
      ))}
    </div>
  );
};

export default UserDashboard;