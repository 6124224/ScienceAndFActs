const quizzes = {
  physics: [
    { q: "What is Newton's first law also known as?", o: ["Law of Gravity", "Law of Inertia", "Law of Motion", "Law of Energy"], a: 1 },
    { q: "What is the SI unit of force?", o: ["Watt", "Joule", "Newton", "Pascal"], a: 2 },
    // ... (rest of the questions)
  ],
  chemistry: [
    { q: "What is H₂O commonly known as?", o: ["Salt", "Sugar", "Water", "Alcohol"], a: 2 },
    { q: "How many elements are in the periodic table?", o: ["100", "118", "120", "150"], a: 1 },
    // ... (rest of the questions)
  ],
  biology: [
    { q: "What is the powerhouse of the cell?", o: ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"], a: 1 },
    { q: "Which organ produces insulin?", o: ["Liver", "Kidney", "Pancreas", "Heart"], a: 2 },
    // ... (rest of the questions)
  ],
  astronomy: [
    { q: "Which planet is known as the Red Planet?", o: ["Venus", "Mars", "Saturn", "Mercury"], a: 1 },
    { q: "Which galaxy do we live in?", o: ["Andromeda", "Whirlpool", "Milky Way", "Sombrero"], a: 2 },
    // ... (rest of the questions)
  ],
  earth: [
    { q: "What is the outermost layer of the Earth called?", o: ["Core", "Mantle", "Crust", "Atmosphere"], a: 2 },
    { q: "Which natural disaster is measured using the Richter scale?", o: ["Hurricane", "Tornado", "Earthquake", "Flood"], a: 2 },
    // ... (rest of the questions)
  ]
};

let currentTopic = '';
let currentQuiz = [];
let currentQuestionIndex = 0;
let score = 0;

function startQuiz(topic) {
  document.getElementById("topic-selection").classList.add("hidden");
  document.getElementById("quiz-container").classList.remove("hidden");
  document.getElementById("quiz-container").classList.add("visible");

  currentTopic = topic;
  currentQuiz = quizzes[topic];
  currentQuestionIndex = 0;
  score = 0;
  showQuestion();
}

function showQuestion() {
  const question = currentQuiz[currentQuestionIndex];
  const questionBox = document.getElementById("question-box");
  const optionsBox = document.getElementById("options-box");
  const nextBtn = document.getElementById("next-btn");

  questionBox.textContent = question.q;
  optionsBox.innerHTML = "";
  nextBtn.disabled = true;

  question.o.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = option;
    btn.onclick = () => selectOption(btn, index, question.a, nextBtn);
    optionsBox.appendChild(btn);
  });

  document.getElementById("progress").textContent = `Question ${currentQuestionIndex + 1} of 10`;
}

function selectOption(button, selectedIndex, correctIndex, nextBtn) {
  const options = document.querySelectorAll(".option-btn");
  options.forEach(opt => opt.classList.remove("selected"));
  button.classList.add("selected");

  if (selectedIndex === correctIndex) {
    score++;
  }

  nextBtn.disabled = false;
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < currentQuiz.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  document.getElementById("quiz-container").classList.remove("visible");
  document.getElementById("quiz-container").classList.add("hidden");
  document.getElementById("result-container").classList.remove("hidden");
  document.getElementById("result-container").classList.add("visible");

  const message = document.getElementById("score-message");
  message.textContent = `You scored ${score} out of 10 questions correctly!`;
}

function restartQuiz() {
  document.getElementById("result-container").classList.add("hidden");
  document.getElementById("topic-selection").classList.remove("hidden");
}
