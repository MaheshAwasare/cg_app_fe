import React, { useState, useEffect } from 'react';
import { parseConceptContent, extractRelatedConcepts } from '../utils/parseContent';
import ProgressBar from './ProgressBar';
import ConceptSection from './ConceptSection';
import RelatedConcepts from './RelatedConcepts';
import ActionButtons from './ActionButtons';
import useStore from '../store';
import { AlertCircle, HelpCircle } from 'lucide-react';
import { PromptTemplate } from '../types';
import { useNavigate } from 'react-router-dom';

const ConceptViewer: React.FC = () => {
  const { currentConcept, isLoading, error, aiProvider, promptTemplate, searchConcept, setPromptTemplate, isPremiumTemplate, user } = useStore();
  const [sections, setSections] = useState<ReturnType<typeof parseConceptContent>>([]);
  const [relatedConcepts, setRelatedConcepts] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showExplanationStyles, setShowExplanationStyles] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const navigate = useNavigate();
  const totalTime = 120; // 2 minutes in seconds
  
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
      console.log('Parsed sections:', parsedSections); // Debug log
      setSections(parsedSections);
      const extractedConcepts = extractRelatedConcepts(currentConcept.content);
      setRelatedConcepts(extractedConcepts);
      setCurrentTime(0);
      setIsPlaying(true);
      setShowExplanationStyles(false);
    }
  }, [currentConcept]);
  
  useEffect(() => {
    let timer: number;
    if (isPlaying && currentTime < totalTime) {
      timer = window.setInterval(() => {
        setCurrentTime(prev => Math.min(prev + 1, totalTime));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, currentTime]);
  
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
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 flex items-center justify-center text-red-400 mb-4">
          <AlertCircle size={48} />
        </div>
        <h3 className="text-xl font-medium mb-2 text-white">Error</h3>
        <p className="text-primary-200 mb-4">{error}</p>
        <p className="text-sm text-primary-300">
          Try selecting a different AI provider or check your connection.
        </p>
      </div>
    );
  }
  
  if (!currentConcept || !currentConcept.content) {
    return null;
  }
  
  const currentSectionIndex = getCurrentSectionIndex();
  
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
      
     {/** <ProgressBar currentTime={currentTime} totalTime={totalTime} />
      
      <div className="flex justify-center mb-6 space-x-4">
        <button 
          onClick={togglePlayPause}
          className="p-2 rounded-full bg-primary-500 text-white hover:bg-primary-600 dark:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          )}
        </button>
        
        <button 
          onClick={resetTimer}
          className="p-2 rounded-full bg-primary-400 text-white hover:bg-primary-500 dark:bg-primary-600 dark:hover:bg-primary-500 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        </button>
      </div>
       */}
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
      
      <div className="mt-8 mb-6 text-center">
        <button
          onClick={() => setShowExplanationStyles(!showExplanationStyles)}
          className="inline-flex items-center text-white hover:text-primary-200 transition-colors"
        >
          <HelpCircle size={20} className="mr-2" />
          Want to try a different explanation style?
        </button>
      </div>
      
      {showExplanationStyles && (
        <div className="bg-white dark:bg-primary-900 rounded-lg p-6 mb-8 shadow-lg">
          <h3 className="text-lg font-medium mb-4 text-primary-800 dark:text-white">
            Choose Another Explanation Style
          </h3>
          <div className="grid gap-3">
            {[
              { id: 'default', name: 'Standard', description: 'Clear definition with examples and principles' },
              { id: 'problemSolutionBenefit', name: 'Problem-Solution', description: 'Presents the concept as a solution to a problem' },
              { id: 'storytelling', name: 'Storytelling', isPremium: true, description: 'Explains through a narrative journey' },
              { id: 'buildingBlocks', name: 'Building Blocks', description: 'Breaks down into fundamental components' },
              { id: 'questionAnswer', name: 'Q&A Format', description: 'Presents as answers to common questions' },
              { id: 'examAnswerResponse', name: 'Exam Format', isPremium: true, description: 'Structured like an academic response' }
            ].map((style) => {
              const isCurrentStyle = promptTemplate === style.id;
              const isPremium = style.isPremium;
              const isAvailable = !isPremium || (user?.subscription?.tier === 'premium');
              
              return (
                <button
                  key={style.id}
                  onClick={() => handleExplanationStyleChange(style.id as PromptTemplate)}
                  className={`p-3 text-left rounded-lg border transition ${
                    isCurrentStyle 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-800/50' 
                      : 'border-gray-200 hover:border-primary-300 dark:border-gray-700'
                  } ${!isAvailable ? 'opacity-60' : ''}`}
                  disabled={!isAvailable}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-primary-800 dark:text-white">
                        {style.name}
                      </span>
                      {isPremium && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded">
                          Premium
                        </span>
                      )}
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {style.description}
                      </p>
                    </div>
                    {isCurrentStyle && (
                      <span className="text-primary-600 dark:text-primary-400">
                        Current
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
      
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