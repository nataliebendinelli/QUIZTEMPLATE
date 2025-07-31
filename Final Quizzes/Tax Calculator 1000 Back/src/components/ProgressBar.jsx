import React from 'react';
import * as Progress from '@radix-ui/react-progress';
import { motion } from 'framer-motion';

const ProgressBar = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full bg-white shadow-sm">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress.Root
          className="relative overflow-hidden bg-gray-200 rounded-full w-full h-2"
          style={{ transform: 'translateZ(0)' }}
          value={progress}
        >
          <Progress.Indicator
            className="bg-accrue-teal w-full h-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${100 - progress}%)` }}
          />
        </Progress.Root>
      </div>
    </div>
  );
};

export default ProgressBar;