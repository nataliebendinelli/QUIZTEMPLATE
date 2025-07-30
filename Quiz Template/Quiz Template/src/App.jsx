import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import QuizForm from './components/QuizForm'
import QuizResults from './components/QuizResults'

function App() {
  const [quizData, setQuizData] = useState(null)
  const [showResults, setShowResults] = useState(false)

  const handleQuizComplete = (data) => {
    setQuizData(data)
    setShowResults(true)
  }

  const resetQuiz = () => {
    setQuizData(null)
    setShowResults(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <img 
              src="/accrue-logo-avatar-64.svg" 
              alt="Logo" 
              className="w-16 h-16 mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Lead Generation Quiz Template
            </h1>
            <p className="text-gray-600">
              Modern React + Tailwind + Framer Motion Setup
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!showResults ? (
              <QuizForm onComplete={handleQuizComplete} />
            ) : (
              <QuizResults data={quizData} onReset={resetQuiz} />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

export default App