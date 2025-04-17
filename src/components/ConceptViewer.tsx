import React, { useState, useEffect } from 'react';
import { parseConceptContent, extractRelatedConcepts } from '../utils/parseContent';
import ProgressBar from './ProgressBar';
import ConceptSection from './ConceptSection';
import RelatedConcepts from './RelatedConcepts';
import ActionButtons from './ActionButtons';
import useStore from '../store';
import { AlertCircle, ArrowUp } from 'lucide-react';
import { PromptTemplate } from '../types';
import { useNavigate } from 'react-router-dom';

const ConceptViewer: React.FC = () => {
  
  const { currentConcept, isLoading, error, aiProvider, promptTemplate, searchConcept, setPromptTemplate, isPremiumTemplate, user } = useStore();
  console.log("ConceptViewer received error:", error);
  const [sections, setSections] = useState<ReturnType<typeof parseConceptContent>>([]);
  const [relatedConcepts, setRelatedConcepts] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const navigate = useNavigate();
  
  const loadingMessages = [
    "Consulting the knowledge base...",
    "Crafting the perfect explanation...",
    "Distilling complex ideas...",
    "Making it crystal clear...",
    "Adding real-world examples...",
    "Simplifying the concept...",
    "Preparing your 2-minute lesson...",
    "Making learning fun and easy...",
    "Almost ready to enlighten you..."
  ];

  useEffect(() => {
    if (isLoading) {
      const intervalId = setInterval(() => {
        setLoadingMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
      }, 2000);
      return () => clearInterval(intervalId);
    }
  }, [isLoading]);
  
  useEffect(() => {
    if (currentConcept?.content) {
      const parsedSections = parseConceptContent(currentConcept.content);
      setSections(parsedSections);
      const extractedConcepts = extractRelatedConcepts(currentConcept.content);
      setRelatedConcepts(extractedConcepts);
      setCurrentTime(0);
      setIsPlaying(true);
    }
  }, [currentConcept]);
  
  /*useEffect(() => {
    let timer: number;
    if (isPlaying && currentTime < totalTime) {
      timer = window.setInterval(() => {
        setCurrentTime(prev => Math.min(prev + 1, totalTime));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, currentTime]);*/
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const resetTimer = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };
  
  const handleSectionClick = (startTime: number) => {
    setCurrentTime(startTime);
    setIsPlaying(true);
  };
  
  const getCurrentSectionIndex = () => {
    return sections.findIndex(section => 
      currentTime >= section.timeRange[0] && currentTime < section.timeRange[1]
    );
  };

  const handleExplanationStyleChange = async (template: PromptTemplate) => {
    if (isPremiumTemplate(template) && (!user?.subscription || user.subscription.tier !== 'premium')) {
      navigate('/pricing');
      return;
    }
    
    setPromptTemplate(template);
    if (currentConcept) {
      await searchConcept(currentConcept.query);
    }
  };

  const scrollToExplanationStyles = () => {
    const searchBarSection = document.querySelector('.search-bar-section');
    if (searchBarSection) {
      searchBarSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getErrorMessage = (error: any) => {
    console.log("getErrorMessage received:", error); 
    if (typeof error === 'object' && error !== null) {
      return error.error || 'An unexpected error occurred. Please try again.';
    }
    return error || 'An unexpected error occurred. Please try again.';
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-primary-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg text-white mb-2">
          {loadingMessages[loadingMessageIndex]}
        </p>
        <p className="text-sm text-primary-300">
          Using {getProviderName(aiProvider)} to generate your explanation
        </p>
      </div>
    );
  }
  
  if (error) {
    console.log("ConceptViewer error state:", error);
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 flex items-center justify-center text-red-400 mb-4">
          <AlertCircle size={48} />
        </div>
        <h3 className="text-xl font-medium mb-2 text-white">Error</h3>
        <p className="text-primary-200 mb-4">{getErrorMessage(error)}</p>
        <button 
          onClick={() => currentConcept && searchConcept(currentConcept.query)}
          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  if (!currentConcept || !currentConcept.content) {
    return null;
  }
  
  const currentSectionIndex = getCurrentSectionIndex();
  const totalTime = 120; // 2 minutes in seconds
  
  return (
    <div className="w-full max-w-3xl mx-auto mt-8 px-4">
      <div className="flex items-center justify-center mb-2 space-x-2">
        <span className="text-xs px-2 py-1 bg-primary-500 text-white rounded-full dark:bg-primary-700">
          {getProviderName(aiProvider)}
        </span>
        <span className="text-xs px-2 py-1 bg-primary-500 text-white rounded-full dark:bg-primary-700">
          {getTemplateName(promptTemplate)}
        </span>
      </div>
      
      <h2 className="text-2xl font-bold mb-6 text-center text-white">
        {currentConcept.query}
      </h2>
      
      <div className="space-y-4">
        {sections.map((section, index) => (
          <ConceptSection 
            key={index}
            section={section}
            isActive={index === currentSectionIndex}
            isCompleted={currentTime >= section.timeRange[1]}
            onSectionClick={handleSectionClick}
          />
        ))}
      </div>
      
      <ActionButtons />
      
      <div className="mt-8 mb-6">
        <button
          onClick={scrollToExplanationStyles}
          className="mx-auto flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
        >
          <ArrowUp size={18} />
          <span>Try a different explanation style</span>
        </button>
      </div>
      
      {relatedConcepts.length > 0 && (
        <RelatedConcepts concepts={relatedConcepts} />
      )}
    </div>
  );
};

function getProviderName(provider: string): string {
  switch (provider) {
    case 'local-ollama':
      return 'Local Ollama';
    case 'remote-google':
      return 'Google Gemini';
    case 'remote-openai':
      return 'OpenAI';
    case 'remote-claude':
      return 'Anthropic Claude';
    default:
      return 'AI Provider';
  }
}

function getTemplateName(template: string): string {
  switch (template) {
    case 'default':
      return 'Standard';
    case 'problemSolutionBenefit':
      return 'Problem-Solution';
    case 'storytelling':
      return 'Storytelling';
    case 'buildingBlocks':
      return 'Building Blocks';
    case 'questionAnswer':
      return 'Q&A Format';
    case 'examAnswerResponse':
      return 'Exam Format';
    default:
      return 'Template';
  }
}

export default ConceptViewer;