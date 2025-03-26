import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import * as Icons from 'lucide-react';
import { ConceptSection as ConceptSection1Type } from '../types';

interface ConceptSection1Props {
  section: ConceptSection1Type;
  isActive: boolean;
  isCompleted: boolean;
  onSectionClick: (startTime: number) => void;
  index: number; // To determine stacking order
  totalSections: number; // Total number of sections for proper stacking
}

const ConceptSection1: React.FC<ConceptSection1Props> = ({ 
  section, 
  isActive,
  isCompleted,
  onSectionClick,
  index,
  totalSections
}) => {
  const [flipped, setFlipped] = useState(false);
  const [height, setHeight] = useState<number | null>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  
  // Dynamically get the icon component
  const IconComponent = section.icon ? (Icons as any)[section.icon] : Icons.Circle;
  
  useEffect(() => {
    // Update height when component mounts or when content changes
    if (frontRef.current) {
      setHeight(frontRef.current.offsetHeight);
    }
  }, [section.content]);

  // Get section-specific styling
  const getSectionStyles = () => {
    const baseStyles = {
      active: {
        container: "bg-primary-50 dark:bg-primary-800/50 border-l-4 border-primary-500",
        iconBg: "bg-primary-100 text-primary-600 dark:bg-primary-700 dark:text-primary-300"
      },
      completed: {
        container: "bg-primary-50 dark:bg-primary-800/50 border-l-4 border-green-500",
        iconBg: "bg-primary-100 text-primary-600 dark:bg-primary-700 dark:text-primary-300"
      },
      pending: {
        container: "bg-primary-50 dark:bg-primary-800/50 border-l-4 border-gray-300 dark:border-gray-600",
        iconBg: "bg-primary-100 text-primary-600 dark:bg-primary-700 dark:text-primary-300"
      }
    };
    
    if (isActive) return baseStyles.active;
    if (isCompleted) return baseStyles.completed;
    return baseStyles.pending;
  };
  
  const styles = getSectionStyles();
  
  // Calculate stacking styles
  const stackIndex = totalSections - index;
  const stackingStyles = {
    zIndex: stackIndex,
    transform: flipped ? 'rotateX(180deg)' : `translateY(${index * 8}px)`,
    marginBottom: index === totalSections - 1 ? '0' : '-80px', // Only add margin to last card
  };

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFlipped(!flipped);
  };

  return (
    <div 
      className={`relative perspective-1000 w-full transition-all duration-300`}
      style={{ 
        height: height ? `${height}px` : 'auto',
        marginBottom: flipped ? '16px' : index === totalSections - 1 ? '0' : '-80px',
      }}
    >
      <div 
        className={`relative transform-style-3d transition-all duration-500 w-full`}
        style={{ 
          transform: flipped ? 'rotateX(180deg)' : 'rotateX(0deg)',
          transformStyle: 'preserve-3d',
          height: '100%',
        }}
      >
        {/* Front of card */}
        <div 
          ref={frontRef}
          className={`backface-hidden absolute w-full p-5 rounded-lg shadow-md ${styles.container} transition-all duration-300 hover:shadow-lg`}
          style={{ 
            zIndex: stackIndex,
            transform: `translateZ(1px)`,
            backfaceVisibility: 'hidden',
          }}
          onClick={() => !flipped && onSectionClick(section.timeRange[0])}
        >
          <div className="flex items-center mb-3">
            <div className={`p-2 rounded-full mr-3 ${styles.iconBg}`}>
              <IconComponent size={20} />
            </div>
            <h3 className="text-lg font-medium flex-1 text-primary-800 dark:text-white">
              {section.title}
              <span className="text-sm font-normal text-primary-500 dark:text-primary-300 ml-2">
                ({section.timeRange[0]}-{section.timeRange[1]}s)
              </span>
            </h3>
            <button 
              onClick={handleFlip}
              className="text-primary-600 hover:text-primary-800 dark:text-primary-300 dark:hover:text-primary-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label={flipped ? "Collapse section" : "Expand section"}
            >
              <Icons.ChevronDown size={20} />
            </button>
          </div>
          
          <div className="line-clamp-2 prose dark:prose-invert max-w-none prose-headings:text-primary-700 dark:prose-headings:text-primary-300 prose-a:text-primary-600 dark:prose-a:text-primary-400">
            <ReactMarkdown>{section.content}</ReactMarkdown>
          </div>
        </div>
        
        {/* Back of card (flipped) */}
        <div 
          ref={backRef}
          className={`backface-hidden absolute w-full p-5 rounded-lg shadow-lg ${styles.container} transition-all duration-300`}
          style={{ 
            transform: 'rotateX(180deg) translateZ(1px)',
            zIndex: stackIndex,
            backfaceVisibility: 'hidden',
          }}
          onClick={() => flipped && onSectionClick(section.timeRange[0])}
        >
          <div className="flex items-center mb-3">
            <div className={`p-2 rounded-full mr-3 ${styles.iconBg}`}>
              <IconComponent size={20} />
            </div>
            <h3 className="text-lg font-medium flex-1 text-primary-800 dark:text-white">
              {section.title}
              <span className="text-sm font-normal text-primary-500 dark:text-primary-300 ml-2">
                ({section.timeRange[0]}-{section.timeRange[1]}s)
              </span>
            </h3>
            <button 
              onClick={handleFlip}
              className="text-primary-600 hover:text-primary-800 dark:text-primary-300 dark:hover:text-primary-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Collapse section"
            >
              <Icons.ChevronUp size={20} />
            </button>
          </div>
          
          <div className="prose dark:prose-invert max-w-none prose-headings:text-primary-700 dark:prose-headings:text-primary-300 prose-a:text-primary-600 dark:prose-a:text-primary-400">
            <ReactMarkdown>{section.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConceptSection1;