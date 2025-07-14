// --- Configuration and Constants ---
// IMPORTANT: The GEMINI_API_KEY is left empty as Canvas will inject it at runtime.
// For a standalone production environment, you would need to replace this with your actual key
// or, ideally, use a backend proxy to keep your API key secure.
const GEMINI_API_KEY = ''; // Canvas will inject the key here.
const WIKIPEDIA_API_URL = 'https://en.wikipedia.org/w/api.php';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
const MAX_CHAT_HISTORY_TURNS = 10; // Increased context window for better conversation
const SCIENCE_SITE_URL = 'https://6124224.github.io/ScienceAndFActs/';

// --- DOM Elements ---
const chatbotOpenBtn = document.getElementById('chatbotOpenBtn');
const chatbotContainer = document.getElementById('chatbotContainer');
const chatbotCloseBtn = document.getElementById('chatbotCloseBtn');
const chatbotHeader = document.getElementById('chatbotHeader');
const chatbotBody = document.getElementById('chatbotBody');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const emojiBtn = document.getElementById('emojiBtn');
const emojiPicker = document.getElementById('emojiPicker');

// --- State Variables ---
let isChatOpen = false;
let isDragging = false;
let offsetX, offsetY;
let isDarkMode = false;
let typingIndicator = null; // To store the typing indicator element
// Stores chat history for sending to Gemini for context
let currentChatHistory = [{ 
    role: "model", 
    parts: [{ 
        text: "Hello! I'm your Science & Facts assistant. I can answer questions about science, explain concepts from the ScienceAndFacts website, and help with general knowledge. How can I assist you today?" 
    }] 
}];

// --- Utility Functions ---

/**
 * Formats the current time as HH:MM AM/PM.
 * @returns {string} Formatted time string.
 */
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

/**
 * Creates a new message element and appends it to the chat body.
 * Also updates the internal chat history for context.
 * @param {string} text - The message text (can contain HTML for links).
 * @param {string} sender - 'user' or 'bot'.
 */
function addMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', sender);
    messageElement.innerHTML = `
        <div class="message-text">${text}</div>
        <div class="message-timestamp">${getCurrentTime()}</div>
    `;
    chatbotBody.appendChild(messageElement);

    // Add message to currentChatHistory for Gemini context
    // Note: Gemini API uses 'user' and 'model' roles.
    const geminiRole = sender === 'user' ? 'user' : 'model';
    currentChatHistory.push({ role: geminiRole, parts: [{ text: text.replace(/<[^>]*>?/gm, '') }] }); // Store plain text

    // Keep history trimmed to MAX_CHAT_HISTORY_TURNS * 2 (user + model messages)
    if (currentChatHistory.length > MAX_CHAT_HISTORY_TURNS * 2) {
        // Remove oldest messages, ensuring we keep pairs if possible
        currentChatHistory = currentChatHistory.slice(currentChatHistory.length - (MAX_CHAT_HISTORY_TURNS * 2));
    }

    // Trigger animation for the new message
    setTimeout(() => {
        messageElement.style.opacity = '1';
        messageElement.style.transform = 'translateY(0)';
    }, 50); // Small delay for animation to kick in after append

    scrollToBottom();
}

/**
 * Scrolls the chat body to the bottom.
 */
