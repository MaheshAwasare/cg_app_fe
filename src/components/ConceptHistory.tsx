import React, { useState } from 'react';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';
import useStore from '../store';
import { Concept } from '../types';

const ConceptHistory: React.FC = () => {
  const { concepts, searchConcept } = useStore();
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (concepts.length === 0) {
    return null;
  }
  
  // Format date for display
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto mt-8 px-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full p-4 bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors dark:bg-primary-700 dark:hover:bg-primary-600 shadow-sm"
      >
        <div className="flex items-center">
          <Clock size={18} className="mr-2 text-white" />
          <span className="font-medium text-white">Recently Viewed Concepts</span>
        </div>
        {isExpanded ? <ChevronUp size={18} className="text-white" /> : <ChevronDown size={18} className="text-white" />}
      </button>
      
      {isExpanded && (
        <div className="mt-2 bg-white dark:bg-primary-900 rounded-lg border border-primary-300 dark:border-primary-700 overflow-hidden shadow-sm">
          {concepts.map((concept: Concept) => (
            <button
              key={concept.id}
              onClick={() => searchConcept(concept.query)}
              className="flex items-center justify-between w-full p-4 hover:bg-primary-50 dark:hover:bg-primary-800 border-b border-primary-200 dark:border-primary-700 last:border-b-0 transition-colors text-left text-primary-800 dark:text-white"
            >
              <span>{concept.query}</span>
              <span className="text-sm text-primary-500 dark:text-primary-300">
                {formatDate(concept.timestamp)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConceptHistory;