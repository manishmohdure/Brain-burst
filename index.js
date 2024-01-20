const questionContainer = document.getElementById('question-container');
const questionText = document.getElementById('question-text');
const optionsList = document.getElementById('options-list');
const feedbackContainer = document.getElementById('feedback-container');
const feedbackText = document.getElementById('feedback');
const nextButton = document.getElementById('next-button');
const resultContainer = document.getElementById('result-container');
const scoreText = document.getElementById('score');
const totalTimeText = document.getElementById('total-time');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const timerContainer = document.getElementById('timer-container');
const timerText = document.getElementById('timer-text');

let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let timePerQuestion = 30; // Time in seconds per question
let totalQuizTime = 0;
let timerInterval;
let timeRemaining;
let userTime = 0;

// Function to load questions from a JSON file and shuffle them
async function loadQuestionsFromJSON() {
  try {
    const response = await fetch('questions.json');  //initiates an HTTP request and returns a promise.
    if (!response.ok) {
      throw new Error('Failed to load questions');
    }

    const data = await response.json();  //parse JSON data from response
    questions = shuffleArray(data);
    totalQuizTime = questions.length * timePerQuestion;
    startQuiz();
  } catch (error) {
    console.error(error);
  }
}

// Function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Function to start the quiz
function startQuiz() {
  loadQuestion();
  updateProgress();
  startTimer();
}

// Function to load a question
function loadQuestion() {
  if (currentQuestionIndex < questions.length) {
    const currentQuestion = questions[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;
    optionsList.innerHTML = '';

    currentQuestion.options.forEach((option, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = option;
      listItem.addEventListener('click', () => checkAnswer(option));
      optionsList.appendChild(listItem);
    });
  } else {
    endQuiz();
  }
}

// Function to check the user's answer
function checkAnswer(selectedAnswer) {
  const currentQuestion = questions[currentQuestionIndex];
  if (selectedAnswer === currentQuestion.answer) {
    score++;
    feedbackText.textContent = 'Correct!';
  } else {
    feedbackText.textContent = 'Incorrect!';
  }

  feedbackContainer.style.display = 'block';
  nextButton.style.display = 'block';
  clearInterval(timerInterval); // Stop the timer for the current question
  userTime += timeRemaining; // Time taken by user to choose answer for the current question
}

// Function to load the next question or end the quiz
function nextQuestion() {
  currentQuestionIndex++;
  feedbackContainer.style.display = 'none';
  nextButton.style.display = 'none';

  if (currentQuestionIndex < questions.length) {
    loadQuestion();
    startTimer(); // Start the timer for the next question
  } else {
    endQuiz();
  }
  updateProgress();
}

// Function to update the progress bar and text
function updateProgress() {
  const progressPercentage = (currentQuestionIndex / questions.length) * 100;
  progressBar.style.width = progressPercentage + '%';
  progressText.textContent = `${currentQuestionIndex} / ${questions.length} questions answered`;
}

// Function to start the timer for each question
function startTimer() {
  let remainingTime = timePerQuestion;
  timerText.textContent = `Time left: ${remainingTime} s`;
  timerInterval = setInterval(function () {
    remainingTime--;
    timeRemaining = remainingTime;
    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      nextQuestion(); // Automatically move to the next question when time is up
    } else {
      timerText.textContent = `Time left: ${remainingTime} s`;
    }
  }, 1000);
}

// Function to end the quiz and display the result
function endQuiz() {
    questionContainer.style.display = 'none';
    resultContainer.style.display = 'block';
    scoreText.textContent = `Your Score: ${score} out of ${questions.length}`;
    
    // Calculate the total time taken
    const totalTimeTaken = totalQuizTime - userTime;
    totalTimeText.textContent = `Total Time Taken: ${totalTimeTaken} s`;

  }
  

// Call the function to load questions from the JSON file and start the quiz
loadQuestionsFromJSON();
