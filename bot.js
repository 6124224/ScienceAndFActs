document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotWindow = document.querySelector('.chatbot-window');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatbotMessages = document.querySelector('.chatbot-messages');
    const chatbotInput = document.querySelector('.chatbot-input');
    const chatbotSend = document.querySelector('.chatbot-send');
    const chatbotVoice = document.querySelector('.chatbot-voice');
    const themeToggle = document.querySelector('.chatbot-theme-toggle');
    const ttsToggle = document.querySelector('.chatbot-tts-toggle');
    
    // Enhanced State Management
    let isListening = false;
    let ttsEnabled = false; // Start with TTS disabled
    let darkMode = false;
    let recognition;
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let conversationHistory = [];
    let currentTopic = null;
    let userProfile = {
        preferredTopics: [],
        knowledgeLevel: 'beginner',
        previousQuestions: []
    };
    let isFirstVisit = true;
    let hasShownIntroduction = false;

    const MAX_HISTORY_LENGTH = 20;
    const TYPING_DELAY = 1500;
    const INTRODUCTION_DELAY = 2000;

    // Enhanced API Configuration
    const API_CONFIG = {
        scienceAndFacts: {
            baseUrl: 'https://6124224.github.io/ScienceAndFActs/',
            topics: {
                quantum: '#quantum-physics',
                space: '#space-exploration', 
                chemistry: '#chemistry-wonders',
                biology: '#biology-marvels',
                physics: '#physics-fundamentals'
            }
        },
        wikipedia: {
            endpoint: 'https://en.wikipedia.org/api/rest_v1/page/summary/',
            searchEndpoint: 'https://en.wikipedia.org/w/api.php?action=opensearch&search='
        },
        nasa: {
            apod: 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY',
            imageLibrary: 'https://images-api.nasa.gov/search'
        }
    };

    // Comprehensive Science Knowledge Base with Enhanced NLP
    const ENHANCED_KNOWLEDGE_BASE = {
        // Physics Topics
        quantum: {
            keywords: ['quantum', 'qubit', 'superposition', 'entanglement', 'heisenberg', 'uncertainty', 'wave function', 'particle', 'photon', 'electron', 'quantum mechanics', 'quantum physics', 'quantum computing', 'quantum field', 'schrodinger'],
            definition: "🔬 **Quantum Physics** explores the mysterious behavior of matter and energy at the smallest scales in the universe.",
            explanation: "Quantum physics reveals that particles can exist in multiple states simultaneously (superposition), be instantly connected across vast distances (entanglement), and behave both as particles and waves. This strange quantum world forms the foundation of modern technology like lasers, MRI machines, and quantum computers.",
            examples: [
                "Schrödinger's cat demonstrates quantum superposition",
                "Quantum tunneling allows particles to pass through barriers",
                "Quantum entanglement enables 'spooky action at a distance'"
            ],
            applications: ["Quantum computing", "Quantum cryptography", "Laser technology", "MRI scanners"],
            funFacts: [
                "Quantum tunneling is essential for the sun's nuclear fusion",
                "Your smartphone uses quantum effects in its transistors",
                "Quantum computers could break current encryption methods"
            ],
            level: 'advanced',
            related: ['particle physics', 'atomic structure', 'wave-particle duality', 'uncertainty principle']
        },

        space: {
            keywords: ['space', 'universe', 'galaxy', 'star', 'planet', 'solar system', 'astronomy', 'cosmology', 'nasa', 'rocket', 'satellite', 'mars', 'moon', 'black hole', 'nebula', 'asteroid', 'comet'],
            definition: "🚀 **Space Exploration** is humanity's quest to understand and explore the cosmos beyond Earth.",
            explanation: "Space exploration combines cutting-edge technology with scientific curiosity to study planets, stars, galaxies, and the fundamental nature of the universe. From the first satellites to Mars rovers and the James Webb Space Telescope, we continue pushing the boundaries of human knowledge.",
            examples: [
                "The Hubble Space Telescope has observed galaxies 13 billion light-years away",
                "Mars rovers have found evidence of ancient water on the Red Planet",
                "The Voyager probes have traveled beyond our solar system"
            ],
            applications: ["Satellite communications", "Weather forecasting", "GPS navigation", "Medical imaging"],
            funFacts: [
                "One day on Venus is longer than its year",
                "Jupiter's Great Red Spot is a storm larger than Earth",
                "A teaspoon of neutron star material would weigh 6 billion tons"
            ],
            level: 'intermediate',
            related: ['astronomy', 'astrophysics', 'cosmology', 'planetary science']
        },

        chemistry: {
            keywords: ['chemistry', 'chemical', 'reaction', 'molecule', 'atom', 'element', 'compound', 'periodic table', 'bond', 'acid', 'base', 'organic', 'inorganic', 'catalyst', 'enzyme', 'ph', 'oxidation', 'reduction'],
            definition: "⚗️ **Chemistry** is the science of matter, its properties, composition, structure, and the changes it undergoes.",
            explanation: "Chemistry bridges physics and biology, explaining how atoms combine to form molecules, how chemical reactions occur, and how these processes drive everything from digestion to photosynthesis. It's the central science that connects the physical and biological worlds.",
            examples: [
                "Photosynthesis converts CO₂ and water into glucose using sunlight",
                "Enzymes catalyze biochemical reactions in living organisms",
                "The pH scale measures acidity from 0 (very acidic) to 14 (very basic)"
            ],
            applications: ["Pharmaceutical development", "Materials science", "Food preservation", "Environmental cleanup"],
            funFacts: [
                "Diamond and graphite are both pure carbon but with different structures",
                "Water expands when it freezes, unlike most substances",
                "The human body contains about 60 chemical elements"
            ],
            level: 'intermediate',
            related: ['biochemistry', 'molecular biology', 'materials science', 'pharmacology']
        },

        biology: {
            keywords: ['biology', 'life', 'cell', 'dna', 'gene', 'evolution', 'ecosystem', 'organism', 'bacteria', 'virus', 'protein', 'enzyme', 'photosynthesis', 'respiration', 'genetics', 'chromosome', 'mutation', 'species'],
            definition: "🧬 **Biology** is the scientific study of life and living organisms.",
            explanation: "Biology explores the incredible diversity of life on Earth, from microscopic bacteria to giant sequoias, from simple single-celled organisms to complex humans. It reveals how life works at molecular, cellular, and ecosystem levels.",
            examples: [
                "DNA contains the genetic instructions for all living things",
                "Mitochondria are the powerhouses of cells, producing ATP energy",
                "Evolution explains the diversity of life through natural selection"
            ],
            applications: ["Medicine and healthcare", "Agriculture and food production", "Biotechnology", "Conservation biology"],
            funFacts: [
                "Humans share about 50% of their DNA with bananas",
                "Your body contains more bacterial cells than human cells",
                "The human brain has about 86 billion neurons"
            ],
            level: 'intermediate',
            related: ['genetics', 'ecology', 'microbiology', 'biochemistry']
        },

        physics: {
            keywords: ['physics', 'force', 'energy', 'motion', 'gravity', 'electricity', 'magnetism', 'light', 'sound', 'heat', 'temperature', 'pressure', 'mechanics', 'thermodynamics', 'electromagnetism', 'relativity', 'newton', 'einstein'],
            definition: "🌌 **Physics** is the fundamental science that studies matter, energy, and their interactions.",
            explanation: "Physics seeks to understand how the universe works at its most basic level. From the smallest subatomic particles to the largest structures in the cosmos, physics provides the mathematical framework for describing natural phenomena.",
            examples: [
                "Newton's laws describe how objects move and interact",
                "Einstein's relativity shows that time and space are connected",
                "Thermodynamics explains how heat and energy flow"
            ],
            applications: ["Engineering and technology", "Computer science", "Medical devices", "Energy production"],
            funFacts: [
                "Light travels at 299,792,458 meters per second in a vacuum",
                "Absolute zero (-273.15°C) is the coldest possible temperature",
                "Time passes more slowly in strong gravitational fields"
            ],
            level: 'intermediate',
            related: ['mechanics', 'thermodynamics', 'electromagnetism', 'quantum physics']
        },

        // Additional specialized topics
        dna: {
            keywords: ['dna', 'genetic', 'gene', 'chromosome', 'nucleotide', 'base pair', 'double helix', 'watson', 'crick', 'genome', 'mutation', 'inheritance', 'heredity'],
            definition: "🧬 **DNA** (Deoxyribonucleic acid) is the molecule that carries genetic instructions in living organisms.",
            explanation: "DNA is like a biological instruction manual written in a four-letter alphabet (A, T, G, C). This double helix structure contains all the information needed to build and maintain life, passed from parents to offspring.",
            examples: [
                "Human DNA contains about 3 billion base pairs",
                "DNA fingerprinting can identify individuals uniquely",
                "CRISPR technology allows precise DNA editing"
            ],
            level: 'intermediate',
            related: ['genetics', 'biology', 'evolution', 'biotechnology']
        },

        blackhole: {
            keywords: ['black hole', 'blackhole', 'event horizon', 'singularity', 'gravity', 'hawking radiation', 'spacetime', 'relativity'],
            definition: "🌑 **Black Holes** are regions of spacetime where gravity is so strong that nothing, not even light, can escape.",
            explanation: "Black holes form when massive stars collapse, creating a point of infinite density called a singularity. They warp spacetime so severely that they create an event horizon - a point of no return.",
            examples: [
                "Sagittarius A* is the supermassive black hole at our galaxy's center",
                "The Event Horizon Telescope captured the first image of a black hole in 2019",
                "Hawking radiation suggests black holes slowly evaporate over time"
            ],
            level: 'advanced',
            related: ['astronomy', 'relativity', 'spacetime', 'gravity']
        }
    };

    // Enhanced Natural Language Processing
    const NLP_PATTERNS = {
        question_words: ['what', 'how', 'why', 'when', 'where', 'which', 'who'],
        greeting_patterns: /\b(hello|hi|hey|greetings|good morning|good afternoon|good evening)\b/i,
        thanks_patterns: /\b(thank|thanks|appreciate|grateful)\b/i,
        explanation_requests: /\b(explain|describe|tell me about|what is|how does|define)\b/i,
        curiosity_patterns: /\b(interesting|fascinating|amazing|wow|cool|awesome)\b/i,
        confusion_patterns: /\b(confused|don't understand|unclear|complex|difficult)\b/i,
        help_patterns: /\b(help|assist|support|guide)\b/i
    };

    // Conversational Response Templates
    const RESPONSE_TEMPLATES = {
        greetings: [
            "Hello! I'm your AI Science Guide. What fascinating topic would you like to explore today?",
            "Hi there! Ready to dive into the amazing world of science?",
            "Greetings, curious mind! What scientific mystery shall we unravel together?",
            "Welcome! I'm here to make science accessible and exciting. What interests you?"
        ],
        thanks: [
            "You're very welcome! Science is even more fun when shared. What else would you like to discover?",
            "My pleasure! Keep that curiosity flowing - what's your next question?",
            "Happy to help! The universe is full of wonders waiting to be explored."
        ],
        encouragement: [
            "That's a fantastic question! Let me break it down for you:",
            "Great curiosity! Here's what science tells us:",
            "Excellent thinking! This is a really important concept:",
            "I love that you're asking about this! Here's the fascinating answer:"
        ],
        confusion_help: [
            "No worries! Let me explain it in simpler terms:",
            "I understand this can be complex. Let me break it down step by step:",
            "That's totally normal to find this confusing! Here's a clearer explanation:"
        ],
        topic_transitions: [
            "Speaking of that, you might also be interested in:",
            "This connects beautifully to another fascinating topic:",
            "Since you're curious about this, here's something related that might amaze you:"
        ]
    };

    // Initialize Enhanced Chatbot
    function initChatbot() {
        setupEventListeners();
        loadUserPreferences();
        initSpeechRecognition();
        positionChatbotToggle();
        
        // Check if this is the first visit
        if (!localStorage.getItem('chatbotVisited')) {
            localStorage.setItem('chatbotVisited', 'true');
            scheduleIntroduction();
        }
    }

    function positionChatbotToggle() {
        if (chatbotToggle) {
            chatbotToggle.style.bottom = '70px';
            chatbotToggle.style.right = '20px';
        }
    }

    function loadUserPreferences() {
        darkMode = localStorage.getItem('chatbotDarkMode') === 'true';
        ttsEnabled = localStorage.getItem('chatbotTTS') === 'true';
        
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            userProfile = {...userProfile, ...JSON.parse(savedProfile)};
        }
        
        applyTheme();
        updateTTSButton();
    }

    function applyTheme() {
        if (darkMode && chatbotWindow) {
            chatbotWindow.classList.add('dark-mode');
            if (themeToggle) themeToggle.innerHTML = '☀️';
        }
    }

    function updateTTSButton() {
        if (ttsToggle) {
            ttsToggle.innerHTML = ttsEnabled ? '🔊' : '🔇';
        }
    }

    function scheduleIntroduction() {
        setTimeout(() => {
            if (!hasShownIntroduction) {
                showPersonalizedIntroduction();
                hasShownIntroduction = true;
            }
        }, INTRODUCTION_DELAY);
    }

    function showPersonalizedIntroduction() {
        const introMessage = `🌟 **Welcome to ScienceAndFacts!** 

I'm your AI Science Guide, here to make complex scientific concepts accessible and exciting! 

🔬 **I can help you with:**
• Quantum physics and advanced theories
• Space exploration and astronomy  
• Chemistry and molecular science
• Biology and life sciences
• Physics fundamentals
• Current scientific discoveries

🎯 **Try asking me:**
• "Explain quantum entanglement simply"
• "What's fascinating about black holes?"
• "How does photosynthesis work?"
• "Tell me about recent space discoveries"

Ready to explore the wonders of science together? What interests you most?`;

        setTimeout(() => {
            addBotMessage(introMessage);
        }, 500);
    }

    function setupEventListeners() {
        if (chatbotToggle) chatbotToggle.addEventListener('click', toggleChatbotWindow);
        if (chatbotClose) chatbotClose.addEventListener('click', toggleChatbotWindow);
        if (chatbotSend) chatbotSend.addEventListener('click', sendMessage);
        if (chatbotInput) {
            chatbotInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    sendMessage();
                }
            });
        }
        if (chatbotVoice) chatbotVoice.addEventListener('click', toggleVoiceRecognition);
        if (themeToggle) themeToggle.addEventListener('click', toggleDarkMode);
        if (ttsToggle) ttsToggle.addEventListener('click', toggleTTS);
        
        initDragAndDrop();
    }

    function toggleChatbotWindow() {
        if (!chatbotWindow) return;
        
        const isVisible = chatbotWindow.style.display === 'flex';
        chatbotWindow.style.display = isVisible ? 'none' : 'flex';
        
        if (chatbotToggle) {
            chatbotToggle.innerHTML = isVisible ? '🤖' : '✕';
        }
        
        if (!isVisible) {
            setTimeout(() => {
                scrollToBottom();
                if (chatbotInput) chatbotInput.focus();
            }, 100);
            
            // Show introduction if it hasn't been shown yet
            if (!hasShownIntroduction) {
                showPersonalizedIntroduction();
                hasShownIntroduction = true;
            }
        }
    }

    function initDragAndDrop() {
        const header = document.querySelector('.chatbot-header');
        if (!header || !chatbotWindow) return;
        
        header.addEventListener('mousedown', (e) => {
            if (e.target === header || e.target.classList.contains('chatbot-title')) {
                isDragging = true;
                chatbotWindow.classList.add('dragging');
                
                const rect = chatbotWindow.getBoundingClientRect();
                dragOffsetX = e.clientX - rect.left;
                dragOffsetY = e.clientY - rect.top;
                
                e.preventDefault();
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging && chatbotWindow) {
                const newLeft = e.clientX - dragOffsetX;
                const newTop = e.clientY - dragOffsetY;
                
                const minDistance = 20;
                const maxLeft = window.innerWidth - chatbotWindow.offsetWidth - minDistance;
                const maxTop = window.innerHeight - chatbotWindow.offsetHeight - minDistance;
                
                const constrainedLeft = Math.max(minDistance, Math.min(newLeft, maxLeft));
                const constrainedTop = Math.max(minDistance, Math.min(newTop, maxTop));
                
                chatbotWindow.style.left = `${constrainedLeft}px`;
                chatbotWindow.style.top = `${constrainedTop}px`;
                chatbotWindow.style.right = 'auto';
                chatbotWindow.style.bottom = 'auto';
            }
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
            if (chatbotWindow) {
                chatbotWindow.classList.remove('dragging');
            }
        });
    }

    // Enhanced Message Handling
    function addBotMessage(text, options = {}) {
        hideTypingIndicator();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        
        // Enhanced markdown formatting
        let formattedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>')
            .replace(/• /g, '<span style="margin-left: 10px;">• </span>');
        
        messageDiv.innerHTML = formattedText;
        
        // Add timestamp
        const timeSpan = document.createElement('span');
        timeSpan.className = 'message-time';
        timeSpan.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        messageDiv.appendChild(timeSpan);
        
        if (chatbotMessages) {
            chatbotMessages.appendChild(messageDiv);
        }
        scrollToBottom();
        
        // Text-to-speech with improved voice
        if (ttsEnabled && 'speechSynthesis' in window && !options.skipTTS) {
            speakText(text);
        }
    }

    function addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.textContent = text;
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'message-time';
        timeSpan.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        messageDiv.appendChild(timeSpan);
        
        if (chatbotMessages) {
            chatbotMessages.appendChild(messageDiv);
        }
        scrollToBottom();
    }

    function speakText(text) {
        try {
            // Clean text for speech
            const cleanText = text
                .replace(/\*\*(.*?)\*\*/g, '$1')
                .replace(/\*(.*?)\*/g, '$1')
                .replace(/\[(.*?)\]\(.*?\)/g, '$1')
                .replace(/[🔬🚀⚗️🧬🌌🌑🌟]/g, '')
                .replace(/\n/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
            
            if (cleanText.length > 0) {
                const utterance = new SpeechSynthesisUtterance(cleanText);
                utterance.rate = 0.85;
                utterance.pitch = 1.0;
                utterance.volume = 0.8;
                
                // Try to use a better voice if available
                const voices = speechSynthesis.getVoices();
                const preferredVoice = voices.find(voice => 
                    voice.name.includes('Google') || 
                    voice.name.includes('Natural') ||
                    voice.lang.startsWith('en-')
                );
                
                if (preferredVoice) {
                    utterance.voice = preferredVoice;
                }
                
                speechSynthesis.speak(utterance);
            }
        } catch (error) {
            console.error('Text-to-speech error:', error);
        }
    }

    function scrollToBottom() {
        if (chatbotMessages) {
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }
    }

    function showTypingIndicator() {
        hideTypingIndicator();
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            typingDiv.appendChild(dot);
        }
        
        if (chatbotMessages) {
            chatbotMessages.appendChild(typingDiv);
        }
        scrollToBottom();
    }

    function hideTypingIndicator() {
        const existingIndicator = document.getElementById('typing-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }
    }

    // Enhanced Message Processing with Advanced NLP
    async function sendMessage() {
        const message = chatbotInput?.value?.trim();
        if (!message) return;
        
        addUserMessage(message);
        if (chatbotInput) chatbotInput.value = '';
        
        // Add to user profile
        userProfile.previousQuestions.push(message);
        if (userProfile.previousQuestions.length > 10) {
            userProfile.previousQuestions.shift();
        }
        
        // Save user profile
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        
        await processMessage(message);
    }

    async function processMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        // Update conversation history
        conversationHistory.push({
            role: 'user',
            content: message,
            timestamp: new Date()
        });
        
        // Show typing indicator
        showTypingIndicator();
        
        // Add realistic delay for better UX
        await new Promise(resolve => setTimeout(resolve, TYPING_DELAY));
        
        // Process different types of messages
        let response = null;
        
        // 1. Handle greetings
        if (NLP_PATTERNS.greeting_patterns.test(lowerMessage)) {
            response = handleGreeting(message);
        }
        // 2. Handle thanks
        else if (NLP_PATTERNS.thanks_patterns.test(lowerMessage)) {
            response = handleThanks(message);
        }
        // 3. Handle help requests
        else if (NLP_PATTERNS.help_patterns.test(lowerMessage)) {
            response = handleHelpRequest(message);
        }
        // 4. Handle confusion
        else if (NLP_PATTERNS.confusion_patterns.test(lowerMessage)) {
            response = handleConfusion(message);
        }
        // 5. Handle science questions
        else {
            response = await handleScienceQuestion(message);
        }
        
        // Add response to conversation history
        conversationHistory.push({
            role: 'assistant',
            content: response,
            timestamp: new Date()
        });
        
        // Limit conversation history
        if (conversationHistory.length > MAX_HISTORY_LENGTH) {
            conversationHistory.splice(0, conversationHistory.length - MAX_HISTORY_LENGTH);
        }
        
        addBotMessage(response);
        
        // Suggest related topics
        setTimeout(() => {
            suggestRelatedTopics(message);
        }, 2000);
    }

    function handleGreeting(message) {
        const responses = RESPONSE_TEMPLATES.greetings;
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        // Personalize based on time of day
        const hour = new Date().getHours();
        let timeGreeting = '';
        
        if (hour < 12) timeGreeting = 'Good morning! ';
        else if (hour < 17) timeGreeting = 'Good afternoon! ';
        else timeGreeting = 'Good evening! ';
        
        return timeGreeting + randomResponse;
    }

    function handleThanks(message) {
        const responses = RESPONSE_TEMPLATES.thanks;
        return responses[Math.floor(Math.random() * responses.length)];
    }

    function handleHelpRequest(message) {
        return `🎯 **I'm here to help you explore science!** Here's what I can do:

**🔬 Explain Complex Topics:**
• Quantum physics and particle behavior
• Space exploration and astronomy
• Chemistry and molecular interactions
• Biology and life processes
• Physics fundamentals

**🌟 Interactive Learning:**
• Break down difficult concepts
• Provide real-world examples
• Share fascinating facts
• Connect related topics

**🚀 Current Topics:**
• Latest space discoveries
• Breakthrough research
• Technology applications

**Try asking:**
• "How do black holes form?"
• "What makes DNA special?"
• "Explain photosynthesis"
• "Tell me about quantum computing"

What scientific topic interests you most?`;
    }

    function handleConfusion(message) {
        const responses = RESPONSE_TEMPLATES.confusion_help;
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        return `${randomResponse}

🎯 **Let me help clarify!** 

If you're finding something complex, I can:
• Explain it in simpler terms
• Use analogies and examples
• Break it into smaller steps
• Focus on the key concepts

What specific part would you like me to explain differently?`;
    }

    async function handleScienceQuestion(message) {
        const lowerMessage = message.toLowerCase();
        
        // Find the best matching topic
        const matchedTopic = findBestTopicMatch(lowerMessage);
        
        if (matchedTopic) {
            currentTopic = matchedTopic.key;
            return formatEnhancedResponse(matchedTopic.data, message);
        }
        
        // Try external APIs
        const apiResponse = await tryExternalAPIs(message);
        if (apiResponse) {
            return apiResponse;
        }
        
        // Generate contextual response
        return generateContextualResponse(message);
    }

    function findBestTopicMatch(message) {
        let bestMatch = null;
        let bestScore = 0;
        
        for (const [key, data] of Object.entries(ENHANCED_KNOWLEDGE_BASE)) {
            const score = calculateTopicScore(message, data.keywords);
            if (score > bestScore) {
                bestScore = score;
                bestMatch = { key, data };
            }
        }
        
        return bestScore > 0 ? bestMatch : null;
    }

    function calculateTopicScore(message, keywords) {
        let score = 0;
        const words = message.toLowerCase().split(/\s+/);
        
        for (const keyword of keywords) {
            if (words.includes(keyword)) {
                score += 1;
            }
            if (message.toLowerCase().includes(keyword)) {
                score += 0.5;
            }
        }
        
        return score;
    }

    function formatEnhancedResponse(topicData, originalMessage) {
        const encouragement = RESPONSE_TEMPLATES.encouragement;
        const randomEncouragement = encouragement[Math.floor(Math.random() * encouragement.length)];
        
        let response = `${randomEncouragement}\n\n${topicData.definition}\n\n${topicData.explanation}`;
        
        // Add examples if available
        if (topicData.examples && topicData.examples.length > 0) {
            response += `\n\n**🌟 Examples:**\n${topicData.examples.map(ex => `• ${ex}`).join('\n')}`;
        }
        
        // Add applications if available
        if (topicData.applications && topicData.applications.length > 0) {
            response += `\n\n**🚀 Applications:**\n${topicData.applications.map(app => `• ${app}`).join('\n')}`;
        }
        
        // Add fun facts if available
        if (topicData.funFacts && topicData.funFacts.length > 0) {
            const randomFact = topicData.funFacts[Math.floor(Math.random() * topicData.funFacts.length)];
            response += `\n\n**💡 Fun Fact:** ${randomFact}`;
        }
        
        // Add website reference
        response += `\n\n**📚 Learn More:** [Explore ${currentTopic} on our website](${API_CONFIG.scienceAndFacts.baseUrl}${API_CONFIG.scienceAndFacts.topics[currentTopic] || ''})`;
        
        return response;
    }

    async function tryExternalAPIs(message) {
        const lowerMessage = message.toLowerCase();
        
        // Try NASA API for space-related queries
        if (/space|nasa|astronomy|planet|star|galaxy|universe|mars|moon|rocket|satellite/.test(lowerMessage)) {
            const nasaResponse = await fetchNASAData(message);
            if (nasaResponse) return nasaResponse;
        }
        
        // Try Wikipedia for general science topics
        const wikiResponse = await fetchWikipediaData(message);
        if (wikiResponse) return wikiResponse;
        
        return null;
    }

    async function fetchNASAData(query) {
        try {
            if (/apod|picture.*day|astronomy.*photo/.test(query.toLowerCase())) {
                const response = await fetch(API_CONFIG.nasa.apod);
                if (response.ok) {
                    const data = await response.json();
                    return `🚀 **NASA Astronomy Picture of the Day** (${data.date})

**${data.title}**

${data.explanation}

[View the full image](${data.url})

*This incredible image showcases the beauty and wonder of our universe!*`;
                }
            }
            
            // Try NASA image search
            const searchResponse = await fetch(`${API_CONFIG.nasa.imageLibrary}?q=${encodeURIComponent(query)}&media_type=image`);
            if (searchResponse.ok) {
                const searchData = await searchResponse.json();
                if (searchData.collection.items.length > 0) {
                    const firstItem = searchData.collection.items[0];
                    const imageData = firstItem.data[0];
                    const imageLink = firstItem.links?.[0]?.href;
                    
                    return `🚀 **NASA Image: ${imageData.title}**

${imageData.description || 'An amazing view from NASA\'s archives!'}

${imageLink ? `[View Image](${imageLink})` : ''}

*NASA continues to capture breathtaking images that expand our understanding of the cosmos.*`;
                }
            }
        } catch (error) {
            console.error('NASA API error:', error);
        }
        return null;
    }

    async function fetchWikipediaData(query) {
        try {
            const response = await fetch(`${API_CONFIG.wikipedia.endpoint}${encodeURIComponent(query)}`);
            if (response.ok) {
                const data = await response.json();
                if (data.extract) {
                    return `📖 **From Wikipedia: ${data.title}**

${data.extract}

[Read the full article](${data.content_urls.desktop.page})

*This information provides a great foundation for understanding ${query}.*`;
                }
            }
        } catch (error) {
            console.error('Wikipedia API error:', error);
        }
        return null;
    }

    function generateContextualResponse(message) {
        const responses = [
            `🤔 That's an interesting question about "${message}"! While I don't have specific information about this exact topic, I can help you explore related scientific concepts.`,
            `🔬 I'd love to help you understand "${message}" better! Let me suggest some related topics that might interest you.`,
            `🌟 Great question! While I may not have detailed information about "${message}" specifically, I can guide you to relevant scientific areas.`
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        return `${randomResponse}

**🎯 Here's what I can help you explore:**

• **Physics & Quantum Mechanics** - Fundamental forces and particle behavior
• **Space & Astronomy** - Planets, stars, galaxies, and cosmic phenomena  
• **Chemistry & Molecules** - Chemical reactions and molecular structures
• **Biology & Life Sciences** - Living organisms and biological processes

**🚀 You might also find these helpful:**
• [Explore our ScienceAndFacts website](${API_CONFIG.scienceAndFacts.baseUrl})
• [Search Wikipedia](https://en.wikipedia.org/wiki/Special:Search/${encodeURIComponent(message)})

What specific aspect of science interests you most? I can provide detailed explanations!`;
    }

    function suggestRelatedTopics(message) {
        if (!currentTopic) return;
        
        const topicData = ENHANCED_KNOWLEDGE_BASE[currentTopic];
        if (!topicData || !topicData.related) return;
        
        const relatedTopics = topicData.related.slice(0, 3);
        if (relatedTopics.length === 0) return;
        
        const suggestions = relatedTopics.map(topic => `• ${topic}`).join('\n');
        
        const transition = RESPONSE_TEMPLATES.topic_transitions;
        const randomTransition = transition[Math.floor(Math.random() * transition.length)];
        
        addBotMessage(`${randomTransition}

${suggestions}

Which of these would you like to explore next?`, { skipTTS: true });
    }

    // Enhanced Speech Recognition
    function initSpeechRecognition() {
        try {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = 'en-US';
                recognition.maxAlternatives = 1;
                
                recognition.onstart = () => {
                    if (chatbotVoice) {
                        chatbotVoice.classList.add('listening');
                    }
                    addBotMessage("🎤 I'm listening... Please speak your question clearly.", { skipTTS: true });
                };
                
                recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    if (chatbotInput) {
                        chatbotInput.value = transcript;
                    }
                    addBotMessage(`🗣️ I heard: "${transcript}"`, { skipTTS: true });
                    setTimeout(() => sendMessage(), 1000);
                };
                
                recognition.onerror = (event) => {
                    console.error('Speech recognition error:', event.error);
                    let errorMessage = "Sorry, I couldn't understand your voice command.";
                    
                    switch(event.error) {
                        case 'no-speech':
                            errorMessage = "I didn't hear anything. Please try speaking again.";
                            break;
                        case 'network':
                            errorMessage = "Network error. Please check your connection and try again.";
                            break;
                        case 'not-allowed':
                            errorMessage = "Microphone access denied. Please enable microphone permissions.";
                            break;
                    }
                    
                    addBotMessage(errorMessage);
                };
                
                recognition.onend = () => {
                    isListening = false;
                    if (chatbotVoice) {
                        chatbotVoice.classList.remove('listening');
                    }
                };
            }
        } catch (error) {
            console.error('Speech recognition initialization error:', error);
        }
    }

    function toggleVoiceRecognition() {
        if (!recognition) {
            addBotMessage("🎤 Voice recognition is not supported in your browser. Please type your question instead.");
            return;
        }
        
        if (isListening) {
            recognition.stop();
            isListening = false;
            if (chatbotVoice) {
                chatbotVoice.classList.remove('listening');
            }
        } else {
            try {
                recognition.start();
                isListening = true;
            } catch (error) {
                console.error('Voice recognition start error:', error);
                addBotMessage("🎤 Sorry, I couldn't start voice recognition. Please check your microphone permissions and try again.");
            }
        }
    }

    // Theme and Settings
    function toggleDarkMode() {
        darkMode = !darkMode;
        if (chatbotWindow) {
            chatbotWindow.classList.toggle('dark-mode');
        }
        if (themeToggle) {
            themeToggle.innerHTML = darkMode ? '☀️' : '🌙';
        }
        localStorage.setItem('chatbotDarkMode', darkMode);
    }

    function toggleTTS() {
        ttsEnabled = !ttsEnabled;
        updateTTSButton();
        localStorage.setItem('chatbotTTS', ttsEnabled);
        
        const message = ttsEnabled ? 
            "🔊 Text-to-speech enabled! I'll now read my responses aloud." :
            "🔇 Text-to-speech disabled. I'll only show text responses.";
        
        addBotMessage(message, { skipTTS: !ttsEnabled });
    }

    // Utility Functions
    function cleanTextForSpeech(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/```[\s\S]*?```/g, '')
            .replace(/`(.*?)`/g, '$1')
            .replace(/\[(.*?)\]\(.*?\)/g, '$1')
            .replace(/[🔬🚀⚗️🧬🌌🌑🌟💡📚🎯🤔]/g, '')
            .replace(/\n+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function updateUserTopicInterest(topic) {
        if (!userProfile.preferredTopics.includes(topic)) {
            userProfile.preferredTopics.push(topic);
            if (userProfile.preferredTopics.length > 5) {
                userProfile.preferredTopics.shift();
            }
            localStorage.setItem('userProfile', JSON.stringify(userProfile));
        }
    }

    function getPersonalizedGreeting() {
        const hour = new Date().getHours();
        const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
        
        if (userProfile.preferredTopics.length > 0) {
            const favoriteTopic = userProfile.preferredTopics[userProfile.preferredTopics.length - 1];
            return `Good ${timeOfDay}! Ready to explore more about ${favoriteTopic} or discover something new?`;
        }
        
        return `Good ${timeOfDay}! What fascinating scientific topic would you like to explore today?`;
    }

    // Error Handling
    window.addEventListener('error', (event) => {
        console.error('Chatbot error:', event.error);
        if (event.error.message.includes('fetch')) {
            addBotMessage("🔄 I'm having trouble connecting to external services, but I can still help with science topics from my knowledge base!");
        }
    });

    // Initialize the Enhanced Chatbot
    initChatbot();

    // Expose necessary functions to global scope for debugging
    window.chatbotDebug = {
        showIntro: showPersonalizedIntroduction,
        toggleWindow: toggleChatbotWindow,
        clearHistory: () => {
            conversationHistory = [];
            localStorage.removeItem('userProfile');
            localStorage.removeItem('chatbotVisited');
        }
    };
// Align chatbot button with back-to-top button
const alignChatbotButton = () => {
  const chatBotBtn = document.querySelector('.chatbot-toggle');
  const backToTopBtn = document.querySelector('.back-to-top-button');

  if (chatBotBtn && backToTopBtn) {
    const backTopRect = backToTopBtn.getBoundingClientRect();
    const chatBotRect = chatBotBtn.getBoundingClientRect();
    const offset = backTopRect.top - chatBotRect.top;

    chatBotBtn.style.position = 'relative';
    chatBotBtn.style.top = `${offset}px`;
  }
};

window.addEventListener('load', alignChatbotButton);
});
