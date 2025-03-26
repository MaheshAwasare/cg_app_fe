import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../store';
import { BookOpen, Search, Clock, Lightbulb, Brain, Target, BarChart, Layers, Compass, BookMarked, MessageSquare, HelpCircle, School } from 'lucide-react';

const HomePage = () => {
  

  const navigate = useNavigate();
  
  const handleLogin = () => {
    navigate('/login');
  };
  
  const handleGetStarted = () => {
    navigate('/register');
  };
  
  return (
    <div className="min-h-screen bg-primary-50 dark:bg-primary-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-primary-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
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
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogin}
                className="ml-4 px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-white dark:bg-primary-800 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white dark:bg-primary-800 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Learn any concept</span>{' '}
                  <span className="block text-primary-600 dark:text-primary-300 xl:inline">in 2 minutes</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 dark:text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  ConceptGood helps you quickly understand complex ideas through concise explanations and visual aids. Perfect for students, professionals, and lifelong learners.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <button
                      onClick={handleGetStarted}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
                    >
                      Get Started
                    </button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <a
                      href="#how-it-works"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 dark:text-primary-100 dark:bg-primary-700 dark:hover:bg-primary-600 md:py-4 md:text-lg md:px-10"
                    >
                      Learn More
                    </a>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-primary-100 dark:bg-primary-700 flex items-center justify-center">
          <div className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full p-8">
            <div className="w-full h-full bg-white dark:bg-primary-800 rounded-lg shadow-lg flex items-center justify-center">
              <svg className="w-48 h-48 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-12 bg-white dark:bg-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 dark:text-primary-300 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              A better way to learn
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
              Our platform is designed to make learning faster, more efficient, and enjoyable.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {[
                {
                  icon: <Clock className="h-6 w-6" />,
                  name: 'Quick Comprehension',
                  description: 'Learn complex concepts in just 2 minutes with our concise, easy-to-understand explanations.'
                },
                {
                  icon: <Lightbulb className="h-6 w-6" />,
                  name: 'Visual Learning',
                  description: 'Visual aids, diagrams, and interactive elements help reinforce understanding and retention.'
                },
                {
                  icon: <Brain className="h-6 w-6" />,
                  name: 'Personalized Experience',
                  description: 'Track your learning history and get recommendations based on your interests.'
                },
                {
                  icon: <Target className="h-6 w-6" />,
                  name: 'Anywhere, Anytime',
                  description: 'Access our platform from any device, making learning possible wherever you are.'
                }
              ].map((feature, index) => (
                <div key={index} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    {feature.icon}
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">{feature.name}</h3>
                    <p className="mt-2 text-base text-gray-500 dark:text-gray-300">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="py-12 bg-primary-50 dark:bg-primary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 dark:text-primary-300 font-semibold tracking-wide uppercase">How it works</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Simple, effective learning
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
              Our intuitive platform makes it easy to find and learn the concepts you need.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {[
                {
                  step: '01',
                  icon: <Search className="h-8 w-8 text-primary-500" />,
                  name: 'Search',
                  description: 'Type in any concept or topic you want to learn about.'
                },
                {
                  step: '02',
                  icon: <BookOpen className="h-8 w-8 text-primary-500" />,
                  name: 'Learn',
                  description: 'Read our concise explanation designed to be understood in 2 minutes.'
                },
                {
                  step: '03',
                  icon: <BookMarked className="h-8 w-8 text-primary-500" />,
                  name: 'Apply',
                  description: 'Use your new knowledge and save concepts for future reference.'
                }
              ].map((step) => (
                <div key={step.step} className="relative">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-white dark:bg-primary-800 border-2 border-primary-500 mb-4">
                      <span className="text-xl font-bold text-primary-600 dark:text-primary-300">{step.step}</span>
                    </div>
                    <div className="flex justify-center mb-2">
                      {step.icon}
                    </div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white text-center">{step.name}</h3>
                    <p className="mt-2 text-base text-gray-500 dark:text-gray-300 text-center">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-12 bg-white dark:bg-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 dark:text-primary-300 font-semibold tracking-wide uppercase">Pricing</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Plans for every learner
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
              Choose the plan that fits your learning needs.
            </p>
          </div>

          <div className="mt-10 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
            {[
              {
                name: 'Free',
                price: '$0',
                description: 'Perfect for casual learners',
                features: [
                  'Access to 50+ basic concepts',
                  'Simple visual aids',
                  'Learning history (7 days)',
                  'Mobile access'
                ],
                cta: 'Get Started',
                highlight: false
              },
              {
                name: 'Premium',
                price: '$9.99',
                period: 'per month',
                description: 'Great for dedicated students',
                features: [
                  'Access to 1000+ concepts',
                  'Advanced visual aids',
                  'Unlimited learning history',
                  'Concept saving and organization',
                  'Priority support'
                ],
                cta: 'Start Premium',
                highlight: true
              },
              {
                name: 'Enterprise',
                price: 'Contact us',
                description: 'For teams and organizations',
                features: [
                  'Everything in Premium',
                  'Custom content tailoring',
                  'Team management',
                  'Progress analytics',
                  'API access',
                  'Dedicated support'
                ],
                cta: 'Contact Sales',
                highlight: false
              }
            ].map((plan) => (
              <div key={plan.name} className={`flex flex-col rounded-lg shadow-lg overflow-hidden ${plan.highlight ? 'border-2 border-primary-500' : 'border border-gray-200 dark:border-gray-700'}`}>
                <div className="px-6 py-8 bg-white dark:bg-primary-800 sm:p-10 sm:pb-6">
                  <div>
                    <h3 className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-primary-100 dark:bg-primary-700 text-primary-600 dark:text-primary-300">
                      {plan.name}
                    </h3>
                  </div>
                  <div className="mt-4 flex items-baseline text-6xl font-extrabold text-gray-900 dark:text-white">
                    {plan.price}
                    {plan.period && <span className="ml-1 text-2xl font-medium text-gray-500 dark:text-gray-400">{plan.period}</span>}
                  </div>
                  <p className="mt-5 text-lg text-gray-500 dark:text-gray-300">{plan.description}</p>
                </div>
                <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-gray-50 dark:bg-primary-900 space-y-6 sm:p-10 sm:pt-6">
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="ml-3 text-base text-gray-700 dark:text-gray-300">{feature}</p>
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-md shadow">
                    <button
                      onClick={handleGetStarted}
                      className={`w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md ${
                        plan.highlight
                          ? 'text-white bg-primary-600 hover:bg-primary-700'
                          : 'text-primary-600 bg-white hover:bg-gray-50 dark:text-primary-300 dark:bg-primary-800 dark:hover:bg-primary-700'
                      }`}
                    >
                      {plan.cta}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-primary-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-300">ConceptGood</span>
              <p className="text-gray-500 dark:text-gray-300 text-base">
                Making learning efficient, accessible, and enjoyable for everyone.
              </p>
              <div className="flex space-x-6">
                {/* Social Links */}
                {['facebook', 'instagram', 'twitter', 'github', 'youtube'].map((social) => (
                  <a key={social} href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                    <span className="sr-only">{social}</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-300 uppercase tracking-wider">Solutions</h3>
                  <ul className="mt-4 space-y-4">
                    {['Students', 'Professionals', 'Educators', 'Teams'].map((item) => (
                      <li key={item}>
                        <a href="#" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-300 uppercase tracking-wider">Support</h3>
                  <ul className="mt-4 space-y-4">
                    {['Pricing', 'Documentation', 'Guides', 'API Status'].map((item) => (
                      <li key={item}>
                        <a href="#" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-300 uppercase tracking-wider">Company</h3>
                  <ul className="mt-4 space-y-4">
                    {['About', 'Blog', 'Jobs', 'Press', 'Partners'].map((item) => (
                      <li key={item}>
                        <a href="#" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-300 uppercase tracking-wider">Legal</h3>
                  <ul className="mt-4 space-y-4">
                    {['Privacy', 'Terms', 'Cookies', 'License'].map((item) => (
                      <li key={item}>
                        <a href="#" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
            <p className="text-base text-gray-400 dark:text-gray-300 xl:text-center">
              &copy; {new Date().getFullYear()} ConceptGood. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;