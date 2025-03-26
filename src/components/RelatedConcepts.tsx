import React from 'react';
import { ArrowRight } from 'lucide-react';
import useStore from '../store';

interface RelatedConceptsProps {
  concepts: string[];
}

const RelatedConcepts: React.FC<RelatedConceptsProps> = ({ concepts }) => {
  const { searchConcept } = useStore();
  
  return (
    <div className="mt-8 mb-12">
      <h3 className="text-lg font-medium mb-4 text-white">Related Concepts</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {concepts.map((concept, index) => (
          <button
            key={index}
            onClick={() => searchConcept(concept)}
            className="flex items-center justify-between p-4 bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors dark:bg-primary-700 dark:hover:bg-primary-600 text-white shadow-sm"
          >
            <span>{concept}</span>
            <ArrowRight size={16} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default RelatedConcepts;