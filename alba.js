document.addEventListener('DOMContentLoaded', function() {
    // Quiz Data
    const quizzes = {
        'solar-system': {
            title: 'Solar System Quiz',
            description: 'Test your knowledge about our cosmic neighborhood!',
            timeLimit: 180, // 3 minutes in seconds
            questions: [
                {
                    question: 'Which planet is known as the "Red Planet"?',
                    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
                    answer: 1,
                    fact: 'Mars appears red due to iron oxide (rust) on its surface.'
                },
                {
                    question: 'What is the largest planet in our solar system?',
                    options: ['Earth', 'Saturn', 'Jupiter', 'Neptune'],
                    answer: 2,
                    fact: 'Jupiter is more than twice as massive as all other planets combined.'
                },
                {
                    question: 'Which planet has the most extensive ring system?',
                    options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
                    answer: 1,
                    fact: "Saturn's rings are made mostly of ice particles with some rock debris."
                },
                {
                    question: 'What is the hottest planet in our solar system?',
                    options: ['Mercury', 'Venus', 'Earth', 'Mars'],
                    answer: 1,
                    fact: 'Despite being farther from the Sun, Venus has a thick atmosphere that traps heat.'
                },
                {
                    question: 'Which of these is NOT a moon of Jupiter?',
                    options: ['Europa', 'Titan', 'Ganymede', 'Callisto'],
                    answer: 1,
                    fact: 'Titan is actually Saturn\'s largest moon and has a thick atmosphere.'
                },
                {
                    question: 'What is the name of our galaxy?',
                    options: ['Andromeda', 'Milky Way', 'Sombrero', 'Whirlpool'],
                    answer: 1,
                    fact: 'The Milky Way is a barred spiral galaxy about 100,000 light-years across.'
                },
                {
                    question: 'Which planet has the shortest day?',
                    options: ['Mercury', 'Venus', 'Jupiter', 'Earth'],
                    answer: 2,
                    fact: 'Jupiter completes one rotation in about 10 hours, making its day the shortest.'
                },
                {
                    question: 'What is the Great Red Spot on Jupiter?',
                    options: ['A massive volcano', 'A giant storm', 'A large ocean', 'A huge crater'],
                    answer: 1,
                    fact: 'The Great Red Spot is a giant storm that has been raging for at least 400 years.'
                },
                {
                    question: 'Which planet is known for its extreme axial tilt?',
                    options: ['Mercury', 'Venus', 'Uranus', 'Neptune'],
                    answer: 2,
                    fact: 'Uranus rotates on its side with an axial tilt of about 98 degrees.'
                },
                {
                    question: 'What is the Kuiper Belt?',
                    options: [
                        'A region of asteroids between Mars and Jupiter',
                        'A disk of icy bodies beyond Neptune',
                        'A cloud of comets surrounding the solar system',
                        'A belt of radiation around Earth'
                    ],
                    answer: 1,
                    fact: 'The Kuiper Belt is home to Pluto and many other dwarf planets and icy objects.'
                }
            ]
        },
        'galaxies': {
            title: 'Galaxy Challenge',
            description: 'Prove your knowledge of galaxies and cosmic phenomena!',
            timeLimit: 240, // 4 minutes
            questions: [
                {
                    question: 'What type of galaxy is the Milky Way?',
                    options: ['Elliptical', 'Spiral', 'Irregular', 'Lenticular'],
                    answer: 1,
                    fact: 'The Milky Way is a barred spiral galaxy with a central bar-shaped structure.'
                },
                {
                    question: 'Which galaxy is on a collision course with the Milky Way?',
                    options: ['Andromeda', 'Triangulum', 'Whirlpool', 'Sombrero'],
                    answer: 0,
                    fact: 'The Andromeda Galaxy will collide with the Milky Way in about 4.5 billion years.'
                },
                {
                    question: 'What is at the center of most large galaxies?',
                    options: ['A massive star', 'A black hole', 'A neutron star', 'A quasar'],
                    answer: 1,
                    fact: 'Supermassive black holes exist at the centers of most galaxies, including ours.'
                },
                {
                    question: 'What are the Magellanic Clouds?',
                    options: [
                        'Two dwarf galaxies orbiting the Milky Way',
                        'Clouds of gas in the Orion Nebula',
                        'Interstellar dust clouds visible from Earth',
                        'Storm systems on Jupiter'
                    ],
                    answer: 0,
                    fact: 'The Large and Small Magellanic Clouds are satellite galaxies of the Milky Way.'
                },
                {
                    question: 'What is a quasar?',
                    options: [
                        'A type of neutron star',
                        'An extremely luminous active galactic nucleus',
                        'A cloud of star-forming gas',
                        'A failed star'
                    ],
                    answer: 1,
                    fact: 'Quasars are powered by supermassive black holes consuming material.'
                },
                {
                    question: 'Which of these is NOT a galaxy classification?',
                    options: ['Spiral', 'Elliptical', 'Irregular', 'Hyperbolic'],
                    answer: 3,
                    fact: 'The main galaxy types are spiral, elliptical, and irregular.'
                },
                {
                    question: 'What causes the spiral arms in spiral galaxies?',
                    options: [
                        'Density waves of stars and gas',
                        'Magnetic fields',
                        'Black hole jets',
                        'Dark matter concentrations'
                    ],
                    answer: 0,
                    fact: 'Spiral arms are density waves that move through the galactic disk.'
                },
                {
                    question: 'What is the name of our local group of galaxies?',
                    options: ['Virgo Cluster', 'Local Group', 'Orion Arm', 'Milky Way Group'],
                    answer: 1,
                    fact: 'The Local Group contains about 54 galaxies, including the Milky Way and Andromeda.'
                },
                {
                    question: 'What is a starburst galaxy?',
                    options: [
                        'A galaxy with an unusually high rate of star formation',
                        'A galaxy going supernova',
                        'A galaxy colliding with another galaxy',
                        'A galaxy with an active black hole'
                    ],
                    answer: 0,
                    fact: 'Starburst galaxies can form stars 100 times faster than normal galaxies.'
                },
                {
                    question: 'What is dark matter\'s role in galaxies?',
                    options: [
                        'It provides the gravity that holds galaxies together',
                        'It emits light we can\'t see',
                        'It forms the stars in galaxies',
                        'It creates black holes'
                    ],
                    answer: 0,
                    fact: 'Dark matter makes up about 85% of the matter in the universe.'
                }
            ]
        },
        'astronomy-history': {
            title: 'Astronomy History',
            description: 'Test your knowledge of astronomical discoveries and history!',
            timeLimit: 180, // 3 minutes
            questions: [
                {
                    question: 'Who first proposed the heliocentric model of the solar system?',
                    options: ['Galileo Galilei', 'Isaac Newton', 'Nicolaus Copernicus', 'Johannes Kepler'],
                    answer: 2,
                    fact: 'Copernicus published his heliocentric theory in 1543, though Aristarchus had the idea much earlier.'
                },
                {
                    question: 'Which astronomer discovered the four largest moons of Jupiter?',
                    options: ['Tycho Brahe', 'Galileo Galilei', 'Johannes Kepler', 'Edwin Hubble'],
                    answer: 1,
                    fact: 'Galileo discovered Io, Europa, Ganymede, and Callisto in 1610.'
                },
                {
                    question: 'What did Edwin Hubble discover in 1929?',
                    options: [
                        'The expansion of the universe',
                        'The first exoplanet',
                        'The structure of DNA',
                        'Black holes'
                    ],
                    answer: 0,
                    fact: 'Hubble discovered that galaxies are moving away from us, showing the universe is expanding.'
                },
                {
                    question: 'Who first calculated the circumference of the Earth?',
                    options: ['Ptolemy', 'Aristotle', 'Eratosthenes', 'Archimedes'],
                    answer: 2,
                    fact: 'Eratosthenes calculated Earth\'s circumference around 240 BCE using shadows in Egypt.'
                },
                {
                    question: 'Which space telescope was launched in 1990 and revolutionized astronomy?',
                    options: ['Chandra', 'Spitzer', 'Hubble', 'James Webb'],
                    answer: 2,
                    fact: 'The Hubble Space Telescope has provided incredible images and data for over 30 years.'
                },
                {
                    question: 'Who first described the laws of planetary motion?',
                    options: ['Galileo Galilei', 'Isaac Newton', 'Johannes Kepler', 'Tycho Brahe'],
                    answer: 2,
                    fact: 'Kepler\'s three laws describe how planets orbit the Sun.'
                },
                {
                    question: 'What was the first artificial satellite launched into space?',
                    options: ['Explorer 1', 'Sputnik 1', 'Vanguard 1', 'Telstar 1'],
                    answer: 1,
                    fact: 'The Soviet Union launched Sputnik 1 on October 4, 1957, starting the Space Age.'
                },
                {
                    question: 'Who was the first woman to fly in space?',
                    options: ['Sally Ride', 'Valentina Tereshkova', 'Mae Jemison', 'Christa McAuliffe'],
                    answer: 1,
                    fact: 'Valentina Tereshkova flew aboard Vostok 6 in 1963.'
                },
                {
                    question: 'What was the name of the first human spaceflight program?',
                    options: ['Mercury', 'Gemini', 'Apollo', 'Vostok'],
                    answer: 3,
                    fact: 'The Soviet Vostok program launched Yuri Gagarin, the first human in space.'
                },
                {
                    question: 'Which mission first landed humans on the Moon?',
                    options: ['Apollo 8', 'Apollo 11', 'Apollo 13', 'Gemini 4'],
                    answer: 1,
                    fact: 'Apollo 11 landed Neil Armstrong and Buzz Aldrin on the Moon on July 20, 1969.'
                }
            ]
        },
        'space-tech': {
            title: 'Space Technology',
            description: 'How much do you know about space exploration technology?',
            timeLimit: 210, // 3.5 minutes
            questions: [
                {
                    question: 'What is the main advantage of a multistage rocket?',
                    options: [
                        'It can carry more fuel',
                        'It reduces weight as empty stages are discarded',
                        'It provides backup engines',
                        'It allows for horizontal takeoff'
                    ],
                    answer: 1,
                    fact: 'Dropping empty stages makes the remaining rocket lighter and more efficient.'
                },
                {
                    question: 'What is the purpose of a heat shield on a spacecraft?',
                    options: [
                        'To protect against solar radiation',
                        'To prevent overheating during re-entry',
                        'To store extra fuel',
                        'To provide structural support'
                    ],
                    answer: 1,
                    fact: 'Heat shields protect spacecraft from extreme heat during atmospheric re-entry.'
                },
                {
                    question: 'Which type of rocket engine doesn\'t need atmospheric oxygen?',
                    options: ['Jet engine', 'Ramjet', 'Scramjet', 'Rocket engine'],
                    answer: 3,
                    fact: 'Rocket engines carry their own oxidizer and can work in space.'
                },
                {
                    question: 'What is the primary purpose of a space telescope?',
                    options: [
                        'To avoid atmospheric distortion',
                        'To get closer to stars',
                        'To see different wavelengths',
                        'To communicate with aliens'
                    ],
                    answer: 0,
                    fact: 'Space telescopes avoid atmospheric blurring and light pollution.'
                },
                {
                    question: 'What technology do GPS satellites rely on?',
                    options: ['Atomic clocks', 'Solar sails', 'Ion drives', 'Nuclear power'],
                    answer: 0,
                    fact: 'Extremely precise atomic clocks enable GPS positioning accuracy.'
                },
                {
                    question: 'What is ion propulsion?',
                    options: [
                        'A method of accelerating ions for thrust',
                        'A type of nuclear propulsion',
                        'A way to generate electricity in space',
                        'A technique for cooling spacecraft'
                    ],
                    answer: 0,
                    fact: 'Ion drives accelerate ions electrically for efficient but low-thrust propulsion.'
                },
                {
                    question: 'What is the purpose of reaction wheels on satellites?',
                    options: [
                        'To generate electricity',
                        'To stabilize and orient the spacecraft',
                        'To provide backup propulsion',
                        'To store data'
                    ],
                    answer: 1,
                    fact: 'Reaction wheels help control spacecraft orientation without using fuel.'
                },
                {
                    question: 'What material is commonly used for spacecraft heat shields?',
                    options: ['Steel', 'Aluminum', 'Carbon fiber', 'Ablative material'],
                    answer: 3,
                    fact: 'Ablative materials absorb heat by slowly burning away.'
                },
                {
                    question: 'What is the main advantage of solar sails?',
                    options: [
                        'They provide unlimited power',
                        'They don\'t require propellant',
                        'They work better in atmosphere',
                        'They can travel faster than light'
                    ],
                    answer: 1,
                    fact: 'Solar sails use photon pressure from sunlight for propulsion.'
                },
                {
                    question: 'What is the purpose of the International Space Station?',
                    options: [
                        'To serve as a space hotel',
                        'To conduct scientific research in microgravity',
                        'To launch missions to Mars',
                        'To monitor Earth\'s weather'
                    ],
                    answer: 1,
                    fact: 'The ISS is primarily a microgravity research laboratory.'
                }
            ]
        },
        'exoplanets': {
            title: 'Exoplanets Explorer',
            description: 'Discover how much you know about planets beyond our solar system!',
            timeLimit: 240, // 4 minutes
            questions: [
                {
                    question: 'What was the first confirmed exoplanet discovered around a sun-like star?',
                    options: ['51 Pegasi b', 'Kepler-186f', 'TRAPPIST-1e', 'Proxima Centauri b'],
                    answer: 0,
                    fact: '51 Pegasi b, discovered in 1995, is a hot Jupiter orbiting very close to its star.'
                },
                {
                    question: 'Which method has discovered the most exoplanets?',
                    options: ['Direct imaging', 'Radial velocity', 'Transit', 'Gravitational microlensing'],
                    answer: 2,
                    fact: 'The transit method, used by Kepler and TESS, has found thousands of exoplanets.'
                },
                {
                    question: 'What is the habitable zone of a star?',
                    options: [
                        'Where liquid water could exist on a planet\'s surface',
                        'Where planets can maintain atmospheres',
                        'Where life definitely exists',
                        'Where planets are tidally locked'
                    ],
                    answer: 0,
                    fact: 'The habitable zone is the distance range where temperatures allow liquid water.'
                },
                {
                    question: 'What is a "super-Earth"?',
                    options: [
                        'An Earth-like planet with more gravity',
                        'An Earth-sized planet with life',
                        'A planet larger than Earth but smaller than Neptune',
                        'A planet with a supercontinent'
                    ],
                    answer: 2,
                    fact: 'Super-Earths are between 1-10 Earth masses, common in other solar systems.'
                },
                {
                    question: 'Which exoplanet system has seven Earth-sized planets?',
                    options: ['Kepler-90', 'TRAPPIST-1', 'Proxima Centauri', 'HD 10180'],
                    answer: 1,
                    fact: 'TRAPPIST-1 has seven planets, three in the habitable zone.'
                },
                {
                    question: 'What is a "hot Jupiter"?',
                    options: [
                        'A large planet very close to its star',
                        'A Jupiter-like planet with high temperatures',
                        'A young Jupiter still contracting',
                        'A Jupiter-sized star'
                    ],
                    answer: 0,
                    fact: 'Hot Jupiters orbit very close to their stars with short orbital periods.'
                },
                {
                    question: 'Which space telescope was specifically designed to find exoplanets?',
                    options: ['Hubble', 'Kepler', 'Chandra', 'Spitzer'],
                    answer: 1,
                    fact: 'Kepler discovered over 2,600 confirmed exoplanets using the transit method.'
                },
                {
                    question: 'What is the closest known exoplanet to Earth?',
                    options: ['Proxima Centauri b', 'Barnard\'s Star b', 'Wolf 359 b', 'Sirius b'],
                    answer: 0,
                    fact: 'Proxima Centauri b orbits the closest star to the Sun at 4.24 light-years away.'
                },
                {
                    question: 'What is the transit method of detecting exoplanets?',
                    options: [
                        'Measuring a star\'s wobble from planet gravity',
                        'Detecting light reflected by the planet',
                        'Observing a star dim as a planet passes in front',
                        'Seeing the planet directly'
                    ],
                    answer: 2,
                    fact: 'The transit method measures periodic dips in a star\'s brightness.'
                },
                {
                    question: 'What is the "Goldilocks zone" another name for?',
                    options: [
                        'The asteroid belt',
                        'The habitable zone',
                        'The region where gas giants form',
                        'The area around a black hole'
                    ],
                    answer: 1,
                    fact: 'The Goldilocks zone is where conditions are "just right" for liquid water.'
                }
            ]
        }
    };

    // DOM Elements
    const quizCards = document.querySelectorAll('.quiz-card');
    const quizModal = document.getElementById('quizModal');
    const resultsModal = document.getElementById('resultsModal');
    const quizTitleElement = document.getElementById('quizTitle');
    const questionTextElement = document.querySelector('.question-text');
    const optionsContainer = document.querySelector('.options-container');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    const scoreValue = document.querySelector('.score-value');
    const totalQuestions = document.querySelector('.total-questions');
    const feedbackContainer = document.querySelector('.quiz-feedback');
    const feedbackText = document.querySelector('.feedback-text');
    const factText = document.querySelector('.fact-text');
    const correctIcon = document.querySelector('.correct-icon');
    const incorrectIcon = document.querySelector('.incorrect-icon');
    const nextBtn = document.querySelector('.next-btn');
    const closeModalBtn = document.querySelector('.close-modal');
    const finalScoreElement = document.querySelector('.final-score');
    const finalTotalElement = document.querySelector('.final-total');
    const scorePercentElement = document.querySelector('.score-percent');
    const resultsMessageElement = document.querySelector('.results-message');
    const badgeTextElement = document.querySelector('.badge-text');
    const retryBtn = document.querySelector('.retry-btn');
    const quitBtn = document.querySelector('.quit-btn');
    const circleFill = document.querySelector('.circle-fill');
    const timerElement = document.querySelector('.timer');
    const timeLeftElement = document.querySelector('.time-left');

    // Quiz Variables
    let currentQuiz = null;
    let currentQuestionIndex = 0;
    let score = 0;
    let selectedOption = null;
    let timerInterval = null;
    let timeLeft = 0;

    // Event Listeners
    quizCards.forEach(card => {
        const front = card.querySelector('.quiz-card-front');
        const back = card.querySelector('.quiz-card-back');
        const startBtn = front.querySelector('.start-btn');
        const flipBackBtn = back.querySelector('.flip-back-btn');

        // Flip card on click
        front.addEventListener('click', (e) => {
            if (!e.target.classList.contains('start-btn')) {
                card.classList.add('flipped');
            }
        });

        flipBackBtn.addEventListener('click', () => {
            card.classList.remove('flipped');
        });

        // Start quiz
        startBtn.addEventListener('click', () => {
            const quizId = card.getAttribute('data-quiz');
            startQuiz(quizId);
        });
    });

    nextBtn.addEventListener('click', showNextQuestion);
    closeModalBtn.addEventListener('click', closeQuizModal);
    retryBtn.addEventListener('click', retryQuiz);
    quitBtn.addEventListener('click', closeResultsModal);

    // Start Quiz Function
    function startQuiz(quizId) {
        currentQuiz = quizzes[quizId];
        currentQuestionIndex = 0;
        score = 0;
        timeLeft = currentQuiz.timeLimit;

        // Update modal with quiz info
        quizTitleElement.textContent = currentQuiz.title;
        totalQuestions.textContent = currentQuiz.questions.length;
        scoreValue.textContent = score;

        // Show first question
        showQuestion();
        quizModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Start timer
  // Global timer variables
let quizTimeLeft; // Time remaining for the whole quiz
let quizTimerInterval;
const totalQuizTime = 300; // 5 minutes for the whole quiz (adjust as needed)

// Initialize quiz timer (call this when quiz starts)
function initQuizTimer() {
    quizTimeLeft = totalQuizTime;
    startQuizTimer();
}

// Start the quiz timer
function startQuizTimer() {
    updateQuizTimerDisplay();
    quizTimerInterval = setInterval(() => {
        quizTimeLeft--;
        updateQuizTimerDisplay();
        
        if (quizTimeLeft <= 0) {
            clearInterval(quizTimerInterval);
            quizTimeUp();
        }
    }, 1000);
}

function updateQuizTimerDisplay() {
    const minutes = Math.floor(quizTimeLeft / 60);
    const seconds = quizTimeLeft % 60;
    timeLeftElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    
    // Visual warnings when time is running low
    if (quizTimeLeft <= 30) {
        timerElement.classList.add('warning');
    } else {
        timerElement.classList.remove('warning');
    }
    
    if (quizTimeLeft <= 10) {
        timerElement.classList.add('danger');
    } else {
        timerElement.classList.remove('danger');
    }
}

function quizTimeUp() {
    // Disable all interactive elements
    document.querySelectorAll('.option-btn, .next-btn').forEach(btn => {
        btn.disabled = true;
    });
    
    // Show time up message
    feedbackContainer.style.display = 'block';
    correctIcon.style.display = 'none';
    incorrectIcon.style.display = 'block';
    feedbackText.textContent = 'Quiz Complete!';
    factText.textContent = 'Time has expired. Your quiz will be submitted.';
    
    // Hide next button and show submit button
    nextBtn.style.display = 'none';
    submitBtn.style.display = 'block';
    
    // Automatically submit after 3 seconds (optional)
    setTimeout(submitQuiz, 3000);
}

// Call this when user manually submits quiz
function stopQuizTimer() {
    clearInterval(quizTimerInterval);
}

// Your quiz submission function
function submitQuiz() {
    // Calculate score, show results, etc.
    // ...
    showQuizResults();
}

// Example CSS for timer warnings (add to your stylesheet)
/*
.warning {
    color: orange;
    font-weight: bold;
}
.danger {
    color: red;
    animation: pulse 0.5s infinite alternate;
}
@keyframes pulse {
    from { opacity: 1; }
    to { opacity: 0.5; }
}
*/

    // Show Question Function
    function showQuestion() {
        const question = currentQuiz.questions[currentQuestionIndex];
        
        // Update progress
        const progressPercent = ((currentQuestionIndex) / currentQuiz.questions.length) * 100;
        progressFill.style.width = `${progressPercent}%`;
        progressText.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuiz.questions.length}`;

        // Update question text
        questionTextElement.textContent = question.question;

        // Clear previous options
        optionsContainer.innerHTML = '';

        // Add new options
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('button');
            optionElement.classList.add('option-btn');
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => selectOption(optionElement, index));
            optionsContainer.appendChild(optionElement);
        });

        // Hide feedback and reset next button
        feedbackContainer.style.display = 'none';
        nextBtn.style.display = 'none';
        selectedOption = null;
    }

    // Select Option Function
    function selectOption(optionElement, optionIndex) {
        if (selectedOption !== null) return;

        selectedOption = optionIndex;
        const question = currentQuiz.questions[currentQuestionIndex];

        // Disable all options
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.disabled = true;
        });

        // Check if answer is correct
        const isCorrect = optionIndex === question.answer;

        // Update UI based on answer
        if (isCorrect) {
            optionElement.classList.add('correct');
            score++;
            scoreValue.textContent = score;
            showFeedback(true, question.fact);
        } else {
            optionElement.classList.add('incorrect');
            // Highlight correct answer
            document.querySelectorAll('.option-btn')[question.answer].classList.add('correct');
            showFeedback(false, question.fact);
        }
    }

    // Show Feedback Function
    function showFeedback(isCorrect, fact) {
        feedbackContainer.style.display = 'block';
        
        if (isCorrect) {
            correctIcon.style.display = 'block';
            incorrectIcon.style.display = 'none';
            feedbackText.textContent = 'Correct! Well done!';
        } else {
            correctIcon.style.display = 'none';
            incorrectIcon.style.display = 'block';
            feedbackText.textContent = 'Incorrect! Better luck next time.';
        }

        factText.textContent = fact;
        nextBtn.style.display = 'block';
    }

    // Show Next Question Function
    function showNextQuestion() {
        currentQuestionIndex++;
        
        if (currentQuestionIndex < currentQuiz.questions.length) {
            showQuestion();
        } else {
            showResults();
        }
    }

    // Show Results Function
    function showResults() {
        clearInterval(timerInterval);
        closeQuizModal();
        
        const percentage = Math.round((score / currentQuiz.questions.length) * 100);
        finalScoreElement.textContent = score;
        finalTotalElement.textContent = currentQuiz.questions.length;
        scorePercentElement.textContent = `${percentage}%`;
        
        // Animate the circle fill
        const circumference = 2 * Math.PI * 40; // Assuming radius of 40
        const dashOffset = circumference - (percentage / 100) * circumference;
        circleFill.style.strokeDasharray = `${circumference} ${circumference}`;
        circleFill.style.strokeDashoffset = circumference;
        
        // Trigger the animation
        setTimeout(() => {
            circleFill.style.strokeDashoffset = dashOffset;
        }, 100);
        
        // Set results message based on score
        let message = '';
        let badge = '';
        
        if (percentage >= 90) {
            message = 'Outstanding! You\'re a true astronomy expert!';
            badge = 'Cosmic Genius';
        } else if (percentage >= 70) {
            message = 'Great job! You know your space facts well!';
            badge = 'Stellar Explorer';
        } else if (percentage >= 50) {
            message = 'Good effort! Keep learning about the universe!';
            badge = 'Space Cadet';
        } else {
            message = 'Keep exploring! The universe is full of wonders to discover!';
            badge = 'Rookie Astronomer';
        }
        
        resultsMessageElement.textContent = message;
        badgeTextElement.textContent = badge;
        
        resultsModal.style.display = 'flex';
    }

    // Close Quiz Modal Function
    function closeQuizModal() {
        clearInterval(timerInterval);
        quizModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Close Results Modal Function
    function closeResultsModal() {
        resultsModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Retry Quiz Function
    function retryQuiz() {
        closeResultsModal();
        startQuiz(Object.keys(quizzes).find(key => quizzes[key].title === currentQuiz.title));
    }

    // Flip Card Animation
    document.querySelectorAll('.quiz-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('start-btn') && !e.target.classList.contains('flip-back-btn')) {
                this.classList.toggle('flipped');
            }
        });
    });
});
