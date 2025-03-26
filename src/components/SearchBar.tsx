import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import useStore from '../store';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const { searchConcept, isLoading, currentConcept, promptTemplate, difficulty } = useStore();
  
  // Effect to re-search when template or difficulty changes
  useEffect(() => {
    if (currentConcept) {
      searchConcept(currentConcept.query);
    }
  }, [promptTemplate, difficulty]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      searchConcept(query.trim());
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What concept would you like to learn?"
          className="w-full px-5 py-4 pr-12 text-lg rounded-full border border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-primary-900 dark:border-primary-700 dark:text-white transition-all shadow-sm"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-600 hover:text-primary-800 dark:text-primary-300 dark:hover:text-primary-200 transition-colors"
          disabled={isLoading}
        >
          <Search size={24} />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;