function scrollToBottom() {
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

/**
 * Shows the typing indicator in the chat.
 */
function showTypingIndicator() {
    if (typingIndicator) return; // Prevent multiple indicators if already present

    typingIndicator = document.createElement('div');
    typingIndicator.classList.add('typing-indicator');
    typingIndicator.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    chatbotBody.appendChild(typingIndicator);
    scrollToBottom();

    // Trigger animation for the typing indicator
    setTimeout(() => {
        if (typingIndicator) {
            typingIndicator.style.opacity = '1';
        }
    }, 50);
}

/**
 * Hides the typing indicator from the chat.
 */
function hideTypingIndicator() {
    if (typingIndicator) {
        typingIndicator.style.opacity = '0';
        // Remove the element after the fade-out animation completes
        typingIndicator.addEventListener('transitionend', () => {
            if (typingIndicator && typingIndicator.parentNode) {
                typingIndicator.parentNode.removeChild(typingIndicator);
            }
            typingIndicator = null; // Reset the reference
        }, { once: true }); // Ensure the event listener is removed after first use
    }
}

/**
 * Handles the auto-resizing of the textarea based on content.
 * Prevents the textarea from growing indefinitely.
 */
function autoResizeTextarea() {
    chatInput.style.height = 'auto'; // Reset height to calculate scrollHeight correctly
    chatInput.style.height = chatInput.scrollHeight + 'px'; // Set height to fit content

    // Limit max height to prevent the input area from becoming too large
    const maxHeight = 100; // pixels
    if (chatInput.scrollHeight > maxHeight) {
        chatInput.style.height = maxHeight + 'px';
        chatInput.style.overflowY = 'auto'; // Enable scrollbar if content exceeds max-height
    } else {
        chatInput.style.overflowY = 'hidden'; // Hide scrollbar if content fits
    }
}

// --- Chatbot UI Event Handlers ---

/**
 * Toggles the visibility of the chatbot container.
 * Also changes the icon on the open button.
 */
function toggleChatbot() {
    isChatOpen = !isChatOpen;
    chatbotContainer.classList.toggle('open', isChatOpen);
    // Change button icon based on chat state
    chatbotOpenBtn.querySelector('i').classList.toggle('fa-comment-dots', !isChatOpen);
    chatbotOpenBtn.querySelector('i').classList.toggle('fa-times', isChatOpen);
    if (isChatOpen) {
        chatInput.focus(); // Focus on input when chat opens
        scrollToBottom(); // Ensure chat is scrolled to bottom
    }
}

/**
 * Toggles between dark and light mode.
 * Updates body class and button icon.
 * Saves the preference to localStorage for persistence.
 */
function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    themeToggleBtn.querySelector('i').classList.toggle('fa-moon', !isDarkMode);
    themeToggleBtn.querySelector('i').classList.toggle('fa-sun', isDarkMode);
    localStorage.setItem('chatbot-theme', isDarkMode ? 'dark' : 'light');
}

/**
 * Initializes the theme based on user's system preference or saved preference.
 * This function is called once on DOMContentLoaded.
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem('chatbot-theme');
    if (savedTheme) {
        isDarkMode = (savedTheme === 'dark');
    } else {
        // Check system preference if no theme is saved
        isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    document.body.classList.toggle('dark-mode', isDarkMode);
    themeToggleBtn.querySelector('i').classList.toggle('fa-moon', !isDarkMode);
    themeToggleBtn.querySelector('i').classList.toggle('fa-sun', isDarkMode);
}

// --- Draggable Chat Window Logic ---

/**
 * Handles the start of a drag operation when the mouse is pressed on the header.
 * @param {MouseEvent} e - The mouse event.
 */
function startDragging(e) {
    isDragging = true;
    chatbotHeader.style.cursor = 'grabbing'; // Change cursor to indicate dragging
    // Calculate offset from mouse position to the top-left corner of the chat window
    const rect = chatbotContainer.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    // Set position to fixed and clear bottom/right properties
    // This allows direct control over 'left' and 'top' for dragging
    chatbotContainer.style.position = 'fixed';
    chatbotContainer.style.bottom = 'auto';
    chatbotContainer.style.right = 'auto';
}

/**
 * Handles the drag movement as the mouse moves.
 * @param {MouseEvent} e - The mouse event.
 */
function drag(e) {
    if (!isDragging) return; // Only drag if dragging is active

    // Calculate new position relative to viewport
    let newX = e.clientX - offsetX;
    let newY = e.clientY - offsetY;

    // Keep the element within the viewport boundaries
    const maxX = window.innerWidth - chatbotContainer.offsetWidth;
    const maxY = window.innerHeight - chatbotContainer.offsetHeight;

    newX = Math.max(0, Math.min(newX, maxX)); // Clamp X position
    newY = Math.max(0, Math.min(newY, maxY)); // Clamp Y position

    chatbotContainer.style.left = `${newX}px`;
    chatbotContainer.style.top = `${newY}px`;
}

/**
 * Handles the end of a drag operation when the mouse button is released.
 */
function stopDragging() {
    isDragging = false;
    chatbotHeader.style.cursor = 'grab'; // Restore cursor
}

// --- Emoji Picker Functions ---

// A comprehensive list of common emojis
const emojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
    '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
    '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
    '🤔', '🤫', '🤭', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐',
    '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', ' ', '👹', '👺', '🤡', '💩', '👻', '💀', '👽', '👾', '🤖',
    '💖', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💔', '💯', '👍', '👎', '👏', '🙏', '👋', '💪', '🔥', '✨',
    '🎉', '🎊', '🎁', '🎈', '🎄', '🎅', '🌟', '💫', '🌈', '☀️', '☁️', '☔', '⚡', '❄️', '🌸', '🌼', '🌻', '🍎', '🍓', '🍕',
    '🍔', '🍟', '☕', '🍺', '🥂', '🍦', '🍩', '🍪', '🍫', '🍬', '🍭', '🎤', '🎧', '🎸', '🎹', '🥁', '🎮', '🎲', '🧩', '⚽',
    '🏀', '🏈', '⚾', '🎾', '🏐', '🏆', '🥇', '🥈', '🥉', '🚗', '🚕', '🚌', '🏎️', '🚓', '🚑', '🚒', '✈️', '🚀', '🚢', '🚂',
    '🚲', '🛴', '🛵', '🗺️', '📍', '🏠', '🏢', '🏫', '🏥', '🏦', '🏪', '💡', '📚', '🖊️', '🗓️', '⏰', '📱', '💻', '🖥️', '🖨️',
    '📷', '🎥', '📺', '📻', '📞', '🔔', '✉️', '📧', '🔗', '🔒', '🔓', '🔑', '⚙️', '🛠️', '🛒', '💰', '💳', '📈', '📉', '📊'
];

