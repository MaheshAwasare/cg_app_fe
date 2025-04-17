import React, { useState, useEffect } from 'react';
import { Plus, Book, Search, CheckCircle, Clock, AlertCircle, Circle, XCircle, BookOpen, MessageSquare, Lightbulb, Layers, HelpCircle, School, RefreshCw } from 'lucide-react';
import { SubjectConcept, ConceptStatus, PromptTemplate } from '../types';
import ConceptPopup from './ConceptPopup';
import Header from './Header';
import useStore from '../store';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface OpenConcept {
  query: string;
  content: string;
}

interface ConceptsResponse {
  concepts: string[];
  source: string;
}

interface ConceptExplanation {
  content: string;
  template: PromptTemplate;
}

const SubjectLearning: React.FC = () => {
  const [concepts, setConcepts] = useState<SubjectConcept[]>([]);
  const [currentSubject, setCurrentSubject] = useState<string>('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [openConcepts, setOpenConcepts] = useState<OpenConcept[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conceptExplanations, setConceptExplanations] = useState<Record<string, ConceptExplanation>>({});
  const [loadingConcepts, setLoadingConcepts] = useState<Record<string, boolean>>({});
  const { user, isAuthenticated } = useStore();
  const navigate = useNavigate();

  const explanationStyles = [
    { id: 'default' as PromptTemplate, icon: BookOpen, name: 'Standard' },
    { id: 'problemSolutionBenefit' as PromptTemplate, icon: MessageSquare, name: 'Problem-Solution' },
    { id: 'storytelling' as PromptTemplate, icon: Lightbulb, name: 'Storytelling' },
    { id: 'buildingBlocks' as PromptTemplate, icon: Layers, name: 'Building Blocks' },
    { id: 'questionAnswer' as PromptTemplate, icon: HelpCircle, name: 'Q&A' },
    { id: 'examAnswerResponse' as PromptTemplate, icon: School, name: 'Exam' }
  ];

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login', { state: { redirectTo: '/subjects' } });
      return;
    }
  }, [isAuthenticated, user, navigate]);

  const handleAddSubject = async () => {
    if (!newSubjectName.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const conceptsResponse = await fetch('http://localhost:5000/api/concepts/conceptsBySubjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subject: newSubjectName,
          username: user?.username
        }),
      });

      if (!conceptsResponse.ok) {
        const errorData = await conceptsResponse.json();
        throw new Error(errorData.message || 'Failed to fetch concepts');
      }

      const conceptsData: ConceptsResponse = await conceptsResponse.json();

      const newConcepts: SubjectConcept[] = conceptsData.concepts.map((conceptName, index) => ({
        id: `${Date.now()}-${index}`,
        name: conceptName,
        description: '',
        status: 'not_started',
        order: index,
      }));

      setConcepts(newConcepts);
      setCurrentSubject(newSubjectName);
      setNewSubjectName('');
      setIsAddingSubject(false);
    } catch (error) {
      console.error('Error adding concepts:', error);
      setError(error instanceof Error ? error.message : 'Failed to add concepts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConceptStatusChange = async (conceptId: string, status: ConceptStatus) => {
    setConcepts(prevConcepts =>
      prevConcepts.map(concept =>
        concept.id === conceptId ? { ...concept, status } : concept
      )
    );
  };

  const handleExplainConcept = async (concept: SubjectConcept, template: PromptTemplate) => {
    try {
      setLoadingConcepts(prev => ({ ...prev, [concept.id]: true }));
      setError(null);
      
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post('http://localhost:5000/api/ai/aiResponseGoogle', {
        prompt: concept.name,
        query: concept.name,
        template,
        username: user?.username
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Store the explanation with its template
      setConceptExplanations(prev => ({
        ...prev,
        [concept.id]: {
          content: response.data.response,
          template
        }
      }));

      // Open the popup with the explanation
      setOpenConcepts([...openConcepts, {
        query: concept.name,
        content: response.data.response
      }]);

      // Mark concept as in progress
      handleConceptStatusChange(concept.id, 'in_progress');
    } catch (error) {
      console.error('Error explaining concept:', error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || error.message);
      } else {
        setError('Failed to generate explanation');
      }
    } finally {
      setLoadingConcepts(prev => ({ ...prev, [concept.id]: false }));
    }
  };

  const handleReadAgain = (concept: SubjectConcept) => {
    const explanation = conceptExplanations[concept.id];
    if (explanation) {
      setOpenConcepts([...openConcepts, {
        query: concept.name,
        content: explanation.content
      }]);
    }
  };

  const handleClosePopup = (index: number) => {
    const concept = concepts.find(c => c.name === openConcepts[index].query);
    if (concept) {
      handleConceptStatusChange(concept.id, 'completed');
    }
    const newOpenConcepts = [...openConcepts];
    newOpenConcepts.splice(index, 1);
    setOpenConcepts(newOpenConcepts);
  };

  const getStatusIcon = (status: ConceptStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-500" />;
      case 'in_progress':
        return <Clock className="text-yellow-500" />;
      case 'read_later':
        return <AlertCircle className="text-blue-500" />;
      default:
        return <Circle className="text-gray-400" />;
    }
  };

  const calculateProgress = () => {
    const completedConcepts = concepts.filter(c => c.status === 'completed').length;
    return concepts.length > 0
      ? Math.round((completedConcepts / concepts.length) * 100)
      : 0;
  };

  return (
    <div className="min-h-screen bg-primary-600 dark:bg-primary-800">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Subject Learning</h1>
          <button
            onClick={() => setIsAddingSubject(true)}
            className="flex items-center px-4 py-2 bg-white dark:bg-primary-700 text-primary-600 dark:text-white rounded-lg hover:bg-primary-50 dark:hover:bg-primary-600 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Subject
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg flex items-center text-red-700 dark:text-red-400">
            <XCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isAddingSubject && (
          <div className="mb-8 bg-white dark:bg-primary-900 rounded-lg p-6">
            <div className="flex gap-4">
              <input
                type="text"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="Enter subject name"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-primary-800 dark:text-white"
                disabled={isLoading}
              />
              <button
                onClick={handleAddSubject}
                disabled={isLoading}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Loading...
                  </>
                ) : (
                  'Add'
                )}
              </button>
              <button
                onClick={() => setIsAddingSubject(false)}
                disabled={isLoading}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {concepts.length > 0 && (
          <div className="bg-white dark:bg-primary-900 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-primary-800 dark:text-white mb-2">
                  {currentSubject}
                </h2>
                <p className="text-primary-600 dark:text-primary-400">
                  {concepts.length} concepts to learn
                </p>
              </div>
              <div className="text-primary-600 dark:text-primary-400">
                {calculateProgress()}% Complete
              </div>
            </div>

            <div className="space-y-4">
              {concepts.map(concept => {
                const explanation = conceptExplanations[concept.id];
                const isLoading = loadingConcepts[concept.id];

                return (
                  <div
                    key={concept.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-primary-800 rounded-lg hover:bg-gray-100 dark:hover:bg-primary-700 transition-colors"
                  >
                    <div className="flex items-center flex-1">
                      {getStatusIcon(concept.status)}
                      <span className="ml-3 text-primary-800 dark:text-white">
                        {concept.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {explanationStyles.map(style => (
                          <button
                            key={style.id}
                            onClick={() => handleExplainConcept(concept, style.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              explanation?.template === style.id
                                ? 'bg-primary-100 text-primary-600 dark:bg-primary-700 dark:text-primary-300'
                                : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-primary-700'
                            }`}
                            title={`Explain using ${style.name} style`}
                            disabled={isLoading}
                          >
                            <style.icon size={20} />
                          </button>
                        ))}
                      </div>

                      {explanation && (
                        <button
                          onClick={() => handleReadAgain(concept)}
                          className="px-3 py-1 rounded-md text-sm bg-primary-100 text-primary-600 dark:bg-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-600 transition-colors flex items-center"
                        >
                          <RefreshCw size={16} className="mr-1" />
                          Read Again
                        </button>
                      )}

                      <button
                        onClick={() => handleConceptStatusChange(concept.id, 'completed')}
                        className={`px-3 py-1 rounded-md text-sm ${
                          concept.status === 'completed'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => handleConceptStatusChange(concept.id, 'read_later')}
                        className={`px-3 py-1 rounded-md text-sm ${
                          concept.status === 'read_later'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Read Later
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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

export default SubjectLearning;