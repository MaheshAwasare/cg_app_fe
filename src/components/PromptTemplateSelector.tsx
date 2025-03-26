import React from 'react';
import { BookOpen, MessageSquare, Lightbulb, Layers, HelpCircle, School, Lock } from 'lucide-react';
import useStore from '../store';
import { PromptTemplate } from '../types';
import { useNavigate } from 'react-router-dom';

interface PromptTemplateSelectorProps {
  onClose: () => void;
}

interface TemplateOption {
  id: PromptTemplate;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const PromptTemplateSelector: React.FC<PromptTemplateSelectorProps> = ({ onClose }) => {
  const { promptTemplate, setPromptTemplate, user, isPremiumTemplate } = useStore();
  const navigate = useNavigate();
  
  const templates: TemplateOption[] = [
    {
      id: 'default',
      name: 'Standard Explanation',
      description: 'Clear definition, analogy, principles, application, misconception, and takeaway',
      icon: <BookOpen className="text-primary-600" size={24} />
    },
    {
      id: 'problemSolutionBenefit',
      name: 'Problem-Solution',
      description: 'Presents a problem, explains the solution, and highlights the benefits',
      icon: <MessageSquare className="text-primary-600" size={24} />
    },
    {
      id: 'storytelling',
      name: 'Storytelling',
      description: 'Explains the concept through a narrative with characters and a journey',
      icon: <Lightbulb className="text-primary-600" size={24} />
    },
    {
      id: 'buildingBlocks',
      name: 'Building Blocks',
      description: 'Breaks down the concept into fundamental components and shows how they connect',
      icon: <Layers className="text-primary-600" size={24} />
    },
    {
      id: 'questionAnswer',
      name: 'Q&A Format',
      description: 'Presents the concept as answers to common questions people might have',
      icon: <HelpCircle className="text-primary-600" size={24} />
    },
    {
      id: 'examAnswerResponse',
      name: 'Exam Answer Format',
      description: 'Presents answer particularly for exam preparation',
      icon: <School className="text-primary-600" size={24} />
    }
  ];
  
  const handleSelect = (template: PromptTemplate) => {
    if (isPremiumTemplate(template) && (!user?.subscription || user.subscription.tier !== 'premium')) {
      navigate('/pricing');
      onClose();
      return;
    }
    
    setPromptTemplate(template);
    onClose();
  };

  const isTemplateAvailable = (template: PromptTemplate) => {
    if (!isPremiumTemplate(template)) return true;
    return user?.subscription?.tier === 'premium';
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4 text-primary-800 dark:text-white">Select Explanation Style</h2>
      <div className="space-y-3">
        {templates.map((template) => {
          const isPremium = isPremiumTemplate(template.id);
          const isAvailable = isTemplateAvailable(template.id);
          
          return (
            <div 
              key={template.id}
              className={`p-3 rounded-lg cursor-pointer border hover:bg-primary-50 transition relative ${
                promptTemplate === template.id ? 'border-primary-600 bg-primary-50 dark:bg-primary-800 dark:border-primary-500' : 'border-primary-200 dark:border-primary-700'
              } ${!isAvailable ? 'opacity-75' : ''}`}
              onClick={() => handleSelect(template.id)}
            >
              <div className="flex items-center gap-3">
                {template.icon}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-primary-800 dark:text-white">{template.name}</h3>
                    {isPremium && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Lock size={12} className="mr-1" />
                        Premium
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-primary-600 dark:text-primary-300">{template.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PromptTemplateSelector;