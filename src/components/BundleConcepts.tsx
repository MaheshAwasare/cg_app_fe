import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BookOpen, MessageSquare, Lightbulb, Layers, HelpCircle, School, RefreshCw } from 'lucide-react';
import Header from './Header';
import ConceptPopup from './ConceptPopup';
import { getAIResponse } from '../services/aiProviders';
import { PromptTemplate } from '../types';
import useStore from '../store';

interface Concept {
  id: string;
  name: string;
  description: string;
}

const explanationStyles = [
  { id: 'default' as PromptTemplate, icon: BookOpen, name: 'Standard' },
  { id: 'problemSolutionBenefit' as PromptTemplate, icon: MessageSquare, name: 'Problem-Solution' },
  { id: 'storytelling' as PromptTemplate, icon: Lightbulb, name: 'Storytelling' },
  { id: 'buildingBlocks' as PromptTemplate, icon: Layers, name: 'Building Blocks' },
  { id: 'questionAnswer' as PromptTemplate, icon: HelpCircle, name: 'Q&A' },
  { id: 'examAnswerResponse' as PromptTemplate, icon: School, name: 'Exam' }
];

const bundleData: { [key: string]: { name: string; concepts: Concept[] } } = {
  mathematics: {
    name: 'Mathematics',
    concepts: [
      { id: '1', name: 'Calculus', description: 'Study of continuous change' },
      { id: '2', name: 'Linear Algebra', description: 'Study of linear equations' },
      { id: '3', name: 'Probability', description: 'Study of random phenomena' },
      // Add more concepts
    ]
  },
  physics: {
    name: 'Physics',
    concepts: [
      { id: '1', name: 'Quantum Mechanics', description: 'Study of matter and energy at atomic scale' },
      { id: '2', name: 'Relativity', description: 'Study of space, time, and gravity' },
      { id: '3', name: 'Thermodynamics', description: 'Study of heat and energy' },
      // Add more concepts
    ]
  },
  // Add more subjects
};

interface ConceptExplanation {
  content: string;
  template: PromptTemplate;
}

const BundleConcepts: React.FC = () => {
  const { bundleId } = useParams<{ bundleId: string }>();
  const [conceptExplanations, setConceptExplanations] = useState<Record<string, ConceptExplanation>>({});
  const [loadingConcepts, setLoadingConcepts] = useState<Record<string, boolean>>({});
  const [openConcepts, setOpenConcepts] = useState<Array<{ query: string; content: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useStore();

  const bundle = bundleId ? bundleData[bundleId] : null;

  const handleExplainConcept = async (concept: Concept, template: PromptTemplate) => {
    try {
      setLoadingConcepts(prev => ({ ...prev, [concept.id]: true }));
      setError(null);

      const response = await getAIResponse(
        concept.name,
        'remote-google',
        'beginner',
        template
      );

      setConceptExplanations(prev => ({
        ...prev,
        [concept.id]: {
          content: response,
          template
        }
      }));

      setOpenConcepts([...openConcepts, {
        query: concept.name,
        content: response
      }]);

    } catch (error) {
      console.error('Error explaining concept:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate explanation');
    } finally {
      setLoadingConcepts(prev => ({ ...prev, [concept.id]: false }));
    }
  };

  const handleReadAgain = (concept: Concept) => {
    const explanation = conceptExplanations[concept.id];
    if (explanation) {
      setOpenConcepts([...openConcepts, {
        query: concept.name,
        content: explanation.content
      }]);
    }
  };

  const handleClosePopup = (index: number) => {
    const newOpenConcepts = [...openConcepts];
    newOpenConcepts.splice(index, 1);
    setOpenConcepts(newOpenConcepts);
  };

  if (!bundle) {
    return <div>Bundle not found</div>;
  }

  return (
    <div className="min-h-screen bg-primary-600 dark:bg-primary-800">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">{bundle.name} Concepts</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="grid gap-6">
          {bundle.concepts.map((concept) => {
            const explanation = conceptExplanations[concept.id];
            const isLoading = loadingConcepts[concept.id];

            return (
              <div
                key={concept.id}
                className="bg-white dark:bg-primary-900 rounded-lg p-6 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-primary-800 dark:text-white">
                      {concept.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {concept.description}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    {explanationStyles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => handleExplainConcept(concept, style.id)}
                        disabled={isLoading}
                        className={`p-2 rounded-lg transition-colors ${
                          explanation?.template === style.id
                            ? 'bg-primary-100 text-primary-600 dark:bg-primary-700 dark:text-primary-300'
                            : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-primary-700'
                        }`}
                        title={`Explain using ${style.name} style`}
                      >
                        <style.icon size={20} />
                      </button>
                    ))}

                    {explanation && (
                      <button
                        onClick={() => handleReadAgain(concept)}
                        className="px-3 py-1 rounded-md text-sm bg-primary-100 text-primary-600 dark:bg-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-600 transition-colors flex items-center"
                      >
                        <RefreshCw size={16} className="mr-1" />
                        Read Again
                      </button>
                    )}
                  </div>
                </div>

                {isLoading && (
                  <div className="flex items-center justify-center py-4">
                    <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {openConcepts.map((concept, index) => (
          <ConceptPopup
            key={index}
            query={concept.query}
            content={concept.content}
            onClose={() => handleClosePopup(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default BundleConcepts;