import React, { useState } from 'react';
import { Search, BookOpen, MessageSquare, Lightbulb, Layers, HelpCircle, School, Lock, Info } from 'lucide-react';
import useStore from '../store';
import { PromptTemplate } from '../types';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const { searchConcept, isLoading, promptTemplate, setPromptTemplate, user, isPremiumTemplate } = useStore();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      await searchConcept(query.trim());
    }
  };

  const explanationStyles = [
    { id: 'default' as PromptTemplate, icon: BookOpen, name: 'Standard', description: 'Clear definition with examples' },
    { id: 'problemSolutionBenefit' as PromptTemplate, icon: MessageSquare, name: 'Problem-Solution', description: 'Solution to a problem' },
    { id: 'storytelling' as PromptTemplate, icon: Lightbulb, name: 'Storytelling', isPremium: false, description: 'Through a narrative' },
    { id: 'buildingBlocks' as PromptTemplate, icon: Layers, name: 'Building Blocks', description: 'Fundamental components' },
    { id: 'questionAnswer' as PromptTemplate, icon: HelpCircle, name: 'Q&A Format', description: 'Common questions' },
    { id: 'examAnswerResponse' as PromptTemplate, icon: School, name: 'Exam Format', isPremium: false, description: 'Academic style' }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto search-bar-section">
      <form onSubmit={handleSubmit} className="relative mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What concept would you like to learn?"
          className="w-full px-5 py-4 pr-12 text-lg rounded-lg border border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-primary-900 dark:border-primary-700 dark:text-white transition-all shadow-sm"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-600 hover:text-primary-800 dark:text-primary-300 dark:hover:text-primary-200 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Search size={24} />
          )}
        </button>
      </form>

      <div className="bg-white dark:bg-primary-900 rounded-lg p-4 shadow-lg border border-primary-200 dark:border-primary-700">
        <div className="flex items-center gap-2 mb-4 text-primary-600 dark:text-primary-300">
          <Info size={18} />
          <h3 className="text-sm font-medium">Choose how you'd like the concept explained:</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {explanationStyles.map((style) => {
            const isSelected = promptTemplate === style.id;
            const isPremium = style.isPremium;
            const isAvailable = !isPremium || (user?.subscription?.tier === 'premium');
            const Icon = style.icon;

            return (
              <button
                key={style.id}
                onClick={() => isAvailable && setPromptTemplate(style.id)}
                className={`relative group p-3 rounded-lg transition-all ${
                  isSelected
                    ? 'bg-primary-500 text-white ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-primary-900'
                    : 'bg-primary-50 dark:bg-primary-800/50 text-primary-600 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-800'
                } ${!isAvailable ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                disabled={!isAvailable}
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <div className={`p-2 rounded-full ${
                    isSelected 
                      ? 'bg-white/20' 
                      : 'bg-white dark:bg-primary-800'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="font-medium flex items-center justify-center gap-1">
                      {style.name}
                      {isPremium && (
                        <Lock size={12} className="text-yellow-500" />
                      )}
                    </div>
                    <p className="text-xs mt-1 opacity-80">
                      {style.description}
                    </p>
                  </div>
                </div>
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs">
                    ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-primary-500 dark:text-primary-300">
            {promptTemplate !== 'default' && `Using ${
              explanationStyles.find(s => s.id === promptTemplate)?.name
            } style to explain concepts`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;