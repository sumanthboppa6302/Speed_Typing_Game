const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const backgroundLettersCount = 300;
const backgroundLettersContainer = document.querySelector('.background-letters');

function getRandomCharacter() {
  return characters.charAt(Math.floor(Math.random() * characters.length));
}

function createBackgroundLetters() {
  for (let i = 0; i < backgroundLettersCount; i++) {
    const letter = document.createElement('span');
    letter.classList.add('letter');
    letter.textContent = getRandomCharacter();
    letter.style.top = `${Math.random() * 100}%`;
    letter.style.left = `${Math.random() * 100}%`;
    letter.style.animationDuration = `${Math.random() * 5 + 2}s`;
    backgroundLettersContainer.appendChild(letter);
  }
}

createBackgroundLetters();
