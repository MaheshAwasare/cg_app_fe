import { create } from 'zustand';
import { AppState, Concept, AIProvider, User, PromptTemplate, SubscriptionTier, SubscriptionPeriod } from './types';
import { getAIResponse } from './services/aiProviders';
import { PREMIUM_TEMPLATES } from './config/premium';
import { getUserStatus, loginUser, registerUser, subscribeUser } from './services/api';

const useStore = create<AppState>((set, get) => ({
  concepts: [],
  currentConcept: null,
  isLoading: false,
  error: null,
  darkMode: false,
  difficulty: 'beginner',
  aiProvider: 'local-ollama',
  promptTemplate: 'default',
  user: null,
  isAuthenticated: false,

  isPremiumTemplate: (template: PromptTemplate) => PREMIUM_TEMPLATES.includes(template as any),

  checkUserStatus: async (username: string) => {
    try {
      const response = await getUserStatus(username);
  
      if (response && typeof response === 'object' && 'success' in response) {
        if (response.success && response.data) {
          set({ user: response.data });
        }
        return response;
      } else {
        console.error('Invalid API response format:', response);
        return { success: false, message: 'Invalid response format' };
      }
    } catch (error) {
      console.error('Error checking user status:', error);
      return { success: false, message: 'Network error' };
    }
  },
  
  subscribe: async (tier: SubscriptionTier, period: SubscriptionPeriod) => {
    const { user } = get();
    if (!user) return false;
  
    try {
      const response = await get().checkUserStatus(user.username);
  
      if (response && response.success && response.data) {
        set({ user: response.data });
        return true;
      } else {
        console.error('Subscription update failed:', response?.message || 'Unknown error');
        return false;
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
      return false;
    }
  },

  login: async (username: string, password: string) => {
    try {
      console.log("Login Starts for ", username, password)
      const response = await loginUser(username, password);
      if (response.success && response.data) {
        set({ 
          user: response.data, 
          isAuthenticated: true, 
          error: null 
        });

        localStorage.setItem(
          'conceptgood_auth',
          JSON.stringify({ 
            isAuthenticated: true, 
            user: response.data,
            token: response.token 
          })
        );

        return true;
      } else {
        set({ error: 'Invalid username or password', isAuthenticated: false, user: null });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      set({ error: 'Login failed', isAuthenticated: false });
      return false;
    }
  },

  register: async (username: string, email: string, mobile: string, password: string, cpassword: string, fullName: string) => {
    try {
      console.log("Registration Starts for ", username, email, mobile, password, cpassword, fullName)
      const response = await registerUser(username, email, mobile, password, fullName);
      if (response.success) {
        console.log("Registration Successful for  ", username)
        return true;
      } else {
        set({ error: response.message || 'Registration failed' });
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      set({ error: 'Registration failed' });
      return false;
    }
  },

  logout: () => {
    set({ isAuthenticated: false, user: null, currentConcept: null, concepts: [] });
    localStorage.removeItem('conceptgood_auth');
    localStorage.removeItem('auth_token');
  },

  searchConcept: async (query: string, existingAnswer?: string) => {
    const cachedConcept = get().concepts.find(
      (c) => c.query.toLowerCase() === query.toLowerCase() &&
             c.template === get().promptTemplate &&
             c.difficulty === get().difficulty
    );

    if (cachedConcept) {
      set({ currentConcept: cachedConcept, isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      let content: string;
      
      if (existingAnswer) {
        // Use the existing answer if provided
        content = existingAnswer;
      } else {
        // Otherwise, generate a new answer using AI
        const difficultyLevel = get().difficulty;
        let complexityAdjustment = '';

        if (difficultyLevel === 'intermediate') {
          complexityAdjustment = 'Use slightly more advanced terminology, but still explain any technical terms.';
        } else if (difficultyLevel === 'advanced') {
          complexityAdjustment = 'You can use more technical terminology and go deeper into the subject, but still maintain clarity.';
        }

        const provider = get().aiProvider;
        const template = get().promptTemplate;
        content = await getAIResponse(query, provider, complexityAdjustment, template);
      }

      const newConcept: Concept = {
        id: Date.now().toString(),
        query,
        content,
        timestamp: Date.now(),
        template: get().promptTemplate,
        difficulty: get().difficulty,
      };

      set((state) => ({
        concepts: [newConcept, ...state.concepts],
        currentConcept: newConcept,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An unknown error occurred', isLoading: false });
    }
  },

  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  setDifficulty: (level) => set({ difficulty: level }),
  setAIProvider: (provider) => set({ aiProvider: provider }),
  setPromptTemplate: (template) => set({ promptTemplate: template }),
  regenerateConcept: async () => {
    const { currentConcept } = get();
    if (currentConcept) {
      await get().searchConcept(currentConcept.query);
    }
  },
  clearCurrentConcept: () => set({ currentConcept: null }),
}));

const initAuth = () => {
  const savedAuth = localStorage.getItem('conceptgood_auth');
  if (savedAuth) {
    try {
      const { isAuthenticated, user, token } = JSON.parse(savedAuth);
      if (isAuthenticated && user) {
        useStore.setState({ isAuthenticated, user });
        useStore.getState().checkUserStatus(user.username);
      }
    } catch (e) {
      console.error('Error parsing saved auth:', e);
      localStorage.removeItem('conceptgood_auth');
      localStorage.removeItem('auth_token');
    }
  }
};

initAuth();

export default useStore;