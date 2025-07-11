// Quiz Data: 5 Topics, 10 Questions Each
const quizzes = {
  physics: [
    { q: "What is Newton's first law also known as?", o: ["Law of Gravity", "Law of Inertia", "Law of Motion", "Law of Energy"], a: 1 },
    { q: "What is the SI unit of force?", o: ["Watt", "Joule", "Newton", "Pascal"], a: 2 },
    { q: "Which travels faster: light or sound?", o: ["Light", "Sound", "Same speed", "Depends on medium"], a: 0 },
    { q: "What is the formula for kinetic energy?", o: ["mv²", "½mv²", "mgh", "F=ma"], a: 1 },
    { q: "Who discovered gravity?", o: ["Einstein", "Galileo", "Tesla", "Newton"], a: 3 },
    { q: "What is the acceleration due to gravity on Earth?", o: ["9.8 m/s²", "10 m/s²", "8.9 m/s²", "9.1 m/s²"], a: 0 },
    { q: "What does E=mc² mean?", o: ["Energy equals mass", "Energy equals mass times speed of light squared", "Mass equals velocity", "None"], a: 1 },
    { q: "What is the smallest particle of an element?", o: ["Molecule", "Atom", "Quark", "Neutron"], a: 1 },
    { q: "What is the force that opposes motion between surfaces?", o: ["Gravity", "Friction", "Tension", "Normal Force"], a: 1 },
    { q: "What is the unit of electric current?", o: ["Volt", "Ohm", "Ampere", "Watt"], a: 2 }
  ],
  chemistry: [
    { q: "What is H₂O commonly known as?", o: ["Salt", "Sugar", "Water", "Alcohol"], a: 2 },
    { q: "How many elements are in the periodic table?", o: ["100", "118", "120", "150"], a: 1 },
    { q: "What is the pH value of pure water?", o: ["5", "6", "7", "8"], a: 2 },
    { q: "Which gas do plants absorb from the atmosphere?", o: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], a: 2 },
    { q: "What is the main component of natural gas?", o: ["Ethane", "Propane", "Methane", "Butane"], a: 2 },
    { q: "Which acid is found in lemons?", o: ["Citric Acid", "Acetic Acid", "Sulfuric Acid", "Hydrochloric Acid"], a: 0 },
    { q: "What is the symbol for Gold?", o: ["Ag", "Au", "Fe", "Cu"], a: 1 },
    { q: "Which process turns liquid into gas?", o: ["Condensation", "Evaporation", "Freezing", "Melting"], a: 1 },
    { q: "What is the atomic number of Carbon?", o: ["4", "5", "6", "7"], a: 2 },
    { q: "What is rust chemically known as?", o: ["Iron Oxide", "Calcium Oxide", "Magnesium Oxide", "Sodium Oxide"], a: 0 }
  ],
  biology: [
    { q: "What is the powerhouse of the cell?", o: ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"], a: 1 },
    { q: "Which organ produces insulin?", o: ["Liver", "Kidney", "Pancreas", "Heart"], a: 2 },
    { q: "Which gas do humans inhale during respiration?", o: ["Carbon Dioxide", "Oxygen", "Nitrogen", "Hydrogen"], a: 1 },
    { q: "What is DNA made up of?", o: ["Cells", "Chromosomes", "Atoms", "Molecules"], a: 1 },
    { q: "What is the basic unit of life?", o: ["Organ", "Cell", "Tissue", "Organism"], a: 1 },
    { q: "Which part of the plant conducts photosynthesis?", o: ["Roots", "Stem", "Leaves", "Flower"], a: 2 },
    { q: "What is the largest organ in the human body?", o: ["Liver", "Skin", "Lungs", "Heart"], a: 1 },
    { q: "Which animal classification has a backbone?", o: ["Invertebrates", "Vertebrates", "Amphibians", "Reptiles"], a: 1 },
    { q: "What is the study of living organisms called?", o: ["Geology", "Biology", "Chemistry", "Physics"], a: 1 },
    { q: "Which blood cells help fight diseases?", o: ["Red Blood Cells", "White Blood Cells", "Platelets", "Plasma"], a: 1 }
  ],
  astronomy: [
    { q: "Which planet is known as the Red Planet?", o: ["Venus", "Mars", "Saturn", "Mercury"], a: 1 },
    { q: "Which galaxy do we live in?", o: ["Andromeda", "Whirlpool", "Milky Way", "Sombrero"], a: 2 },
    { q: "What is the hottest planet in our solar system?", o: ["Mercury", "Venus", "Mars", "Earth"], a: 1 },
    { q: "Which planet has the most moons?", o: ["Earth", "Saturn", "Jupiter", "Uranus"], a: 2 },
    { q: "What is a shooting star actually?", o: ["Planet", "Meteor", "Comet", "Star"], a: 1 },
    { q: "What causes tides on Earth?", o: ["Sun", "Moon", "Stars", "Wind"], a: 1 },
    { q: "What is the closest star to Earth?", o: ["Alpha Centauri", "Sirius", "The Sun", "Betelgeuse"], a: 2 },
    { q: "Which planet spins the fastest?", o: ["Earth", "Jupiter", "Saturn", "Venus"], a: 1 },
    { q: "What is the Great Red Spot on Jupiter?", o: ["Storm", "Volcano", "Lake", "Crater"], a: 0 },
    { q: "Which phase of the moon appears fully lit?", o: ["New Moon", "Crescent", "Gibbous", "Full Moon"], a: 3 }
  ],
  earth: [
    { q: "What is the outermost layer of the Earth called?", o: ["Core", "Mantle", "Crust", "Atmosphere"], a: 2 },
    { q: "Which natural disaster is measured using the Richter scale?", o: ["Hurricane", "Tornado", "Earthquake", "Flood"], a: 2 },
    { q: "What is the process by which rocks break down over time?", o: ["Erosion", "Weathering", "Deposition", "Sedimentation"], a: 1 },
    { q: "Which gas makes up most of Earth's atmosphere?", o: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"], a: 2 },
    { q: "What is the movement of sediment by wind or water called?", o: ["Weathering", "Erosion", "Melting", "Cracking"], a: 1 },
    { q: "Which layer of gases surrounding Earth called?", o: ["Hydrosphere", "Atmosphere", "Biosphere", "Lithosphere"], a: 1 },
    { q: "Which type of rock forms from cooled lava?", o: ["Metamorphic", "Sedimentary", "Igneous", "Granite"], a: 2 },
    { q: "Which natural resource comes from ancient plants and animals?", o: ["Soil", "Minerals", "Fossil Fuels", "Water"], a: 2 },
    { q: "What is the process of water turning into vapor called?", o: ["Condensation", "Precipitation", "Evaporation", "Runoff"], a: 2 },
    { q: "What is the largest freshwater lake in the world?", o: ["Lake Superior", "Lake Victoria", "Caspian Sea", "Lake Baikal"], a: 0 }
  ]
};

let currentTopic = '';
let currentQuiz = [];
let currentQuestionIndex = 0;
let score = 0;

// Start Quiz
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

// Show Current Question
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

// Handle Option Selection
function selectOption(button, selectedIndex, correctIndex, nextBtn) {
  const options = document.querySelectorAll(".option-btn");
  options.forEach(opt => opt.classList.remove("selected"));
  button.classList.add("selected");

  if (selectedIndex === correctIndex) {
    score++;
  }

  nextBtn.disabled = false;
}

// Go to Next Question
function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < currentQuiz.length) {
    showQuestion();
  } else {
    showResult();
  }
}

// Show Final Result
function showResult() {
  document.getElementById("quiz-container").classList.remove("visible");
  document.getElementById("quiz-container").classList.add("hidden");
  document.getElementById("result-container").classList.remove("hidden");
  document.getElementById("result-container").classList.add("visible");

  const message = document.getElementById("score-message");
  message.textContent = `You scored ${score} out of 10 questions correctly!`;
}

// Restart Quiz
function restartQuiz() {
  document.getElementById("result-container").classList.add("hidden");
  document.getElementById("topic-selection").classList.remove("hidden");
}
