
import React, { useState } from 'react';
import axios from 'axios';

const JoinQuiz = ({ setUser, setQuiz, setView }) => {
  const [name, setName] = useState('');
  const [passcode, setPasscode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/quiz/join', { name, passcode });
      setUser(response.data.user);
      setQuiz(response.data.quiz);
      setView('participant');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Join Quiz</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Passcode"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
        />
        <button type="submit">Join Quiz</button>
      </form>
    </div>
  );
};

export default JoinQuiz;
