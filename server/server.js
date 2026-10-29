
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

const quizRoutes = require('./routes/quiz');
const User = require('./models/User');
const Quiz = require('./models/Quiz');
app.use('/api/quiz', quizRoutes);

const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

async function startDb() {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

startDb();

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // A user joins a quiz room
  socket.on('joinRoom', async ({ userId, quizId }) => {
    socket.join(quizId);
    console.log(`User ${userId} joined room ${quizId}`);

    // Emit the updated list of participants to the room
    const participants = await User.find({ quizId });
    io.to(quizId).emit('updateParticipantList', participants);
  });

  // Host starts the quiz or moves to the next question
  socket.on('nextQuestion', async ({ quizId }) => {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return;

    // If quiz is finished, do nothing
    if (quiz.status === 'finished') return;

    // Move to the next question
    quiz.currentQuestionIndex++;

    if (quiz.currentQuestionIndex < quiz.questions.length) {
      quiz.status = 'inprogress';
      await quiz.save();
      const question = quiz.questions[quiz.currentQuestionIndex];
      io.to(quizId).emit('question', question);
    } else {
      // No more questions, end the quiz
      quiz.status = 'finished';
      await quiz.save();
      io.to(quizId).emit('endQuiz', { message: 'The quiz has ended.' });
    }
  });

  // A participant submits an answer
  socket.on('answer', async ({ userId, questionId, option }) => {
    const user = await User.findById(userId);
    if (!user) return;

    const quiz = await Quiz.findById(user.quizId);
    const question = quiz.questions.id(questionId);

    const correctOption = question.options.find(o => o.isCorrect);
    const isCorrect = correctOption._id.equals(option._id);

    if (isCorrect) {
      user.score += 10; // Add 10 points for a correct answer
      await user.save();
    }

    // Emit result back to the user who answered
    socket.emit('answerResult', { isCorrect, correctOptionId: correctOption._id });

    // Update leaderboard for everyone in the room
    const users = await User.find({ quizId: user.quizId }).sort({ score: -1 });
    io.to(user.quizId).emit('leaderboard', users);
  });

  // User disconnects
  socket.on('disconnect', () => {
    console.log('User disconnected');
    // Note: Here you might want to handle user disconnection, 
    // e.g., remove them from the participant list if the quiz hasn't started.
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
