
const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  options: [optionSchema],
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  questions: [questionSchema],
  passcode: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['waiting', 'inprogress', 'finished'],
    default: 'waiting',
  },
  currentQuestionIndex: {
    type: Number,
    default: -1,
  },
});

module.exports = mongoose.model('Quiz', quizSchema);
