import React from 'react';
import { X } from 'lucide-react';
import { parseConceptContent } from '../utils/parseContent';
import ConceptSection from './ConceptSection';

interface ConceptPopupProps {
  query: string;
  content: string;
  onClose: () => void;
}

const ConceptPopup: React.FC<ConceptPopupProps> = ({ query, content, onClose }) => {
  const sections = parseConceptContent(content);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-primary-900 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-primary-900 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary-800 dark:text-white">
            {query}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Close"
          >
            <X size={24} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        
        <div className="p-6">
          {content ? (
            <div className="prose dark:prose-invert max-w-none">
              {sections.map((section, index) => (
                <ConceptSection 
                  key={index}
                  section={section}
                  isActive={false}
                  isCompleted={true}
                  onSectionClick={() => {}}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600 dark:text-gray-400">
              No content available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConceptPopup;