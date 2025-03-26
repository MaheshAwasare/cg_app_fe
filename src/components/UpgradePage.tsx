import React, { useState, useEffect } from 'react';
import { Brain, Trophy } from 'lucide-react';
import useStore from '../store';
import { PRICING_PLANS } from '../config/premium';
import { SubscriptionPeriod } from '../types';
import { useNavigate } from 'react-router-dom';
import { getQuizQuestions, QuizQuestion } from '../services/quizService';

const UpgradePage: React.FC = () => {
  const [period, setPeriod] = useState<SubscriptionPeriod>('month');
  const [showQuiz, setShowQuiz] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [discount, setDiscount] = useState(0);
  
  const { user } = useStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadQuestions = async () => {
      const quizQuestions = await getQuizQuestions();
      setQuestions(quizQuestions);
    };
    loadQuestions();
  }, []);
  
  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
    
    if (questionIndex === questions.length - 1) {
      // Calculate results if this was the last question
      const correct = newAnswers.reduce((count, answer, index) => {
        return count + (answer === questions[index].correctAnswer ? 1 : 0);
      }, 0);
      setCorrectAnswers(correct);
      setDiscount(Math.min(correct * 10, 40)); // 10% per correct answer, max 40%
      setQuizCompleted(true);
    } else {
      // Move to next question
      setCurrentQuestion(questionIndex + 1);
    }
  };
  
  const handlePayment = () => {
    const plans = PRICING_PLANS[period];
    const basePrice = plans.premium.price;
    const finalAmount = Math.round(basePrice * (1 - discount / 100));
    
    navigate('/payment', {
      state: {
        amount: finalAmount,
        period,
        discount
      }
    });
  };
  
  const plans = PRICING_PLANS[period];
  const basePrice = plans.premium.price;
  const discountedPrice = Math.round(basePrice * (1 - discount / 100));
  
  return (
    <div className="min-h-screen bg-primary-600 dark:bg-primary-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Upgrade to Pro</h1>
          <p className="text-primary-100 text-lg">
            Get access to all premium features and enhance your learning experience
          </p>
          
          <div className="mt-8 inline-flex items-center bg-primary-700 dark:bg-primary-900 rounded-lg p-1">
            <button
              onClick={() => setPeriod('month')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                period === 'month'
                  ? 'bg-primary-500 text-white'
                  : 'text-primary-200 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setPeriod('year')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                period === 'year'
                  ? 'bg-primary-500 text-white'
                  : 'text-primary-200 hover:text-white'
              }`}
            >
              Yearly
              <span className="ml-2 inline-block px-2 py-0.5 text-xs bg-green-500 text-white rounded-full">
                Save 10%
              </span>
            </button>
          </div>
        </div>
        
        {!showQuiz ? (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-primary-900 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-primary-800 dark:text-white mb-4">
                  Direct Upgrade
                </h2>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-primary-800 dark:text-white">
                    ₹{basePrice}
                  </span>
                  <span className="text-primary-600 dark:text-primary-300 ml-2">
                    /{period}
                  </span>
                </div>
                
                <button
                  onClick={handlePayment}
                  className="w-full flex items-center justify-center px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
            
            <div className="bg-white dark:bg-primary-900 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-primary-800 dark:text-white mb-4">
                  Take the Quiz
                </h2>
                
                <p className="text-primary-600 dark:text-primary-300 mb-6">
                  Answer 4 questions correctly and get up to 40% off your subscription!
                </p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-primary-800 dark:text-white">
                    Up to 40%
                  </span>
                  <span className="text-primary-600 dark:text-primary-300 ml-2">
                    off
                  </span>
                </div>
                
                <button
                  onClick={() => setShowQuiz(true)}
                  className="w-full flex items-center justify-center px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-primary-900 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              {!quizCompleted ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-primary-800 dark:text-white">
                      Question {currentQuestion + 1} of {questions.length}
                    </h2>
                    <div className="text-primary-600 dark:text-primary-300">
                      {currentQuestion + 1} / {questions.length}
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <p className="text-lg text-primary-800 dark:text-white mb-6">
                      {questions[currentQuestion]?.question}
                    </p>
                    
                    <div className="space-y-4">
                      {questions[currentQuestion]?.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(currentQuestion, index)}
                          className={`w-full text-left p-4 rounded-lg border transition ${
                            selectedAnswers[currentQuestion] === index
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-800'
                              : 'border-gray-200 hover:border-primary-300 dark:border-gray-700'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-800 rounded-full mb-4">
                      <Trophy className="w-8 h-8 text-primary-600 dark:text-primary-300" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary-800 dark:text-white mb-2">
                      Quiz Completed!
                    </h2>
                    <p className="text-primary-600 dark:text-primary-300">
                      You got {correctAnswers} out of {questions.length} questions correct!
                    </p>
                  </div>
                  
                  <div className="bg-primary-50 dark:bg-primary-800/50 rounded-lg p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-primary-800 dark:text-white">Original Price:</span>
                      <span className="text-primary-800 dark:text-white">₹{basePrice}</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-primary-800 dark:text-white">Discount:</span>
                      <span className="text-green-600 dark:text-green-400">{discount}% off</span>
                    </div>
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span className="text-primary-800 dark:text-white">Final Price:</span>
                      <span className="text-primary-800 dark:text-white">₹{discountedPrice}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handlePayment}
                    className="w-full flex items-center justify-center px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition"
                  >
                    Upgrade Now with {discount}% Off
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpgradePage;