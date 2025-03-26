import React from 'react';
import { BookOpen, Search, Clock, Lightbulb, Brain, Target, BarChart, Layers, Compass, BookMarked, MessageSquare, HelpCircle, School } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto mt-12 px-4 text-center">
      {/* Hero Section */}
      <div className="mb-16">
        <div className="flex justify-center mb-6">
          <div className="p-5 bg-primary-500 rounded-full dark:bg-primary-700 shadow-lg">
            <BookOpen size={52} className="text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4 text-white">Learn Any Concept in 2 Minutes</h1>
        <p className="text-primary-100 mb-8 max-w-2xl mx-auto text-lg">
          Type any concept in the search bar above and get a clear, structured explanation designed to be understood in just 2 minutes.
        </p>
        
        <div className="max-w-lg mx-auto">
          <div className="p-4 bg-primary-600 dark:bg-primary-800 rounded-lg border border-primary-400 shadow-md">
            <p className="text-white italic">
              "The best explanation is the one that makes you say, 'Oh, now I get it!" 
            </p>
          </div>
        </div>
      </div>
      
      {/* Main Features */}
      <h2 className="text-2xl font-bold mb-6 text-white">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="p-6 bg-primary-500 rounded-lg dark:bg-primary-700 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex justify-center mb-4">
            <Search className="text-white" size={32} />
          </div>
          <h3 className="font-medium mb-2 text-white text-xl">Search Any Concept</h3>
          <p className="text-primary-100">
            From quantum physics to blockchain, search for any concept you want to understand quickly.
          </p>
        </div>
        
        <div className="p-6 bg-primary-500 rounded-lg dark:bg-primary-700 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex justify-center mb-4">
            <Clock className="text-white" size={32} />
          </div>
          <h3 className="font-medium mb-2 text-white text-xl">Learn in 2 Minutes</h3>
          <p className="text-primary-100">
            Get a structured explanation designed to be understood in exactly 2 minutes, saving you time.
          </p>
        </div>
        
        <div className="p-6 bg-primary-500 rounded-lg dark:bg-primary-700 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex justify-center mb-4">
            <Lightbulb className="text-white" size={32} />
          </div>
          <h3 className="font-medium mb-2 text-white text-xl">Simple Explanations</h3>
          <p className="text-primary-100">
            Complex ideas explained with simple language and relatable analogies that stick in your memory.
          </p>
        </div>
      </div>
      
      {/* Updated Explanation Strategies Section */}
      <h2 className="text-2xl font-bold mb-6 text-white">Choose Your Explanation Style</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 bg-primary-600 dark:bg-primary-800 rounded-lg border border-primary-400 flex flex-col items-center text-center h-full">
          <div className="mb-4 p-3 bg-primary-400 dark:bg-primary-500 rounded-full">
            <BookOpen className="text-white" size={24} />
          </div>
          <h3 className="font-medium mb-2 text-white">Standard Explanation</h3>
          <p className="text-sm text-primary-100">
            Clear definition, analogy, principles, application, misconception, and takeaway.
          </p>
        </div>
        
        <div className="p-6 bg-primary-600 dark:bg-primary-800 rounded-lg border border-primary-400 flex flex-col items-center text-center h-full">
          <div className="mb-4 p-3 bg-primary-400 dark:bg-primary-500 rounded-full">
            <MessageSquare className="text-white" size={24} />
          </div>
          <h3 className="font-medium mb-2 text-white">Problem-Solution</h3>
          <p className="text-sm text-primary-100">
            Presents a problem, explains the solution, and highlights the benefits.
          </p>
        </div>
        
        <div className="p-6 bg-primary-600 dark:bg-primary-800 rounded-lg border border-primary-400 flex flex-col items-center text-center h-full">
          <div className="mb-4 p-3 bg-primary-400 dark:bg-primary-500 rounded-full">
            <Lightbulb className="text-white" size={24} />
          </div>
          <h3 className="font-medium mb-2 text-white">Storytelling</h3>
          <p className="text-sm text-primary-100">
            Explains the concept through a narrative with characters and a journey.
          </p>
        </div>
        
        <div className="p-6 bg-primary-600 dark:bg-primary-800 rounded-lg border border-primary-400 flex flex-col items-center text-center h-full">
          <div className="mb-4 p-3 bg-primary-400 dark:bg-primary-500 rounded-full">
            <Layers className="text-white" size={24} />
          </div>
          <h3 className="font-medium mb-2 text-white">Building Blocks</h3>
          <p className="text-sm text-primary-100">
            Breaks down the concept into fundamental components and shows how they connect.
          </p>
        </div>
        
        <div className="p-6 bg-primary-600 dark:bg-primary-800 rounded-lg border border-primary-400 flex flex-col items-center text-center h-full">
          <div className="mb-4 p-3 bg-primary-400 dark:bg-primary-500 rounded-full">
            <HelpCircle className="text-white" size={24} />
          </div>
          <h3 className="font-medium mb-2 text-white">Q&A Format</h3>
          <p className="text-sm text-primary-100">
            Presents the concept as answers to common questions people might have.
          </p>
        </div>
        
        <div className="p-6 bg-primary-600 dark:bg-primary-800 rounded-lg border border-primary-400 flex flex-col items-center text-center h-full">
          <div className="mb-4 p-3 bg-primary-400 dark:bg-primary-500 rounded-full">
            <School className="text-white" size={24} />
          </div>
          <h3 className="font-medium mb-2 text-white">Exam Answer Format</h3>
          <p className="text-sm text-primary-100">
            Presents answer particularly for exam preparation.
          </p>
        </div>
      </div>
      
      {/* Difficulty Levels */}
      <h2 className="text-2xl font-bold mb-6 text-white">Tailor to Your Knowledge Level</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="p-6 bg-primary-500 rounded-lg dark:bg-primary-700 border-t-4 border-green-400">
          <h3 className="font-medium mb-3 text-white flex items-center justify-center">
            <Compass size={20} className="mr-2" />
            Beginner
          </h3>
          <p className="text-sm text-primary-100">
            Foundational explanations using everyday language and familiar analogies, perfect for first-time learners.
          </p>
        </div>
        
        <div className="p-6 bg-primary-500 rounded-lg dark:bg-primary-700 border-t-4 border-yellow-400">
          <h3 className="font-medium mb-3 text-white flex items-center justify-center">
            <BookMarked size={20} className="mr-2" />
            Intermediate
          </h3>
          <p className="text-sm text-primary-100">
            More detailed explanations that build on basic principles and introduce field-specific terminology.
          </p>
        </div>
        
        <div className="p-6 bg-primary-500 rounded-lg dark:bg-primary-700 border-t-4 border-red-400">
          <h3 className="font-medium mb-3 text-white flex items-center justify-center">
            <Brain size={20} className="mr-2" />
            Advanced
          </h3>
          <p className="text-sm text-primary-100">
            Sophisticated explanations that dive deep into nuances, edge cases, and connect to related advanced concepts.
          </p>
        </div>
      </div>
      
      {/* Example Topics */}
      <div className="bg-primary-600 dark:bg-primary-800 rounded-lg p-6 mb-8">
        <h3 className="font-medium mb-4 text-white">Popular Topics to Explore</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {["Quantum Computing", "Blockchain", "Machine Learning", "Photosynthesis", 
            "Black Holes", "Game Theory", "DNA Sequencing", "Cognitive Biases", 
            "NFTs", "Climate Change"].map((topic) => (
            <span key={topic} className="px-3 py-1 bg-primary-400 text-white rounded-full text-sm">
              {topic}
            </span>
          ))}
        </div>
      </div>
      
      <p className="text-sm text-primary-200 italic">
        Start your learning journey now — simply type a concept in the search bar above.
      </p>
    </div>
  );
};

export default EmptyState;