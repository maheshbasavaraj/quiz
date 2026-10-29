
const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const User = require('../models/User');

// Create a new quiz
router.post('/create', async (req, res) => {
  try {
    const { title, questions } = req.body;
    const passcode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newQuiz = new Quiz({ title, questions, passcode });
    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Join a quiz
router.post('/join', async (req, res) => {
  try {
    const { name, passcode } = req.body;
    const quiz = await Quiz.findOne({ passcode });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    const newUser = new User({ name, quizId: quiz._id });
    await newUser.save();
    res.status(200).json({ user: newUser, quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