/**
 * Populates the emoji picker with clickable emoji spans.
 */
function populateEmojiPicker() {
    emojis.forEach(emoji => {
        const span = document.createElement('span');
        span.textContent = emoji;
        span.addEventListener('click', () => {
            chatInput.value += emoji; // Add emoji to textarea
            autoResizeTextarea(); // Adjust textarea height
            hideEmojiPicker(); // Hide picker after selection
            chatInput.focus(); // Keep focus on input
        });
        emojiPicker.appendChild(span);
    });
}

/**
 * Toggles the visibility of the emoji picker.
 */
function toggleEmojiPicker() {
    emojiPicker.classList.toggle('open');
}

/**
 * Hides the emoji picker.
 */
function hideEmojiPicker() {
    emojiPicker.classList.remove('open');
}

// --- AI Response Logic ---

/**
 * Fetches an answer from Wikipedia based on the query.
 * Uses the Wikipedia API to get a text extract and the full URL.
 * @param {string} query - The search query.
 * @returns {Promise<string|null>} The Wikipedia extract formatted with a link, or null if not found/error.
 */
async function getWikipediaAnswer(query) {
    const params = new URLSearchParams({
        action: 'query',
        format: 'json',
        prop: 'extracts|info', // Request extract and info (for URL)
        exintro: true,         // Return only the introductory section
        explaintext: true,     // Return plain text, not HTML
        redirects: 1,          // Resolve redirects
        titles: query,         // The search term
        inprop: 'url',         // Include full URL in info
        origin: '*'            // Required for CORS to work with Fetch API
    });

    try {
        const response = await fetch(`${WIKIPEDIA_API_URL}?${params.toString()}`);
        const data = await response.json();

        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0]; // Get the first page ID

        if (pageId && pages[pageId].extract && pages[pageId].extract.length > 0) {
            const extract = pages[pageId].extract;
            const fullurl = pages[pageId].fullurl;
            // Limit extract length for display in chat to keep it concise
            const snippet = extract.length > 500 ? extract.substring(0, 500) + '...' : extract;
            return `${snippet} <a href="${fullurl}" target="_blank" rel="noopener noreferrer">(Read more on Wikipedia)</a>`;
        }
    } catch (error) {
        console.error('Error fetching from Wikipedia:', error);
    }
    return null; // Return null if no valid Wikipedia answer is found or an error occurs
}

/**
 * Fetches an answer from the Gemini API with enhanced context about the ScienceAndFacts website.         * @param {string} query - The user's query.
 * @returns {Promise<string>} The AI-generated response.
 */
async function getGeminiAnswer(query) {
    // Enhanced system instruction with knowledge about the ScienceAndFacts website
    const systemInstruction = {
        role: "model",
        parts: [{
            text: `You are a helpful science assistant for the ScienceAndFacts website (${SCIENCE_SITE_URL}). 
            Your role is to provide accurate, engaging explanations about scientific concepts, 
            particularly those covered on the website. When appropriate, reference the website's content 
            and provide links to relevant sections. 

            Key website sections to reference:
            - Physics concepts
            - Chemistry experiments
            - Biology facts
            - Astronomy discoveries
            - Technology innovations

            Guidelines:
            1. Be concise but thorough in explanations
            2. Use simple analogies for complex concepts
            3. Cite reliable sources when possible
            4. For math/science problems, show your work
            5. When mentioning website content, format links like this: 
               <a href="${SCIENCE_SITE_URL}#section-id" target="_blank">[Relevant Section]</a>
            6. For Wikipedia references, format like this:
               <a href="https://en.wikipedia.org/wiki/Topic" target="_blank">[Wikipedia]</a>
            7. Always maintain a friendly, enthusiastic tone about science`
        }]
    };

    try {
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [systemInstruction, ...currentChatHistory],
                generationConfig: {
                    temperature: 0.7, // Balance between creativity and accuracy
                    topP: 0.9,
                    topK: 40
                }
            })
        });

        const data = await response.json();
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            return data.candidates[0].content.parts[0].text;
        } else {
            console.error('Unexpected Gemini API response:', data);
            return "I'm having trouble processing that request. Could you try rephrasing or asking something else?";
        }
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return "I'm currently unable to access my knowledge base. Please try again later.";
    }
}

