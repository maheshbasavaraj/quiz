
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const HostView = ({ quiz }) => {
  const [socket, setSocket] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [quizEnded, setQuizEnded] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.emit('joinRoom', { quizId: quiz._id }); // Host joins the room

    newSocket.on('updateParticipantList', (participantList) => {
      setParticipants(participantList);
    });

    newSocket.on('endQuiz', () => {
      setQuizEnded(true);
    });

    return () => newSocket.close();
  }, [quiz._id]);

  const startQuiz = () => {
    socket.emit('nextQuestion', { quizId: quiz._id });
  };

  return (
    <div>
      <h2>{quiz.title}</h2>
      <p>Passcode: {quiz.passcode}</p>
      {!quizEnded ? (
        <button onClick={startQuiz}>Start Quiz / Next Question</button>
      ) : (
        <h2>The quiz has ended.</h2>
      )}
      <h3>Participants</h3>
      <ul>
        {participants.map((participant) => (
          <li key={participant._id}>{participant.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default HostView;
