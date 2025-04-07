import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import * as Icons from 'lucide-react';
import { ConceptSection as ConceptSectionType } from '../types';

interface ConceptSectionProps {
  section: ConceptSectionType;
  isActive: boolean;
  isCompleted: boolean;
  onSectionClick: (startTime: number) => void;
}

const ConceptSection: React.FC<ConceptSectionProps> = ({ 
  section, 
  isActive,
  isCompleted,
  onSectionClick
}) => {
  const [expanded, setExpanded] = useState(false);
  
  // Dynamically get the icon component
  const IconComponent = section.icon ? (Icons as any)[section.icon] : Icons.Circle;
  
  // Get section-specific styling
  const getSectionStyles = () => {
    const baseStyles = {
      active: {
      container: "bg-primary-50 dark:bg-primary-800/50",
        iconBg: "bg-primary-100 text-primary-600 dark:bg-primary-700 dark:text-primary-300"
      },
      completed: {
        container: "bg-primary-50 dark:bg-primary-800/50",
        iconBg: "bg-primary-100 text-primary-600 dark:bg-primary-700 dark:text-primary-300"
      },
      pending: {
         container: "bg-primary-50 dark:bg-primary-800/50",
        iconBg: "bg-primary-100 text-primary-600 dark:bg-primary-700 dark:text-primary-300"
      }
    };
    
    if (isActive) return baseStyles.active;
    if (isCompleted) return baseStyles.completed;
    return baseStyles.pending;
  };
  
  const styles = getSectionStyles();
  
  return (
    <div 
      className={`mb-6 p-5 rounded-lg shadow-sm transition-all duration-300 cursor-pointer hover:shadow-md ${styles.container}`}
      onClick={() => onSectionClick(section.timeRange[0])}
    >
      <div className="flex items-center mb-3">
        <div className={`p-2 rounded-full mr-3 ${styles.iconBg}`}>
          <IconComponent size={20} />
        </div>
        <h3 className="text-lg font-medium flex-1 text-primary-800 dark:text-white">
          {section.title}
         
        </h3>
        {section.content.length > 150 && (
          <button 
            onClick={(e) => {
              e.stopPropagation(); // Prevent section click when expanding
              setExpanded(!expanded);
            }}
            className="text-primary-600 hover:text-primary-800 dark:text-primary-300 dark:hover:text-primary-200"
          >
            {expanded ? <Icons.ChevronUp size={20} /> : <Icons.ChevronDown size={20} />}
          </button>
        )}
      </div>
      
      <div className={`prose dark:prose-invert max-w-none prose-headings:text-primary-700 dark:prose-headings:text-primary-300 prose-a:text-primary-600 dark:prose-a:text-primary-400 ${
        !expanded && section.content.length > 150 ? 'line-clamp-3' : ''
      }`}>
        <ReactMarkdown>{section.content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default ConceptSection;