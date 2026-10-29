
import React, { useState } from 'react';
import axios from 'axios';

const CreateQuiz = ({ setQuiz, setView }) => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { text: '', options: [{ text: '', isCorrect: false }] },
  ]);
  const [error, setError] = useState(null);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { text: '', options: [{ text: '', isCorrect: false }] },
    ]);
  };

  const handleAddOption = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push({ text: '', isCorrect: false });
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (questionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].text = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex].text = value;
    setQuestions(newQuestions);
  };

  const handleCorrectOptionChange = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.forEach((option, i) => {
      option.isCorrect = i === optionIndex;
    });
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error before new submission
    try {
      const response = await axios.post('/api/quiz/create', {
        title,
        questions,
      });
      setQuiz(response.data);
      setView('host');
    } catch (err) {
      console.error(err);
      setError('Failed to create quiz. Please ensure the server is running and try again.');
    }
  };

  return (
    <div>
      <h2>Create Quiz</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {questions.map((question, questionIndex) => (
          <div key={questionIndex}>
            <input
              type="text"
              placeholder={`Question ${questionIndex + 1}`}
              value={question.text}
              onChange={(e) =>
                handleQuestionChange(questionIndex, e.target.value)
              }
            />
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex}>
                <input
                  type="text"
                  placeholder={`Option ${optionIndex + 1}`}
                  value={option.text}
                  onChange={(e) =>
                    handleOptionChange(
                      questionIndex,
                      optionIndex,
                      e.target.value
                    )
                  }
                />
                <input
                  type="radio"
                  name={`correct-option-${questionIndex}`}
                  onChange={() =>
                    handleCorrectOptionChange(questionIndex, optionIndex)
                  }
                />
              </div>
            ))}
            <button type="button" onClick={() => handleAddOption(questionIndex)}>
              Add Option
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddQuestion}>
          Add Question
        </button>
        <button type="submit">Create Quiz</button>
      </form>
    </div>
  );
};

export default CreateQuiz;
