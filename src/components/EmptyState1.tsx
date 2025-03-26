import React from 'react';
import { BookOpen, Search, Clock, Lightbulb } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="w-full max-w-3xl mx-auto mt-12 px-4 text-center">
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-primary-500 rounded-full dark:bg-primary-700">
          <BookOpen size={48} className="text-white" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-4 text-white">Learn Any Concept in 2 Minutes</h2>
      <p className="text-primary-100 mb-8 max-w-lg mx-auto">
        Type any concept in the search bar above and get a clear, structured explanation designed to be understood in just 2 minutes.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 bg-primary-500 rounded-lg dark:bg-primary-700 shadow-sm">
          <div className="flex justify-center mb-4">
            <Search className="text-white" size={24} />
          </div>
          <h3 className="font-medium mb-2 text-white">Search Any Concept</h3>
          <p className="text-sm text-primary-100">
            From quantum physics to blockchain, search for any concept you want to understand.
          </p>
        </div>
        
        <div className="p-6 bg-primary-500 rounded-lg dark:bg-primary-700 shadow-sm">
          <div className="flex justify-center mb-4">
            <Clock className="text-white" size={24} />
          </div>
          <h3 className="font-medium mb-2 text-white">Learn in 2 Minutes</h3>
          <p className="text-sm text-primary-100">
            Get a structured explanation designed to be understood in exactly 2 minutes.
          </p>
        </div>
        
        <div className="p-6 bg-primary-500 rounded-lg dark:bg-primary-700 shadow-sm">
          <div className="flex justify-center mb-4">
            <Lightbulb className="text-white" size={24} />
          </div>
          <h3 className="font-medium mb-2 text-white">Simple Explanations</h3>
          <p className="text-sm text-primary-100">
            Complex ideas explained with simple language and relatable analogies.
          </p>
        </div>
      </div>
      
      <p className="text-sm text-primary-200">
        Try searching for concepts like "quantum computing", "blockchain", "photosynthesis", or "machine learning".
      </p>
    </div>
  );
};

export default EmptyState;