/**
 * Handles the user's message and generates an appropriate response.
 * @param {string} message - The user's message.
 */
async function handleUserMessage(message) {
    // Add user message to chat
    addMessage(message, 'user');
    chatInput.value = ''; // Clear input
    autoResizeTextarea(); // Reset textarea height

    // Show typing indicator while processing
    showTypingIndicator();

    // Check for simple greetings/commands first
    const lowerMessage = message.toLowerCase().trim();
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
        hideTypingIndicator();
        addMessage("You're welcome! Is there anything else you'd like to know about science?", 'bot');
        return;
    }

    if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
        hideTypingIndicator();
        addMessage("Hello again! Ready to explore more fascinating science facts?", 'bot');
        return;
    }

    // Check if the user is asking about the ScienceAndFacts website specifically
    if (lowerMessage.includes('website') || lowerMessage.includes('site') || 
        lowerMessage.includes(SCIENCE_SITE_URL.replace('https://', ''))) {
        hideTypingIndicator();
        addMessage(`The ScienceAndFacts website (${SCIENCE_SITE_URL}) is a great resource for science enthusiasts! ` +
            `It covers topics like physics, chemistry, biology, and astronomy. ` +
            `You can browse different sections to learn about specific concepts. ` +
            `Is there a particular topic you'd like me to explain from the website?`, 'bot');
        return;
    }

    // Try Wikipedia first for factual queries (good for definitions, historical facts, etc.)
    const wikiKeywords = ['what is', 'who is', 'define', 'definition', 'explain', 'history of'];
    const shouldTryWikipedia = wikiKeywords.some(keyword => lowerMessage.includes(keyword));

    let response = null;
    if (shouldTryWikipedia) {
        // Extract the main query for Wikipedia (remove question words)
        const query = message.replace(/\b(what|who|define|definition|explain|history)\b/gi, '').trim();
        response = await getWikipediaAnswer(query);
    }

    // If Wikipedia didn't return a good answer or wasn't appropriate, use Gemini
    if (!response) {
        response = await getGeminiAnswer(message);
    }

    // Hide typing indicator and add response
    hideTypingIndicator();
    addMessage(response, 'bot');
}

// --- Event Listeners ---

// Toggle chat window
chatbotOpenBtn.addEventListener('click', toggleChatbot);
chatbotCloseBtn.addEventListener('click', toggleChatbot);

// Theme toggle
themeToggleBtn.addEventListener('click', toggleTheme);

// Draggable window functionality
chatbotHeader.addEventListener('mousedown', startDragging);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', stopDragging);

// Emoji picker functionality
emojiBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent triggering drag events
    toggleEmojiPicker();
});

// Hide emoji picker when clicking elsewhere
document.addEventListener('click', hideEmojiPicker);
emojiPicker.addEventListener('click', (e) => e.stopPropagation());

// Handle textarea input and resizing
chatInput.addEventListener('input', autoResizeTextarea);

// Send message on Enter key (but allow Shift+Enter for new lines)
chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (message) {
            handleUserMessage(message);
        }
    }
});

// Send message on button click
sendBtn.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message) {
        handleUserMessage(message);
    }
});

// Initialize the chat
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    populateEmojiPicker();
    
    // Add welcome message if no messages exist (besides initial bot message)
    if (chatbotBody.querySelectorAll('.chat-message').length <= 1) {
        setTimeout(() => {
            addMessage("Try asking me about:<br>" +
                "- Scientific concepts from the ScienceAndFacts website<br>" +
                "- Recent discoveries in physics or biology<br>" +
                "- Explanations of complex topics in simple terms<br>" +
                "- Help with science homework problems", 'bot');
        }, 1500);
    }
});

// Make the chat window resizable (handled by CSS resize property)
// Additional touch support for mobile devices
if ('ontouchstart' in window) {
    // Touch support for draggable header
    chatbotHeader.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        startDragging(mouseEvent);
    });

    document.addEventListener('touchmove', (e) => {
        if (isDragging) {
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            drag(mouseEvent);
            e.preventDefault(); // Prevent scrolling while dragging
        }
    }, { passive: false });

    document.addEventListener('touchend', () => {
        if (isDragging) {
            stopDragging();
        }
    });
}