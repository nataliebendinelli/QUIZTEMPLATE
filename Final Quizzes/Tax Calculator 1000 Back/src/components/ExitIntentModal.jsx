import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { trackExitIntent, trackPDFDownload } from '../utils/analytics';

const ExitIntentModal = ({ isOpen, onClose, currentStep }) => {
  React.useEffect(() => {
    if (isOpen) {
      trackExitIntent(currentStep);
    }
  }, [isOpen, currentStep]);

  const handleDownload = () => {
    trackPDFDownload();
    toast.success('Download started! Check your downloads folder.');
    // In production, this would trigger actual PDF download
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            onClick={onClose}
          >
            <div 
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accrue-teal rounded-full mb-4">
                  <Download className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold mb-2">Wait! Don't leave empty-handed</h3>
                
                <p className="text-gray-600 mb-6">
                  Get our FREE Tax Credit Cheat Sheet with the top 10 credits 
                  most businesses miss out on.
                </p>

                <button
                  onClick={handleDownload}
                  className="btn-primary w-full mb-3"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Free Cheat Sheet
                </button>

                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  No thanks, I'll continue the quiz
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentModal;