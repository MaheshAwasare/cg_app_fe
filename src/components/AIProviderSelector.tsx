import React from 'react';
import { Server, Cloud, Zap, Bot } from 'lucide-react';
import useStore from '../store';
import { AIProvider } from '../types';

interface AIProviderSelectorProps {
  onClose: () => void;
}

interface ProviderOption {
  id: AIProvider;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const AIProviderSelector: React.FC<AIProviderSelectorProps> = ({ onClose }) => {
  const { aiProvider, setAIProvider } = useStore();
  
  const providers: ProviderOption[] = [
    {
      id: 'local-ollama',
      name: 'Local Ollama',
      description: 'Use your local Ollama instance (fastest, requires local setup)',
      icon: <Server className="text-primary-600" size={24} />
    },
    {
      id: 'remote-google',
      name: 'Google Gemini',
      description: 'Use Google\'s Gemini AI (balanced performance)',
      icon: <Cloud className="text-primary-600" size={24} />
    },
    {
      id: 'remote-openai',
      name: 'OpenAI',
      description: 'Use OpenAI\'s models (high quality, may be slower)',
      icon: <Zap className="text-primary-600" size={24} />
    },
    {
      id: 'remote-claude',
      name: 'Anthropic Claude',
      description: 'Use Anthropic\'s Claude (excellent for detailed explanations)',
      icon: <Bot className="text-primary-600" size={24} />
    }
  ];
  
  const handleSelect = (provider: AIProvider) => {
    setAIProvider(provider);
    onClose();
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4 text-primary-800 dark:text-white">Select AI Provider</h2>
      <div className="space-y-3">
        {providers.map((provider) => (
          <div 
            key={provider.id}
            className={`p-3 rounded-lg cursor-pointer border hover:bg-primary-50 transition ${
              aiProvider === provider.id ? 'border-primary-600 bg-primary-50 dark:bg-primary-800 dark:border-primary-500' : 'border-primary-200 dark:border-primary-700'
            }`}
            onClick={() => handleSelect(provider.id)}
          >
            <div className="flex items-center gap-3">
              {provider.icon}
              <div>
                <h3 className="font-medium text-primary-800 dark:text-white">{provider.name}</h3>
                <p className="text-sm text-primary-600 dark:text-primary-300">{provider.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIProviderSelector;