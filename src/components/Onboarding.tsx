import { useState } from 'react';
import { PHQ9Questions } from '../utils/phq9';

interface OnboardingProps {
  onComplete: (name: string, score: number) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<'name' | 'phq9'>('name');
  const [name, setName] = useState('');
  const [answers, setAnswers] = useState<number[]>(Array(9).fill(0));
  
  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setStep('phq9');
    }
  };

  const handleAnswerChange = (index: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const calculateScore = () => {
    return answers.reduce((sum, answer) => sum + answer, 0);
  };

  const handlePhq9Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const score = calculateScore();
    onComplete(name, score);
  };

  const getScoreSeverity = (score: number) => {
    if (score <= 4) return { text: 'Minimal depression', color: 'text-green-500' };
    if (score <= 9) return { text: 'Mild depression', color: 'text-yellow-500' };
    if (score <= 14) return { text: 'Moderate depression', color: 'text-orange-500' };
    if (score <= 19) return { text: 'Moderately severe depression', color: 'text-red-400' };
    return { text: 'Severe depression', color: 'text-red-600' };
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md">
      {step === 'name' ? (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Welcome</h2>
          <p className="text-gray-600">Let's start by getting to know you a little better.</p>
          
          <form onSubmit={handleNameSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                What should we call you?
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name or nickname"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-150 shadow-sm"
            >
              Continue
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">PHQ-9 Assessment</h2>
          <p className="text-gray-600">
            Over the last 2 weeks, how often have you been bothered by any of the following problems?
          </p>
          
          <form onSubmit={handlePhq9Submit} className="space-y-6">
            {PHQ9Questions.map((question, index) => (
              <div key={index} className="space-y-2">
                <p className="text-gray-700">{question}</p>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  {['Not at all', 'Several days', 'More than half the days', 'Nearly every day'].map((label, value) => (
                    <div key={value} className="flex items-center">
                      <input
                        type="radio"
                        id={`q${index}-${value}`}
                        name={`question-${index}`}
                        checked={answers[index] === value}
                        onChange={() => handleAnswerChange(index, value)}
                        className="mr-2"
                      />
                      <label htmlFor={`q${index}-${value}`} className="text-gray-600">
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Your score:</span>
                <span className={`font-bold ${getScoreSeverity(calculateScore()).color}`}>
                  {calculateScore()} - {getScoreSeverity(calculateScore()).text}
                </span>
              </div>
              
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-150 shadow-sm"
              >
                Continue to Chat
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}