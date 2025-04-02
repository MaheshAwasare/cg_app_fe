import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../store';
import { BookOpen, Search, Clock, Lightbulb, Brain, Target, BarChart, Layers, Compass, BookMarked, MessageSquare, HelpCircle, School, Moon, Sun, ArrowRight, Check, Mail, Phone } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode, isLoading } = useStore();
  
  const handleLogin = () => {
    navigate('/login');
  };
  
  const handleGetStarted = () => {
    navigate('/login?register=true');
  };

  const handleSearch = async (query: string) => {
    useStore.setState({ isLoading: true });
    console.log("After setting isLoading:", useStore.getState().isLoading);
    
    navigate('/dashboard', { state: { initialQuery: query } });
  };
  
  return (
    <div className="min-h-screen bg-primary-50 dark:bg-primary-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-primary-800 shadow-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <img src="/cg_logo_2.jpeg" alt="ConceptGood Logo" className="h-14 w-auto mr-3" />
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-300">ConceptGood</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a href="#features" className="border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:border-primary-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Features
                </a>
                <a href="#how-it-works" className="border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:border-primary-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  How It Works
                </a>
                <a href="#pricing" className="border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:border-primary-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Pricing
                </a>
                <a href="#contact" className="border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:border-primary-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Contact
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={handleLogin}
                className="px-4 py-2 text-primary-600 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-100"
              >
                Log In
              </button>
              <button
                onClick={handleGetStarted}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-16">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-200 to-primary-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-800 dark:text-white mb-6">
            Learn Any Concept in <span className="text-primary-600">2 Minutes</span>
          </h1>
          <p className="text-xl md:text-2xl text-primary-600 dark:text-primary-300 mb-12 max-w-3xl mx-auto">
            Transform complex ideas into clear, structured explanations you can understand in just 2 minutes.
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-12">
            <form onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.querySelector('input');
              if (input && input.value.trim()) {
                handleSearch(input.value.trim());
              }
            }} className="relative">
              <input
                type="text"
                placeholder="What concept would you like to learn?"
                className="w-full px-5 py-4 pr-12 text-lg rounded-full border border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-primary-900 dark:border-primary-700 dark:text-white transition-all shadow-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-600 hover:text-primary-800 dark:text-primary-300 dark:hover:text-primary-200 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Search size={24} />
                )}
              </button>
            </form>
          </div>
          
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { icon: Clock, text: "2-minute explanations" },
                { icon: Brain, text: "AI-powered learning" },
                { icon: Check, text: "Proven methodology" }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-center space-x-2 text-primary-600 dark:text-primary-300">
                  <item.icon size={24} />
                  <span className="text-lg font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {!isLoading && (
        <>
          {/* Features Section */}
          <div id="features" className="py-24 bg-white dark:bg-primary-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-primary-800 dark:text-white mb-4">How It Works</h2>
                <p className="text-xl text-primary-600 dark:text-primary-300">
                  Three simple steps to understanding any concept
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Search,
                    title: "Search Any Concept",
                    description: "From quantum physics to blockchain, search for any concept you want to understand quickly."
                  },
                  {
                    icon: Clock,
                    title: "Learn in 2 Minutes",
                    description: "Get a structured explanation designed to be understood in exactly 2 minutes, saving you time."
                  },
                  {
                    icon: Lightbulb,
                    title: "Simple Explanations",
                    description: "Complex ideas explained with simple language and relatable analogies that stick in your memory."
                  }
                ].map((feature, index) => (
                  <div key={index} className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                    <div className="relative p-8 bg-white dark:bg-primary-900 rounded-lg shadow-xl">
                      <div className="flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-800 rounded-full mb-6">
                        <feature.icon className="w-8 h-8 text-primary-600 dark:text-primary-300" />
                      </div>
                      <h3 className="text-xl font-bold text-primary-800 dark:text-white mb-4">{feature.title}</h3>
                      <p className="text-primary-600 dark:text-primary-300">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Explanation Styles Section */}
          <div id="how-it-works" className="py-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-primary-800 dark:text-white mb-4">Choose Your Learning Style</h2>
                <p className="text-xl text-primary-600 dark:text-primary-300">
                  Multiple ways to understand complex concepts
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: BookOpen, title: "Standard", desc: "Clear definition with examples and principles" },
                  { icon: MessageSquare, title: "Problem-Solution", desc: "Presents the concept as a solution to a problem" },
                  { icon: Lightbulb, title: "Storytelling", desc: "Explains through a narrative journey" },
                  { icon: Layers, title: "Building Blocks", desc: "Breaks down into fundamental components" },
                  { icon: HelpCircle, title: "Q&A Format", desc: "Presents as answers to common questions" },
                  { icon: School, title: "Exam Format", desc: "Structured like an academic response" }
                ].map((style, index) => (
                  <div key={index} className="bg-white dark:bg-primary-900 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-primary-100 dark:bg-primary-800 rounded-full">
                        <style.icon className="text-primary-600 dark:text-primary-300" size={24} />
                      </div>
                      <h3 className="ml-4 text-lg font-bold text-primary-800 dark:text-white">{style.title}</h3>
                    </div>
                    <p className="text-primary-600 dark:text-primary-300">{style.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div id="contact" className="py-24 bg-white dark:bg-primary-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-4xl font-bold text-primary-800 dark:text-white mb-8">Get in Touch</h2>
              <div className="bg-primary-50 dark:bg-primary-900 rounded-2xl p-8 shadow-xl">
                <p className="text-xl text-primary-600 dark:text-primary-300 mb-8">
                  Have questions? We're here to help!
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Mail className="text-primary-600 dark:text-primary-300" />
                    <a href="mailto:support@conceptgood.com" className="text-primary-600 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-100">
                      support@conceptgood.com
                    </a>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Phone className="text-primary-600 dark:text-primary-300" />
                    <a href="tel:+911234567899" className="text-primary-600 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-100">
                      +91 1234567899
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Popular Topics */}
          <div className="py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white dark:bg-primary-900 rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-primary-800 dark:text-white mb-6 text-center">
                  Popular Topics to Explore
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {[
                    "Quantum Computing", "Blockchain", "Machine Learning",
                    "Photosynthesis", "Black Holes", "Game Theory",
                    "DNA Sequencing", "Cognitive Biases", "NFTs", "Climate Change"
                  ].map((topic) => (
                    <span key={topic} className="px-4 py-2 bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300 rounded-full text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-700 transition-colors cursor-pointer">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-white dark:bg-primary-800 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center">
                <img src="/cg_logo_2.jpeg" alt="ConceptGood Logo" className="h-16 w-auto mb-4" />
                <p className="text-primary-800 dark:text-white font-medium mb-2">
                  © {new Date().getFullYear()} ConceptGood. All rights reserved.
                </p>
                <p className="text-primary-600 dark:text-primary-300">
                  Learn any concept in 2 minutes
                </p>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default HomePage;