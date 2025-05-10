import React from 'react';
import { Onboarding } from './components/Onboarding';
import { Chat } from './components/Chat';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useLocalStorage('hasCompletedOnboarding', false);
  const [userName, setUserName] = useLocalStorage('userName', '');
  const [phq9Score, setPhq9Score] = useLocalStorage('phq9Score', 0);

  const handleOnboardingComplete = (name: string, score: number) => {
    setUserName(name);
    setPhq9Score(score);
    setHasCompletedOnboarding(true);
  };

  const resetOnboarding = () => {
    setHasCompletedOnboarding(false);
    setUserName('');
    setPhq9Score(0);
    localStorage.removeItem('chatMessages');
    localStorage.removeItem('chatTimerEndTime');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {!hasCompletedOnboarding ? (
        <div className="flex items-center justify-center flex-grow p-4">
          <Onboarding onComplete={handleOnboardingComplete} />
        </div>
      ) : (
        <div className="flex-grow flex flex-col h-full relative">
          <button 
            onClick={resetOnboarding}
            className="absolute top-2 right-2 text-xs text-gray-400 hover:text-gray-600 z-10"
          >
            Reset app
          </button>
          <Chat userName={userName} phq9Score={phq9Score} />
        </div>
      )}
    </div>
  );
}

export default App;