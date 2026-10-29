import React, { useState } from 'react';
import CreateQuiz from './components/CreateQuiz';
import JoinQuiz from './components/JoinQuiz';
import HostView from './components/HostView';
import ParticipantView from './components/ParticipantView';
import Leaderboard from './components/Leaderboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [view, setView] = useState('welcome'); // welcome, create, join, host, participant

  const renderView = () => {
    switch (view) {
      case 'create':
        return <CreateQuiz setQuiz={setQuiz} setView={setView} />;
      case 'join':
        return <JoinQuiz setUser={setUser} setQuiz={setQuiz} setView={setView} />;
      case 'host':
        return <HostView quiz={quiz} />;
      case 'participant':
        return <ParticipantView user={user} quiz={quiz} />;
      default:
        return (
          <div>
            <h2>Welcome to the Quiz App!</h2>
            <button onClick={() => setView('create')}>Create a Quiz</button>
            <button onClick={() => setView('join')}>Join a Quiz</button>
          </div>
        );
    }
  };

  return (
    <div className="App">
      {renderView()}
      {quiz && <Leaderboard quiz={quiz} />}
    </div>
  );
}

export default App;