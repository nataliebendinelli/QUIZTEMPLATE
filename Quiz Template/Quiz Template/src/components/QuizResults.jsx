import { motion } from 'framer-motion'

export default function QuizResults({ data, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="quiz-container"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>

        <h2 className="text-3xl font-bold mb-4">Thank You, {data.name}!</h2>
        <p className="text-gray-600 mb-6">
          We've analyzed your responses and prepared personalized recommendations.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left">
          <h3 className="font-semibold text-lg mb-3">Your Results Summary:</h3>
          <ul className="space-y-2 text-gray-700">
            <li>✓ Personalized strategy document sent to {data.email}</li>
            <li>✓ Free consultation call scheduled</li>
            <li>✓ Access to exclusive resources granted</li>
          </ul>
        </div>

        <div className="text-gray-600 mb-6">
          <p className="mb-2">Check your email for:</p>
          <ul className="text-sm space-y-1">
            <li>• Detailed analysis of your responses</li>
            <li>• Custom action plan</li>
            <li>• Exclusive resources and tools</li>
          </ul>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onReset}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Take Quiz Again
          </button>
          
          <button
            onClick={() => console.log('Lead data:', data)}
            className="quiz-button"
          >
            View Console Log
          </button>
        </div>
      </div>
    </motion.div>
  )
}