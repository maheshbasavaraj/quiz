
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const Leaderboard = ({ quiz }) => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');

    newSocket.emit('joinRoom', { quizId: quiz._id });

    newSocket.on('leaderboard', (newLeaderboard) => {
      setLeaderboard(newLeaderboard);
    });

    return () => newSocket.close();
  }, [quiz._id]);

  return (
    <div>
      <h2>Leaderboard</h2>
      <ul>
        {leaderboard.map((user) => (
          <li key={user._id}>
            {user.name}: {user.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
