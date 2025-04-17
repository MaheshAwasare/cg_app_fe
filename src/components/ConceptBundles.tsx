import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Atom, FlaskRound as Flask, Brain, Code, Dna, Globe, BookOpen, ChevronRight } from 'lucide-react';

interface ConceptBundle {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  conceptCount: number;
}

const bundles: ConceptBundle[] = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    description: 'From algebra to calculus, master mathematical concepts',
    icon: <Calculator size={24} />,
    color: 'from-blue-500 to-blue-600',
    conceptCount: 150
  },
  {
    id: 'physics',
    name: 'Physics',
    description: 'Understand the fundamental laws of the universe',
    icon: <Atom size={24} />,
    color: 'from-purple-500 to-purple-600',
    conceptCount: 120
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    description: 'Explore molecular structures and chemical reactions',
    icon: <Flask size={24} />,
    color: 'from-green-500 to-green-600',
    conceptCount: 100
  },
  {
    id: 'biology',
    name: 'Biology',
    description: 'Discover the science of life and living organisms',
    icon: <Dna size={24} />,
    color: 'from-red-500 to-red-600',
    conceptCount: 130
  },
  {
    id: 'computer-science',
    name: 'Computer Science',
    description: 'Learn programming and computational thinking',
    icon: <Code size={24} />,
    color: 'from-yellow-500 to-yellow-600',
    conceptCount: 90
  },
  {
    id: 'psychology',
    name: 'Psychology',
    description: 'Understand human behavior and mental processes',
    icon: <Brain size={24} />,
    color: 'from-pink-500 to-pink-600',
    conceptCount: 80
  },
  {
    id: 'geography',
    name: 'Geography',
    description: 'Explore Earth\'s landscapes, environments, and societies',
    icon: <Globe size={24} />,
    color: 'from-teal-500 to-teal-600',
    conceptCount: 70
  },
  {
    id: 'literature',
    name: 'Literature',
    description: 'Analyze literary works and writing techniques',
    icon: <BookOpen size={24} />,
    color: 'from-indigo-500 to-indigo-600',
    conceptCount: 60
  }
];

const ConceptBundles: React.FC = () => {
  const navigate = useNavigate();

  const handleBundleClick = (bundleId: string) => {
    navigate(`/subjects/${bundleId}`);
  };

  return (
    <div className="min-h-screen bg-primary-600 dark:bg-primary-800">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Concept Bundles
          </h1>
          <p className="text-xl text-primary-200">
            Choose a subject to explore its core concepts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bundles.map((bundle) => (
            <div
              key={bundle.id}
              onClick={() => handleBundleClick(bundle.id)}
              className="group cursor-pointer"
            >
              <div className="relative">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r opacity-75 blur group-hover:opacity-100 transition duration-200"></div>
                <div className={`relative bg-white dark:bg-primary-900 rounded-lg p-6 shadow-xl hover:shadow-2xl transition-shadow duration-200`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${bundle.color} text-white`}>
                      {bundle.icon}
                    </div>
                    <ChevronRight 
                      className="text-gray-400 group-hover:text-primary-500 transition-colors" 
                      size={20} 
                    />
                  </div>
                  
                  <h3 className="text-xl font-bold text-primary-800 dark:text-white mb-2">
                    {bundle.name}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {bundle.description}
                  </p>
                  
                  <div className="flex items-center text-sm text-primary-600 dark:text-primary-400">
                    <span>{bundle.conceptCount} concepts</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConceptBundles;