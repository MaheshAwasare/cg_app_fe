import { User as SupabaseUser } from '@supabase/supabase-js';

export interface ConceptSection {
  title: string;
  content: string;
  timeRange: [number, number];
  icon: string;
}

export interface Concept {
  id: string;
  query: string;
  content: string;
  timestamp: number;
  template: PromptTemplate;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export type AIProvider = 'local-ollama' | 'remote-google' | 'remote-openai' | 'remote-claude';
export type PromptTemplate = 'default' | 'problemSolutionBenefit' | 'storytelling' | 'buildingBlocks' | 'questionAnswer' | 'examAnswerResponse';
export type SubscriptionPeriod = 'month' | 'year';
export type SubscriptionTier = 'free' | 'premium';
export type ConceptStatus = 'not_started' | 'in_progress' | 'completed' | 'read_later';

export interface SubjectConcept {
  id: string;
  name: string;
  description: string;
  status: ConceptStatus;
  order: number;
  content?: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  concepts: SubjectConcept[];
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  username: string;
  name: string;
  email: string;
  mobile: string;
  avatar?: string | null;
  plan: string;
  subscription?: {
    tier: SubscriptionTier;
    period: SubscriptionPeriod;
    expiresAt: number;
  };
}

export interface AppState {
  checkUserStatus(username: string): unknown;
  concepts: Concept[];
  currentConcept: Concept | null;
  isLoading: boolean;
  error: string | null;
  darkMode: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  aiProvider: AIProvider;
  promptTemplate: PromptTemplate;
  user: User | null;
  isAuthenticated: boolean;
  
  searchConcept: (query: string) => Promise<void>;
  toggleDarkMode: () => void;
  setDifficulty: (level: 'beginner' | 'intermediate' | 'advanced') => void;
  setAIProvider: (provider: AIProvider) => void;
  setPromptTemplate: (template: PromptTemplate) => void;
  regenerateConcept: () => Promise<void>;
  clearCurrentConcept: () => void;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, mobile: string, password: string, confirmPin: string, fullName: string) => Promise<boolean>;
  logout: () => void;
  subscribe: (tier: SubscriptionTier, period: SubscriptionPeriod) => Promise<boolean>;
  isPremiumTemplate: (template: PromptTemplate) => boolean;
}