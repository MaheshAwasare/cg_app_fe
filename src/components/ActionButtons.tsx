import React from 'react';
import { Share2, Save, RefreshCw, Volume2 } from 'lucide-react';
import useStore from '../store';

const ActionButtons: React.FC = () => {
  const { regenerateConcept, currentConcept } = useStore();
  
  const handleShare = () => {
    if (currentConcept) {
      if (navigator.share) {
        navigator.share({
          title: `ConceptGood: ${currentConcept.query}`,
          text: `Learn about ${currentConcept.query} in just 2 minutes!`,
          url: window.location.href,
        }).catch(err => {
          console.error('Error sharing:', err);
        });
      } else {
        // Fallback for browsers that don't support the Web Share API
        navigator.clipboard.writeText(window.location.href)
          .then(() => {
            alert('Link copied to clipboard!');
          })
          .catch(err => {
            console.error('Error copying to clipboard:', err);
          });
      }
    }
  };
  
  const handleSave = () => {
    // In a real app, this would save to user's account
    // For now, just save to localStorage
    if (currentConcept) {
      const savedConcepts = JSON.parse(localStorage.getItem('savedConcepts') || '[]');
      if (!savedConcepts.some((c: any) => c.id === currentConcept.id)) {
        savedConcepts.push(currentConcept);
        localStorage.setItem('savedConcepts', JSON.stringify(savedConcepts));
        alert('Concept saved for later!');
      } else {
        alert('This concept is already saved!');
      }
    }
  };
  
  const handleAudioNarration = () => {
    // In a real app, this would use the Web Speech API or a similar service
    alert('Audio narration feature coming soon!');
  };
  
  return (
    <div className="flex justify-center space-x-4 my-8">
      <button 
        onClick={handleShare}
        className="flex items-center px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors dark:bg-primary-700 dark:hover:bg-primary-600 shadow-sm"
      >
        <Share2 size={18} className="mr-2" />
        Share
      </button>
      
      <button 
        onClick={handleSave}
        className="flex items-center px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors dark:bg-primary-700 dark:hover:bg-primary-600 shadow-sm"
      >
        <Save size={18} className="mr-2" />
        Save
      </button>
      
      <button 
        onClick={() => regenerateConcept()}
        className="flex items-center px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors dark:bg-primary-700 dark:hover:bg-primary-600 shadow-sm"
      >
        <RefreshCw size={18} className="mr-2" />
        Regenerate
      </button>
      
      <button 
        onClick={handleAudioNarration}
        className="flex items-center px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors dark:bg-primary-700 dark:hover:bg-primary-600 shadow-sm"
      >
        <Volume2 size={18} className="mr-2" />
        Audio
      </button>
    </div>
  );
};

export default ActionButtons;