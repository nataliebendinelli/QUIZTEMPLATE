import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Users, Clock, Trophy, Zap } from 'lucide-react';

export default function RealTimeQuiz({ quizId, userId, userName }) {
  const [socket, setSocket] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:3001', {
      query: { userId, userName, quizId }
    });

    setSocket(newSocket);

    // Socket event listeners
    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to quiz server');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from quiz server');
    });

    newSocket.on('participants_updated', (participantsList) => {
      setParticipants(participantsList);
    });

    newSocket.on('quiz_started', (data) => {
      setQuizStarted(true);
      setCurrentQuestion(data.question);
      setTimeLeft(data.timeLimit || 30);
    });

    newSocket.on('new_question', (data) => {
      setCurrentQuestion(data.question);
      setTimeLeft(data.timeLimit || 30);
    });

    newSocket.on('question_results', (data) => {
      setResults(data);
    });

    newSocket.on('quiz_ended', (finalResults) => {
      setResults(finalResults);
      setCurrentQuestion(null);
      setQuizStarted(false);
    });

    newSocket.on('timer_tick', (time) => {
      setTimeLeft(time);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [quizId, userId, userName]);

  const submitAnswer = (answer) => {
    if (socket && currentQuestion) {
      socket.emit('submit_answer', {
        questionId: currentQuestion.id,
        answer: answer,
        timestamp: Date.now()
      });
      
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: answer
      }));
    }
  };

  const joinQuiz = () => {
    if (socket) {
      socket.emit('join_quiz', { quizId, userId, userName });
    }
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to quiz server...</p>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <Zap className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Live Quiz Lobby</h2>
            <p className="text-gray-600">Waiting for the quiz to start...</p>
          </div>

          {/* Participants List */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-500">
                {participants.length} participant{participants.length !== 1 ? 's' : ''} joined
              </span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {participant.name}
                  {participant.id === userId && ' (You)'}
                </div>
              ))}
            </div>
          </div>

          {participants.length === 0 && (
            <button
              onClick={joinQuiz}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Join Quiz
            </button>
          )}
        </div>
      </div>
    );
  }

  if (results && !currentQuestion) {
    // Show final results
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
            <p className="text-gray-600">Here are the final results</p>
          </div>

          {/* Leaderboard */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Leaderboard</h3>
            {results.leaderboard?.map((participant, index) => (
              <div
                key={participant.id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  index === 0 ? 'bg-yellow-50 border-yellow-200' :
                  index === 1 ? 'bg-gray-50 border-gray-200' :
                  index === 2 ? 'bg-orange-50 border-orange-200' :
                  'bg-white border-gray-200'
                } border`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-orange-500 text-white' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">
                      {participant.name}
                      {participant.id === userId && ' (You)'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {participant.correctAnswers}/{results.totalQuestions} correct
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{participant.score} pts</div>
                  <div className="text-sm text-gray-500">
                    Avg: {(participant.averageTime / 1000).toFixed(1)}s
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show current question
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Header with timer and progress */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-500">
              {participants.length} players
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <span className={`font-bold text-lg ${
              timeLeft <= 5 ? 'text-red-500' : 'text-orange-500'
            }`}>
              {timeLeft}s
            </span>
          </div>
        </div>

        {/* Question */}
        {currentQuestion && (
          <div className="mb-8">
            <div className="text-sm text-gray-500 mb-2">
              Question {currentQuestion.number} of {currentQuestion.total}
            </div>
            <h2 className="text-2xl font-bold mb-6">{currentQuestion.question}</h2>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.options?.map((option, index) => {
                const isSelected = answers[currentQuestion.id] === option;
                const isDisabled = answers[currentQuestion.id] !== undefined;
                
                return (
                  <button
                    key={index}
                    onClick={() => !isDisabled && submitAnswer(option)}
                    disabled={isDisabled}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-800'
                        : isDisabled
                        ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                      }`}>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <span className="font-medium">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Current question results */}
        {results && currentQuestion && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-3">Question Results</h4>
            <div className="space-y-2">
              {results.answerBreakdown?.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className={item.correct ? 'text-green-600 font-medium' : ''}>
                    {item.answer} {item.correct && '✓'}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}