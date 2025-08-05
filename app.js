// DOM Elements
const searchBtn = document.getElementById('searchBtn');
const wordInput = document.getElementById('wordInput');
const resultsDiv = document.getElementById('results');
const themeToggle = document.getElementById('themeToggle');
const translateBtn = document.getElementById('translateBtn');
const textToTranslate = document.getElementById('textToTranslate');
const translationResults = document.getElementById('translationResults');
const modeButtons = document.querySelectorAll('.mode-btn');
const dictionarySearch = document.getElementById('dictionarySearch');
const translatorSearch = document.getElementById('translatorSearch');
const swapBtn = document.getElementById('swapLanguages');
const dictLanguageSelect = document.getElementById('dictLanguage');
const sourceLanguageSelect = document.getElementById('sourceLanguage');
const targetLanguageSelect = document.getElementById('targetLanguage');

// Supported languages
const languages = {
    'en': { name: 'English', apiCode: 'en' },
    'hi': { name: 'Hindi', apiCode: 'hi' },
    'es': { name: 'Spanish', apiCode: 'es' },
    'fr': { name: 'French', apiCode: 'fr' },
    'de': { name: 'German', apiCode: 'de' },
    'it': { name: 'Italian', apiCode: 'it' },
    'pt': { name: 'Portuguese', apiCode: 'pt' },
    'ru': { name: 'Russian', apiCode: 'ru' },
    'zh': { name: 'Chinese', apiCode: 'zh' },
    'ja': { name: 'Japanese', apiCode: 'ja' },
    'ar': { name: 'Arabic', apiCode: 'ar' }
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners
    setupEventListeners();
    
    // Set default theme based on user preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
        document.body.dataset.theme = 'dark';
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
});

// Set up all event listeners
function setupEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Dictionary search
    searchBtn.addEventListener('click', searchDictionary);
    wordInput.addEventListener('keydown', (e) => e.key === 'Enter' && searchDictionary());
    
    // Translation
    translateBtn.addEventListener('click', translateText);
    textToTranslate.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            translateText();
        }
    });
    
    // Mode switching
    modeButtons.forEach(button => {
        button.addEventListener('click', () => switchMode(button.dataset.mode));
    });
    
    // Language swap
    swapBtn.addEventListener('click', swapLanguages);
}

// Toggle between dark and light theme
function toggleTheme() {
    const isDark = document.body.dataset.theme === 'dark';
    document.body.dataset.theme = isDark ? '' : 'dark';
    themeToggle.innerHTML = isDark 
        ? '<i class="fas fa-moon"></i>'
        : '<i class="fas fa-sun"></i>';
    
    // Save preference to localStorage
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

// Switch between dictionary and translator modes
function switchMode(mode) {
    // Update active button
    modeButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.mode-btn[data-mode="${mode}"]`).classList.add('active');
    
    // Show/hide appropriate sections
    if (mode === 'dictionary') {
        dictionarySearch.classList.remove('hidden');
        translatorSearch.classList.add('hidden');
        resultsDiv.classList.remove('hidden');
        translationResults.classList.add('hidden');
        wordInput.focus();
    } else {
        dictionarySearch.classList.add('hidden');
        translatorSearch.classList.remove('hidden');
        resultsDiv.classList.add('hidden');
        translationResults.classList.remove('hidden');
        textToTranslate.focus();
    }
}

// Swap source and target languages for translation
function swapLanguages() {
    const source = sourceLanguageSelect.value;
    const target = targetLanguageSelect.value;
    
    // Don't swap if source is 'auto'
    if (source === 'auto') return;
    
    sourceLanguageSelect.value = target;
    targetLanguageSelect.value = source;
}

// Search dictionary for word
async function searchDictionary() {
    const word = wordInput.value.trim();
    const language = dictLanguageSelect.value;
    
    if (!word) {
        showDictionaryError('Please enter a word to search');
        return;
    }
    
    // Show loading state
    resultsDiv.innerHTML = `
        <div class="card">
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i> Searching dictionary...
            </div>
        </div>`;
    
    try {
        // Use Free Dictionary API
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/${language}/${encodeURIComponent(word)}`);
        
        if (!response.ok) {
            throw new Error(`Word not found in ${languages[language].name} dictionary`);
        }
        
        const data = await response.json();
        displayDictionaryResults(data, language);
        
    } catch (error) {
        console.error('Dictionary error:', error);
        showDictionaryError(`No definition found for "${word}" in ${languages[language].name}. Try another word.`);
    }
}

