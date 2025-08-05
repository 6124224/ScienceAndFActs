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

// Supported languages with detailed information
const languages = {
    'en': { name: 'English', nativeName: 'English', flag: '🇬🇧', apiCode: 'en' },
    'hi': { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', apiCode: 'hi' },
    'es': { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', apiCode: 'es' },
    'fr': { name: 'French', nativeName: 'Français', flag: '🇫🇷', apiCode: 'fr' },
    'de': { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', apiCode: 'de' },
    'it': { name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', apiCode: 'it' },
    'pt': { name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', apiCode: 'pt' },
    'ru': { name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', apiCode: 'ru' },
    'zh': { name: 'Chinese', nativeName: '中文', flag: '🇨🇳', apiCode: 'zh' },
    'ja': { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', apiCode: 'ja' },
    'ar': { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', apiCode: 'ar' }
};

// Dictionary cache to reduce API calls
const dictionaryCache = new Map();
// Translation cache
const translationCache = new Map();

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners
    setupEventListeners();
    
    // Set default theme based on user preference
    initTheme();
    
    // Focus on word input by default
    wordInput.focus();
    
    // Initialize with a sample word (optional)
    // wordInput.value = 'hello';
    // searchDictionary();
});

// Set up all event listeners
function setupEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Dictionary search
    searchBtn.addEventListener('click', searchDictionary);
    wordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            searchDictionary();
        }
    });
    
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
    
    // Input clearing
    wordInput.addEventListener('input', handleDictionaryInput);
    textToTranslate.addEventListener('input', handleTranslationInput);
    
    // History management
    window.addEventListener('popstate', handlePopState);
}

// Initialize theme based on user preference
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.dataset.theme = 'dark';
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
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
    // Update URL without reload
    history.pushState({ mode }, '', `?mode=${mode}`);
    
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

// Handle popstate events (back/forward navigation)
function handlePopState(event) {
    if (event.state && event.state.mode) {
        switchMode(event.state.mode);
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
    
    // If there's text to translate, translate it immediately
    if (textToTranslate.value.trim()) {
        translateText();
    }
}

// Handle dictionary input changes
function handleDictionaryInput() {
    // You could add live search functionality here
    // For performance, we'll just clear results if input is empty
    if (!wordInput.value.trim()) {
        resultsDiv.innerHTML = '';
    }
}

// Handle translation input changes
function handleTranslationInput() {
    // Clear results if input is empty
    if (!textToTranslate.value.trim()) {
        translationResults.innerHTML = '';
    }
}

// Search dictionary for word
async function searchDictionary() {
    const word = wordInput.value.trim();
    const language = dictLanguageSelect.value;
    
    if (!word) {
        showDictionaryError('Please enter a word to search');
        return;
    }
    
    // Check cache first
    const cacheKey = `${language}:${word.toLowerCase()}`;
    if (dictionaryCache.has(cacheKey)) {
        displayDictionaryResults(dictionaryCache.get(cacheKey), language);
        return;
    }
    
    // Show loading state
    resultsDiv.innerHTML = `
        <div class="card">
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i> Searching for "${word}"...
            </div>
        </div>`;
    
    try {
        // Use Free Dictionary API
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/${language}/${encodeURIComponent(word)}`);
        
        if (!response.ok) {
            // Try suggesting similar words if available
            const errorData = await response.json();
            if (errorData.title === 'No Definitions Found') {
                throw new Error(`No definition found for "${word}" in ${languages[language].name}.`);
            }
            throw new Error(errorData.message || 'Word not found');
        }
        
        const data = await response.json();
        
        // Cache the result
        dictionaryCache.set(cacheKey, data);
        
        // Display results
        displayDictionaryResults(data, language);
        
        // Add to search history
        addToHistory(word, language, 'dictionary');
        
    } catch (error) {
        console.error('Dictionary error:', error);
        showDictionaryError(error.message || `Failed to find "${word}" in ${languages[language].name} dictionary.`);
        
        // If it's a simple "not found" error, try suggesting similar words
        if (error.message.includes('not found') || error.message.includes('No definition')) {
            try {
                await suggestSimilarWords(word, language);
            } catch (suggestError) {
                console.log('Could not suggest similar words:', suggestError);
            }
        }
    }
}

// Display dictionary results
function displayDictionaryResults(data, language) {
    resultsDiv.innerHTML = '';
    
    data.forEach((entry, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h2>${entry.word}</h2>
            ${entry.phonetic ? `<div class="phonetic">${entry.phonetic}</div>` : ''}
        `;
        
        // Add pronunciation audio if available
        const audioPhonetic = entry.phonetics?.find(p => p.audio);
        if (audioPhonetic?.audio) {
            card.innerHTML += `
                <button class="audio-btn" onclick="playAudio('${audioPhonetic.audio}')">
                    <i class="fas fa-volume-up"></i> ${audioPhonetic.text || 'Listen'}
                </button>
            `;
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
                    <i class="fas fa-language"></i> Translate "${entry.word}"
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
            <h2><i class="fas fa-exclamation-circle"></i> Oops!</h2>
            <div class="def">${message}</div>
        </div>`;
}

// Try to suggest similar words when search fails
async function suggestSimilarWords(word, language) {
    // This is a simple implementation - you could use a more advanced algorithm
    // or a dedicated API for better suggestions
    
    // For English, we'll try to find words that start similarly
    if (language === 'en') {
        try {
            const response = await fetch(`https://api.datamuse.com/words?sp=${word}*&max=5`);
            const suggestions = await response.json();
            
            if (suggestions.length > 0) {
                const suggestionsHTML = suggestions.map(s => 
                    `<li><a href="javascript:void(0)" onclick="useSuggestion('${s.word}')">${s.word}</a></li>`
                ).join('');
                
                resultsDiv.innerHTML += `
                    <div class="card">
                        <h3>Did you mean:</h3>
                        <ul class="suggestions">
                            ${suggestionsHTML}
                        </ul>
                    </div>`;
            }
        } catch (error) {
            console.error('Suggestion error:', error);
        }
    }
}

// Use a suggested word
function useSuggestion(word) {
    wordInput.value = word;
    searchDictionary();
}

// Play pronunciation audio
function playAudio(audioUrl) {
    if (!audioUrl) return;
    
    try {
        // Check if audio is already playing
        const existingAudio = document.querySelector('audio');
        if (existingAudio) {
            existingAudio.pause();
            existingAudio.remove();
        }
        
        const audio = new Audio(audioUrl);
        audio.play().catch(e => {
            console.error('Audio playback failed:', e);
            showDictionaryError('Could not play pronunciation');
        });
    } catch (error) {
        console.error('Error playing audio:', error);
        showDictionaryError('Error playing pronunciation');
    }
}

// Translate text using LibreTranslate
async function translateText() {
    const text = textToTranslate.value.trim();
    const sourceLang = sourceLanguageSelect.value;
    const targetLang = targetLanguageSelect.value;
    
    if (!text) {
        showTranslationError('Please enter text to translate');
        return;
    }
    
    // Check cache first
    const cacheKey = `${sourceLang}-${targetLang}:${text}`;
    if (translationCache.has(cacheKey)) {
        displayTranslationResults(
            text,
            translationCache.get(cacheKey).translatedText,
            sourceLang === 'auto' ? translationCache.get(cacheKey).detectedLanguage || 'en' : sourceLang,
            targetLang
        );
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
            // Cache the result
            const resultToCache = {
                translatedText: data.translatedText,
                detectedLanguage: data.detectedLanguage?.language
            };
            translationCache.set(cacheKey, resultToCache);
            
            displayTranslationResults(
                text,
                data.translatedText,
                sourceLang === 'auto' ? (data.detectedLanguage?.language || 'en') : sourceLang,
                targetLang
            );
            
            // Add to translation history
            addToHistory(text, `${sourceLang}-${targetLang}`, 'translation');
        } else {
            throw new Error('No translation found');
        }
    } catch (error) {
        console.error('Translation error:', error);
        showTranslationError(`Failed to translate: ${error.message || 'Service unavailable'}`);
        
        // Fallback to MyMemory API if LibreTranslate fails
        if (error.message.includes('unavailable')) {
            console.log('Trying MyMemory fallback...');
            await translateWithMyMemory(text, sourceLang, targetLang);
        }
    }
}

// Fallback translation using MyMemory API
async function translateWithMyMemory(text, sourceLang, targetLang) {
    try {
        // MyMemory API endpoint
        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang === 'auto' ? 'en' : sourceLang}|${targetLang}`
        );
        
        const data = await response.json();
        
        if (data.responseData && data.responseData.translatedText) {
            displayTranslationResults(
                text,
                data.responseData.translatedText,
                sourceLang === 'auto' ? 'en' : sourceLang,
                targetLang
            );
        } else {
            throw new Error('Fallback translation failed');
        }
    } catch (fallbackError) {
        console.error('MyMemory fallback failed:', fallbackError);
        showTranslationError('Translation service is currently unavailable. Please try again later.');
    }
}

// Display translation results
function displayTranslationResults(originalText, translatedText, detectedLang, targetLang) {
    translationResults.innerHTML = '';
    
    const translationCard = document.createElement('div');
    translationCard.className = 'translation-card';
    
    // Format the detected language name
    const detectedLangName = languages[detectedLang]?.name || detectedLang;
    const targetLangName = languages[targetLang]?.name || targetLang;
    
    translationCard.innerHTML = `
        <h2>Translation Results</h2>
        <div class="translation-original">
            <div class="language-label">
                <span class="language-flag">${languages[detectedLang]?.flag || '🌐'}</span>
                <strong>${detectedLangName}</strong>
            </div>
            <div class="translation-text">${originalText}</div>
        </div>
        <div class="translation-result">
            <div class="language-label">
                <span class="language-flag">${languages[targetLang]?.flag || '🌐'}</span>
                <strong>${targetLangName}</strong>
            </div>
            <div class="translation-text">${translatedText}</div>
        </div>
        <div class="translation-meta">
            <small>Translated from ${detectedLangName} to ${targetLangName}</small>
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
    
    // Add copy button
    translationCard.innerHTML += `
        <button class="dict-lookup-btn" onclick="copyToClipboard('${translatedText.replace(/'/g, "\\'")}')">
            <i class="fas fa-copy"></i> Copy Translation
        </button>
    `;
    
    translationResults.appendChild(translationCard);
}

// Copy text to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show a small notification
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = 'Copied to clipboard!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
}

// Show translation error message
function showTranslationError(message) {
    translationResults.innerHTML = `
        <div class="translation-card">
            <h2><i class="fas fa-exclamation-circle"></i> Error</h2>
            <div class="translation-text">${message}</div>
        </div>`;
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

// Add search to history
function addToHistory(query, lang, type) {
    // In a real app, you might save this to localStorage
    // or send to a backend for persistent history
    console.log(`Added to ${type} history:`, { query, lang });
}

// Make functions available globally for HTML onclick attributes
window.playAudio = playAudio;
window.translateWord = translateWord;
window.lookupTranslatedWord = lookupTranslatedWord;
window.useSuggestion = useSuggestion;
window.copyToClipboard = copyToClipboard;
