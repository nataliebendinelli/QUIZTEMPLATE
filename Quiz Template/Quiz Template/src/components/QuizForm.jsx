import { useState } from 'react'
import { motion } from 'framer-motion'

const questions = [
  {
    id: 1,
    type: 'radio',
    question: 'What is your business stage?',
    options: ['Startup', 'Growing', 'Established', 'Enterprise']
  },
  {
    id: 2,
    type: 'checkbox',
    question: 'What are your main challenges?',
    options: ['Lead Generation', 'Customer Retention', 'Sales Process', 'Marketing ROI']
  },
  {
    id: 3,
    type: 'text',
    question: 'What is your monthly marketing budget?',
    placeholder: 'e.g., $5,000'
  }
]

export default function QuizForm({ onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: value })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Show email capture
      setCurrentQuestion(questions.length)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onComplete({ answers, email, name })
  }

  const progress = ((currentQuestion + 1) / (questions.length + 1)) * 100

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="quiz-container"
    >
      <div className="mb-6">
        <div className="bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-primary h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Step {currentQuestion + 1} of {questions.length + 1}
        </p>
      </div>

      {currentQuestion < questions.length ? (
        <motion.div
          key={currentQuestion}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-semibold mb-6">
            {questions[currentQuestion].question}
          </h2>

          {questions[currentQuestion].type === 'radio' && (
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option) => (
                <label key={option} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={option}
                    onChange={(e) => handleAnswer(e.target.value)}
                    className="mr-3"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}

          {questions[currentQuestion].type === 'checkbox' && (
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option) => (
                <label key={option} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    value={option}
                    onChange={(e) => {
                      const current = answers[questions[currentQuestion].id] || []
                      if (e.target.checked) {
                        handleAnswer([...current, option])
                      } else {
                        handleAnswer(current.filter(item => item !== option))
                      }
                    }}
                    className="mr-3"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}

          {questions[currentQuestion].type === 'text' && (
            <input
              type="text"
              placeholder={questions[currentQuestion].placeholder}
              onChange={(e) => handleAnswer(e.target.value)}
              className="quiz-input"
            />
          )}

          <button
            onClick={handleNext}
            disabled={!answers[questions[currentQuestion].id]}
            className="quiz-button mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </motion.div>
      ) : (
        <motion.form
          onSubmit={handleSubmit}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-semibold mb-6">
            Get Your Personalized Results
          </h2>
          
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="quiz-input"
            />
            
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="quiz-input"
            />
          </div>

          <button type="submit" className="quiz-button mt-6 w-full">
            Get Results
          </button>
        </motion.form>
      )}
    </motion.div>
  )
}