// Display dictionary results
function displayDictionaryResults(data, language) {
    resultsDiv.innerHTML = '';
    
    data.forEach(entry => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h2>${entry.word}</h2>
            ${entry.phonetic ? `<div class="phonetic">${entry.phonetic}</div>` : ''}
        `;
        
        // Add pronunciation audio if available
        if (entry.phonetics?.length) {
            const audioPhonetic = entry.phonetics.find(p => p.audio);
            if (audioPhonetic?.audio) {
                card.innerHTML += `
                    <button class="audio-btn" onclick="playAudio('${audioPhonetic.audio}')">
                        <i class="fas fa-volume-up"></i> Listen
                    </button>
                `;
            }
        }
        
        // Add meanings and definitions
        entry.meanings.forEach(meaning => {
            card.innerHTML += `<div class="pos">${meaning.partOfSpeech}</div>`;
            
            meaning.definitions.forEach((def, i) => {
                card.innerHTML += `
                    <div class="def"><strong>${i+1}.</strong> ${def.definition}</div>
                    ${def.example ? `<div class="example">"${def.example}"</div>` : ''}
                    ${def.synonyms?.length ? `
                        <div class="synonyms"><strong>Synonyms:</strong> ${def.synonyms.join(', ')}</div>
                    ` : ''}
                    ${def.antonyms?.length ? `
                        <div class="antonyms"><strong>Antonyms:</strong> ${def.antonyms.join(', ')}</div>
                    ` : ''}
                `;
            });
        });
        
        // Add translation option
        card.innerHTML += `
            <div class="translate-option">
                <button class="dict-lookup-btn" onclick="translateWord('${entry.word}', '${language}')">
                    <i class="fas fa-language"></i> Translate this word
                </button>
            </div>
        `;
        
        resultsDiv.appendChild(card);
    });
}

// Show dictionary error message
function showDictionaryError(message) {
    resultsDiv.innerHTML = `
        <div class="card">
            <h2>Oops!</h2>
            <div class="def">${message}</div>
        </div>`;
}

// Play pronunciation audio
function playAudio(audioUrl) {
    if (!audioUrl) return;
    try {
        const audio = new Audio(audioUrl);
        audio.play().catch(e => console.error('Audio playback failed:', e));
    } catch (error) {
        console.error('Error playing audio:', error);
    }
}

// Translate text using LibreTranslate (no API key needed)
async function translateText() {
    const text = textToTranslate.value.trim();
    const sourceLang = sourceLanguageSelect.value;
    const targetLang = targetLanguageSelect.value;
    
    if (!text) {
        showTranslationError('Please enter text to translate');
        return;
    }
    
    // Show loading state
    translationResults.innerHTML = `
        <div class="translation-card">
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i> Translating...
            </div>
        </div>`;
    
    try {
        // Use LibreTranslate API (public instance)
        const response = await fetch('https://libretranslate.de/translate', {
            method: 'POST',
            body: JSON.stringify({
                q: text,
                source: sourceLang === 'auto' ? '' : sourceLang,
                target: targetLang,
                format: 'text'
            }),
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
            throw new Error('Translation service unavailable');
        }
        
        const data = await response.json();
        
        if (data.translatedText) {
            displayTranslationResults(
                text,
                data.translatedText,
                sourceLang === 'auto' ? (data.detectedLanguage?.language || 'en') : sourceLang,
                targetLang
            );
        } else {
            throw new Error('No translation found');
        }
    } catch (error) {
        console.error('Translation error:', error);
        showTranslationError(`Failed to translate: ${error.message || 'Service unavailable'}`);
    }
}

// Display translation results
function displayTranslationResults(originalText, translatedText, detectedLang, targetLang) {
    translationResults.innerHTML = '';
    
    const translationCard = document.createElement('div');
    translationCard.className = 'translation-card';
    translationCard.innerHTML = `
        <h2>Translation Results</h2>
        <div class="translation-original">
            <strong>Original (${languages[detectedLang]?.name || detectedLang}):</strong>
            <div class="translation-text">${originalText}</div>
        </div>
        <div class="translation-result">
            <strong>Translated (${languages[targetLang]?.name || targetLang}):</strong>
            <div class="translation-text">${translatedText}</div>
        </div>
    `;
    
    // Add dictionary lookup option if text is a single word
    const translatedWord = translatedText.split(/\s+/)[0];
    if (translatedWord && translatedWord.length < 30 && !translatedWord.match(/[^\w']/)) {
        translationCard.innerHTML += `
            <button class="dict-lookup-btn" onclick="lookupTranslatedWord('${translatedWord}', '${targetLang}')">
                <i class="fas fa-book"></i> Look up "${translatedWord}" in dictionary
            </button>
        `;
    }
    
    translationResults.appendChild(translationCard);
}

// Look up translated word in dictionary
function lookupTranslatedWord(word, language) {
    // Switch to dictionary mode
    switchMode('dictionary');
    
    // Set the word and language
    wordInput.value = word;
    dictLanguageSelect.value = language;
    
    // Trigger search after a small delay
    setTimeout(searchDictionary, 300);
}

// Show translation error message
function showTranslationError(message) {
    translationResults.innerHTML = `
        <div class="translation-card">
            <h2>Error</h2>
            <div class="translation-text">${message}</div>
        </div>`;
}

// Translate word from dictionary results
function translateWord(word, sourceLang) {
    // Switch to translator mode
    switchMode('translator');
    
    // Set the text and languages
    textToTranslate.value = word;
    sourceLanguageSelect.value = sourceLang;
    
    // Focus on translation input
    setTimeout(() => {
        textToTranslate.focus();
    }, 300);
}

// Make functions available globally for HTML onclick attributes
window.playAudio = playAudio;
window.translateWord = translateWord;
window.lookupTranslatedWord = lookupTranslatedWord; 
