# Real-Time Quiz Application

This is a real-time, interactive quiz application that allows users to create quizzes, host them, and have participants join and compete in real-time.

## Features

- **Create Quizzes:** Easily create quizzes with multiple-choice questions.
- **Host & Join:** Hosts can generate a unique passcode for their quiz. Participants can use this passcode to join.
- **Real-Time Gameplay:** Questions are pushed to all participants simultaneously.
- **Live Leaderboard:** Scores are updated and displayed in real-time on a leaderboard for all users to see.
- **Live Participant List:** The host can see a list of all participants who have joined the quiz room.
- **Instant Feedback:** Participants receive immediate feedback on whether their answer was correct or incorrect.

## Technology Stack

- **Frontend:** React.js
- **Backend:** Node.js with Express.js
- **Real-Time Communication:** Socket.IO
- **Database:** MongoDB (using `mongodb-memory-server` for development)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js and npm installed on your machine.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd quiz-app
    ```

2.  **Install Server Dependencies:**
    Navigate to the `server` directory and install the required packages.
    ```bash
    cd server
    npm install
    ```

3.  **Install Client Dependencies:**
    Navigate to the `client` directory and install the required packages.
    ```bash
    cd ../client
    npm install
    ```

### Running the Application

1.  **Start the Backend Server:**
    In the `server` directory, run the following command:
    ```bash
    node server.js
    ```
    The server will start on `http://localhost:5000`.

2.  **Start the Frontend Client:**
    In a separate terminal, navigate to the `client` directory and run the following command:
    ```bash
    npm start
    ```
    The React development server will start, and the application will open in your default browser at `http://localhost:3000`.

## How to Use

1.  **Open the App:** Open two browser windows to `http://localhost:3000` to simulate a host and a participant.

2.  **Create a Quiz (Host):**
    - In one window, click the "Create a Quiz" button.
    - Fill in the quiz title and add at least one question with several options. Make sure to select the correct answer for each question using the radio button.
    - Click "Create Quiz".

3.  **Host View:**
    - You will be taken to the Host View, which displays the quiz title and a unique **passcode**.
    - You will also see a list of participants as they join.

4.  **Join a Quiz (Participant):**
    - In the second browser window, click the "Join a Quiz" button.
    - Enter your name and the passcode provided by the host.
    - Click "Join Quiz".

5.  **Start the Quiz:**
    - Once all participants have joined, the host can click the "Start Quiz / Next Question" button to begin the quiz and advance through the questions.

6.  **Play:**
    - The participant will see the questions and can select an answer.
    - The leaderboard will update in real-time for everyone.
    - The quiz ends when the host has gone through all the questions.

## Future Improvements

The last major task is robust state management. The current implementation uses an in-memory object to track quiz state, which is lost on server restart. A more robust solution would involve persisting this state in the database.