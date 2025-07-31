import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';
import QuizForm from './components/QuizForm';
import Results from './components/Results';
import ProgressBar from './components/ProgressBar';
import ExitIntentModal from './components/ExitIntentModal';
import { calculateTaxCredits } from './utils/creditEngine';

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [results, setResults] = useState(null);

  const handleQuizStart = () => {
    setCurrentStep(1);
  };

  const handleStepComplete = (stepData) => {
    const newFormData = { ...formData, ...stepData };
    setFormData(newFormData);

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate results
      const calculatedResults = calculateTaxCredits(newFormData);
      setResults(calculatedResults);
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setFormData({});
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-accrue-gray">
      <Toaster position="top-center" />
      <Header />
      
      <main className="pt-20 pb-12">
        {currentStep > 0 && currentStep < 4 && (
          <ProgressBar currentStep={currentStep} totalSteps={3} />
        )}
        
        {currentStep === 0 && <WelcomeScreen onStart={handleQuizStart} />}
        
        {currentStep >= 1 && currentStep <= 3 && (
          <QuizForm
            step={currentStep}
            formData={formData}
            onComplete={handleStepComplete}
            onBack={handleBack}
          />
        )}
        
        {currentStep === 4 && results && (
          <Results
            results={results}
            formData={formData}
            onRestart={handleRestart}
          />
        )}
      </main>
      
      <ExitIntentModal isQuizActive={currentStep > 0 && currentStep < 4} />
    </div>
  );
}

export default App