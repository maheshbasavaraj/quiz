
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const ParticipantView = ({ user, quiz }) => {
  const [socket, setSocket] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizEnded, setQuizEnded] = useState(false);
  const [answerResult, setAnswerResult] = useState(null); // { isCorrect, correctOptionId }

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.emit('joinRoom', { userId: user._id, quizId: quiz._id });

    newSocket.on('question', (question) => {
      setCurrentQuestion(question);
      setSelectedOption(null);
      setAnswerResult(null);
      setQuizEnded(false);
    });

    newSocket.on('answerResult', (result) => {
      setAnswerResult(result);
    });

    newSocket.on('endQuiz', () => {
      setQuizEnded(true);
      setCurrentQuestion(null);
    });

    return () => newSocket.close();
  }, [user, quiz]);

  const handleOptionSelect = (option) => {
    if (!selectedOption) { // Prevent changing answer
      setSelectedOption(option);
      socket.emit('answer', { userId: user._id, questionId: currentQuestion._id, option });
    }
  };

  const getOptionClassName = (option) => {
    if (!answerResult) {
      return selectedOption && selectedOption._id === option._id ? 'selected' : '';
    }
    if (answerResult.correctOptionId === option._id) {
      return 'correct';
    }
    if (selectedOption && selectedOption._id === option._id && !answerResult.isCorrect) {
      return 'incorrect';
    }
    return '';
  };

  return (
    <div>
      {quizEnded ? (
        <h2>The quiz has ended. Check the final leaderboard!</h2>
      ) : currentQuestion ? (
        <div>
          <h3>{currentQuestion.text}</h3>
          <ul>
            {currentQuestion.options.map((option) => (
              <li
                key={option._id}
                onClick={() => handleOptionSelect(option)}
                className={getOptionClassName(option)}
              >
                {option.text}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Waiting for the quiz to start...</p>
      )}
    </div>
  );
};

export default ParticipantView;
