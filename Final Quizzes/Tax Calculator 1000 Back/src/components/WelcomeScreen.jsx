import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, Clock, Shield } from 'lucide-react';
import { trackQuizStart } from '../utils/analytics';

const WelcomeScreen = ({ onStart }) => {
  const handleStart = () => {
    trackQuizStart();
    onStart();
  };

  return (
    <div className="quiz-container">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-accrue-teal rounded-full mb-6"
        >
          <Calculator className="w-10 h-10 text-white" />
        </motion.div>

        <h1 className="mb-4">
          Find $10,000+ in tax credits your business qualifies for
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Most businesses only know about one type of credit. We'll find all 4.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-accrue-gray rounded-lg p-4"
          >
            <Clock className="w-8 h-8 text-accrue-blue mb-2" />
            <h3 className="text-lg font-semibold mb-1">4-Minute Quiz</h3>
            <p className="text-sm text-gray-600">Quick and easy to complete</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-accrue-gray rounded-lg p-4"
          >
            <Calculator className="w-8 h-8 text-accrue-blue mb-2" />
            <h3 className="text-lg font-semibold mb-1">Instant Results</h3>
            <p className="text-sm text-gray-600">See your potential savings immediately</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-accrue-gray rounded-lg p-4"
          >
            <Shield className="w-8 h-8 text-accrue-blue mb-2" />
            <h3 className="text-lg font-semibold mb-1">90-Day Guarantee</h3>
            <p className="text-sm text-gray-600">We'll find your eligible tax credits, or your first payroll is free!</p>
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          className="btn-primary text-lg px-8 py-4"
        >
          Claim your 90-day guarantee
        </motion.button>

        <p className="mt-4 text-sm text-gray-500">
          No credit card required • 100% free calculator
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;