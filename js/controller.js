// js/controller.js

const state = {
  index: 0,
  score: 0,
  locked: false,
  currentCorrectIndex: null
};

const els = {
  questionScreen: document.getElementById("questionScreen"),
  gameoverScreen: document.getElementById("gameoverScreen"),

  scoreValue: document.getElementById("scoreValue"),
  questionText: document.getElementById("questionText"),

  answersForm: document.getElementById("answersForm"),

  finalScore: document.getElementById("finalScore"),
  restartButton: document.getElementById("restartButton"),
};

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getRandomWrongOptions(correct) {
  const pool = window.UNIVERSITIES.filter(u => u !== correct);
  shuffle(pool);
  return pool.slice(0, 3);
}

function renderQuestion() {
  state.locked = false;

  const q = window.QUESTIONS[state.index];
  els.questionText.textContent = q.text;
  els.scoreValue.textContent = String(state.score);

  const wrong = getRandomWrongOptions(q.correct);
  const allOptions = shuffle([q.correct, ...wrong]);

  state.currentCorrectIndex = allOptions.indexOf(q.correct);

  // Remove old options
  const oldOptions = els.answersForm.querySelectorAll(".answer-option");
  oldOptions.forEach(n => n.remove());

  // Create clickable options
  allOptions.forEach((opt, idx) => {
    const label = document.createElement("label");
    label.className = "answer-option";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "answer";
    input.value = String(idx);

    const span = document.createElement("span");
    span.textContent = opt;

    label.appendChild(input);
    label.appendChild(span);

    // CLICK HANDLER (instant answer)
    label.addEventListener("click", () => handleAnswer(label, idx));

    els.answersForm.appendChild(label);
  });
}

function handleAnswer(label, idx) {
  if (state.locked) return;
  state.locked = true;

  const isCorrect = idx === state.currentCorrectIndex;

  // Disable clicking other options
  const options = document.querySelectorAll(".answer-option");
  options.forEach(o => o.style.pointerEvents = "none");

  // Apply color transition
  if (isCorrect) {
    label.style.background = "#8FD9FB";
    label.style.color = "#000";
    state.score += window.QUESTIONS[state.index].points ?? 0;
  } else {
    label.style.background = "#e3e3e3";
    label.style.color = "#fff";

    // Highlight the correct one in blue too
    options[state.currentCorrectIndex].style.background = "#8FD9FB";
    options[state.currentCorrectIndex].style.color = "#000";
  }

  els.scoreValue.textContent = String(state.score);

  // Move to next question after delay
  setTimeout(() => {
    state.index += 1;

    if (state.index >= window.QUESTIONS.length) {
      showGameOver();
    } else {
      renderQuestion();
    }
  }, 900);
}

function showGameOver() {
  els.questionScreen.style.display = "none";
  els.gameoverScreen.style.display = "block";
  els.finalScore.textContent = String(state.score);
}

function resetGame() {
  state.index = 0;
  state.score = 0;
  state.locked = false;

  els.gameoverScreen.style.display = "none";
  els.questionScreen.style.display = "flex";

  renderQuestion();
}

els.restartButton.addEventListener("click", resetGame);

// Start
renderQuestion();
