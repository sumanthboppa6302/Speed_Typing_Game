

const QUOTE_API_URLS = {
  easy: 'https://api.quotable.io/random?minLength=20&maxLength=100',
  medium: 'https://api.quotable.io/random?minLength=101&maxLength=300',
  hard: 'https://api.quotable.io/random?minLength=301'
};

const usernameInput = document.getElementById('username');
const gameModeSelect = document.getElementById('gameMode');
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timerValue');
const difficultySelect = document.getElementById('difficulty');
const durationInput = document.getElementById('duration');
const startButton = document.getElementById('startButton');
const submitButton = document.getElementById('submitButton');
const resultsContainer = document.getElementById('resultsContainer');



// Game Data
let timerId;
let timeLimit = 60;
let typedText = '';
let actualQuote = '';

// Event Listeners
startButton.addEventListener('click', startGame);
quoteInputElement.addEventListener('input', handleTyping);
submitButton.addEventListener('click', displayResults);

// Function to start the game
function startGame() {
  const username = usernameInput.value;
  const gameMode = gameModeSelect.value;
  const difficulty = difficultySelect.value;
  timeLimit = parseInt(durationInput.value) || 60; // Use the entered duration or default to 60 seconds

  if (username.trim() === '' || difficulty.trim() === '' || durationInput.value.trim() === '') {
    alert('Please enter the username.');
    return; // Stop the function if any required field is empty
  }

  if (gameMode === 'solo') {
    // Build the URL with query parameters
    const queryParams = new URLSearchParams({
      username: `hello ${username}`, // Set username as "hello" followed by the provided username
      difficulty: difficulty,
      time: timeLimit // Use "time" as the unique query parameter for duration
    });
    const gameUrl = `game.html?${queryParams.toString()}`;

    // Redirect to the game page
    window.location.href = gameUrl;
  } else if (gameMode === 'multiplayer') {
    alert('Multiplayer mode is not yet implemented.');
  }
}

// Function to handle user typing
function handleTyping() {
  typedText = quoteInputElement.value;
  const arrayQuote = quoteDisplayElement.querySelectorAll('span');
  const arrayValue = typedText.split('');

  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];
    if (character == null) {
      characterSpan.classList.remove('correct');
      characterSpan.classList.remove('incorrect');
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add('correct');
      characterSpan.classList.remove('incorrect');
    } else {
      characterSpan.classList.remove('correct');
      characterSpan.classList.add('incorrect');
    }
  });

  if (typedText.length === actualQuote.length) {
    cancelAnimationFrame(timerId);
    quoteInputElement.setAttribute('disabled', 'disabled');
    submitButton.style.display = 'block';
  }
}

// Function to display the game results
function displayResults() {
  const timeElapsed = timeLimit - parseInt(timerElement.innerText);
  const wordsTyped = typedText.trim() === '' ? 0 : typedText.trim().split(/\s+/).length;
  const charactersTyped = typedText.length;
  const charactersPerMinute = (charactersTyped / timeElapsed) * 60;
  const accuracy = calculateAccuracy(typedText, actualQuote);

  const resultsHTML = `
    <p>Time Elapsed: ${timeElapsed} seconds</p>
    <p>Words Correctly Typed: ${wordsTyped}</p>
    <p>Characters Typed: ${charactersTyped}</p>
    <p>Characters per Minute: ${charactersPerMinute.toFixed(2)}</p>
    <p>Accuracy: ${accuracy.toFixed(2)}%</p>
  `;
  resultsContainer.innerHTML = resultsHTML;
}

// Function to calculate accuracy
function calculateAccuracy(userText, originalText) {
  const minLength = Math.min(userText.length, originalText.length);
  let correctCharacters = 0;
  for (let i = 0; i < minLength; i++) {
    if (userText[i] === originalText[i]) {
      correctCharacters++;
    }
  }
  return (correctCharacters / originalText.length) * 100;
}

// Function to fetch a random quote from the API
async function getRandomQuote(difficulty) {
  const response = await fetch(QUOTE_API_URLS[difficulty]);
  const data = await response.json();
  return data.content;
}

// Function to render a new quote on the game screen
async function renderNewQuote(difficulty) {
  actualQuote = await getRandomQuote(difficulty);
  quoteDisplayElement.innerHTML = '';
  actualQuote.split('').forEach(character => {
    const characterSpan = document.createElement('span');
    characterSpan.innerText = character;
    quoteDisplayElement.appendChild(characterSpan);
  });
  quoteInputElement.value = '';
  typedText = '';

  quoteInputElement.removeAttribute('disabled');
  timerElement.innerText = timeLimit;

  resultsContainer.innerHTML = '';

  startTimer();
}

// Function to start the game timer
function startTimer() {
  let startTime = null;
  let timeElapsed = 0;

  function updateTimer() {
    timerId = requestAnimationFrame(updateTimer);

    if (!startTime) {
      startTime = new Date().getTime();
    }

    timeElapsed = Math.floor((new Date().getTime() - startTime) / 1000);
    const remainingTime = Math.max(timeLimit - timeElapsed, 0);

    // Display the updated remaining time in the timer container
    timerElement.innerText = remainingTime.toFixed(1);

    if (remainingTime <= 0) {
      cancelAnimationFrame(timerId);
      quoteInputElement.setAttribute('disabled', 'disabled');
      submitButton.style.display = 'block';
    }
  }

  updateTimer();
}

// Handle page load event
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const difficulty = urlParams.get('difficulty');
  const duration = parseInt(urlParams.get('time')); // Use "time" as the query parameter for duration
  if (difficulty && duration) {
    difficultySelect.value = difficulty;
    durationInput.value = duration;
    timeLimit = duration; // Set the timeLimit to the entered duration
    renderNewQuote(difficulty);
  }

  startButton.style.display = 'block';
});
