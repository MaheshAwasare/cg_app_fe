import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, ArrowRight, Library, Brain, Target, TrendingUp, History } from 'lucide-react';
import useStore from '../store';
import { formatDate } from '../utils/dateUtils';
import Header from './Header';
import ConceptPopup from './ConceptPopup';
import axios from 'axios';

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
  const [stats, setStats] = useState<UserStats | null>(null);
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [openConcepts, setOpenConcepts] = useState<OpenConcept[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) {
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
  }, [user?.username, isAuthenticated, navigate]);

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

  const handleBundlesClick = () => {
    navigate('/bundles');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-600 dark:bg-primary-800">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-600 dark:bg-primary-800">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.querySelector('input');
              if (input && input.value.trim()) {
                navigate('/dashboard', { state: { initialQuery: input.value.trim() } });
              }
            }} className="relative">
              <input
                type="text"
                placeholder="What concept would you like to learn?"
                className="w-full px-5 py-4 pr-12 text-lg rounded-full border border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-primary-900 dark:border-primary-700 dark:text-white transition-all shadow-lg"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-600 hover:text-primary-800 dark:text-primary-300 dark:hover:text-primary-200 transition-colors"
              >
                <Search size={24} />
              </button>
            </form>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-primary-900 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Brain className="text-primary-600 dark:text-primary-400" size={24} />
              <span className="text-xs text-primary-500 dark:text-primary-400">Total Concepts</span>
            </div>
            <h3 className="text-3xl font-bold text-primary-800 dark:text-white mb-1">
              {stats?.total_messages || 0}
            </h3>
            <p className="text-sm text-primary-600 dark:text-primary-400">
              Concepts learned
            </p>
          </div>

          <div className="bg-white dark:bg-primary-900 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Target className="text-primary-600 dark:text-primary-400" size={24} />
              <span className="text-xs text-primary-500 dark:text-primary-400">Learning Streak</span>
            </div>
            <h3 className="text-3xl font-bold text-primary-800 dark:text-white mb-1">
              7 days
            </h3>
            <p className="text-sm text-primary-600 dark:text-primary-400">
              Keep it up!
            </p>
          </div>

          <div className="bg-white dark:bg-primary-900 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="text-primary-600 dark:text-primary-400" size={24} />
              <span className="text-xs text-primary-500 dark:text-primary-400">Progress</span>
            </div>
            <h3 className="text-3xl font-bold text-primary-800 dark:text-white mb-1">
              {messages.length > 0 ? '85%' : '0%'}
            </h3>
            <p className="text-sm text-primary-600 dark:text-primary-400">
              Monthly goal
            </p>
          </div>
        </div>

        {/* Concept Bundles Quick Access */}
        <div className="bg-white dark:bg-primary-900 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-primary-800 dark:text-white">
                Concept Bundles
              </h2>
              <p className="text-sm text-primary-600 dark:text-primary-400">
                Explore concepts by subject
              </p>
            </div>
            <button
              onClick={handleBundlesClick}
              className="flex items-center px-4 py-2 bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-700 transition-colors"
            >
              <Library size={18} className="mr-2" />
              View All Bundles
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-primary-900 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-primary-800 dark:text-white">
                Recent Activity
              </h2>
              <p className="text-sm text-primary-600 dark:text-primary-400">
                Your latest learning sessions
              </p>
            </div>
            <button
              onClick={() => navigate('/history')}
              className="flex items-center text-primary-600 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-100"
            >
              <History size={18} className="mr-1" />
              View All
            </button>
          </div>

          <div className="space-y-4">
            {messages.slice(0, 5).map((message, index) => (
              <div
                key={index}
                onClick={() => handleConceptClick(message)}
                className="flex items-center justify-between p-4 bg-primary-50 dark:bg-primary-800/50 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-700 transition cursor-pointer"
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
                <ArrowRight size={20} className="text-primary-400" />
              </div>
            ))}

            {messages.length === 0 && (
              <div className="text-center py-8 text-primary-600 dark:text-primary-400">
                No learning activity yet. Start exploring concepts!
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