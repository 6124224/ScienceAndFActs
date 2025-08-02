// DOM Elements
const btn = document.getElementById('searchBtn');
const input = document.getElementById('wordInput');
const output = document.getElementById('results');
const toggle = document.getElementById('themeToggle');
const translateBtn = document.getElementById('translateBtn');
const textToTranslate = document.getElementById('textToTranslate');
const translationResults = document.getElementById('translationResults');
const modeButtons = document.querySelectorAll('.mode-btn');
const dictionarySearch = document.getElementById('dictionarySearch');
const translatorSearch = document.getElementById('translatorSearch');
const swapBtn = document.getElementById('swapLanguages');
const translatorDictInput = document.getElementById('translatorDictInput');
const translatorDictBtn = document.getElementById('translatorDictBtn');

// Add this event listener
translatorDictBtn.addEventListener('click', () => {
  const word = translatorDictInput.value.trim();
  if (!word) return;
  
  // Use the target language from translator
  const targetLang = document.getElementById('targetLanguage').value;
  
  // Show results in translationResults div
  translationResults.innerHTML = '<div class="card"><div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Searching...</div></div>';
  
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/${targetLang}/${word}`)
    .then(response => response.json())
    .then(data => {
      // Reuse your existing displayDictionaryResults function
      displayDictionaryResults(data, targetLang, translationResults);
    })
    .catch(error => {
      translationResults.innerHTML = `
        <div class="card">
          <h2>Error</h2>
          <div class="def">Couldn't find "${word}" in ${languages[targetLang].name}</div>
        </div>`;
    });
});

// Modify your existing displayDictionaryResults function to accept container parameter
function displayDictionaryResults(data, language, container = output) {
  container.innerHTML = '';
  // ... rest of your existing function code ...
}
// Supported languages with names and codes
const languages = {
    'en': { name: 'English', apiCode: 'en' },
    'es': { name: 'Spanish', apiCode: 'es' },
    'fr': { name: 'French', apiCode: 'fr' },
    'de': { name: 'German', apiCode: 'de' },
    'it': { name: 'Italian', apiCode: 'it' },
    'pt': { name: 'Portuguese', apiCode: 'pt' },
    'ru': { name: 'Russian', apiCode: 'ru' },
    'zh': { name: 'Chinese', apiCode: 'zh' },
    'ja': { name: 'Japanese', apiCode: 'ja' },
    'ar': { name: 'Arabic', apiCode: 'ar' },
    'hi': { name: 'Hindi', apiCode: 'hi' }
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initLanguageDropdowns();
});

// Dark/Light toggle
toggle.addEventListener('click', () => {
    const isDark = document.body.dataset.theme === 'dark';
    document.body.dataset.theme = isDark ? '' : 'dark';
    toggle.innerHTML = isDark
        ? '<i class="fas fa-moon"></i>'
        : '<i class="fas fa-sun"></i>';
});

// Mode Toggle
modeButtons.forEach(button => {
    button.addEventListener('click', () => {
        modeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        if (button.dataset.mode === 'dictionary') {
            dictionarySearch.classList.remove('hidden');
            translatorSearch.classList.add('hidden');
            output.classList.remove('hidden');
            translationResults.classList.add('hidden');
        } else {
            dictionarySearch.classList.add('hidden');
            translatorSearch.classList.remove('hidden');
            output.classList.add('hidden');
            translationResults.classList.remove('hidden');
        }
    });
});

// Swap Languages
swapBtn.addEventListener('click', () => {
    const source = document.getElementById('sourceLanguage');
    const target = document.getElementById('targetLanguage');
    const temp = source.value;
    
    // Don't swap if source is 'auto'
    if (temp === 'auto') return;
    
    source.value = target.value;
    target.value = temp;
});

// Initialize language dropdowns
function initLanguageDropdowns() {
    const dictLanguage = document.getElementById('dictLanguage');
    const sourceLanguage = document.getElementById('sourceLanguage');
    const targetLanguage = document.getElementById('targetLanguage');
    
    // Clear existing options
    dictLanguage.innerHTML = '';
    sourceLanguage.innerHTML = '<option value="auto">Detect Language</option>';
    targetLanguage.innerHTML = '';
    
    // Add language options
    Object.entries(languages).forEach(([code, lang]) => {
        const option1 = document.createElement('option');
        option1.value = code;
        option1.textContent = lang.name;
        dictLanguage.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = code;
        option2.textContent = lang.name;
        sourceLanguage.appendChild(option2.cloneNode(true));
        
        const option3 = option2.cloneNode(true);
        targetLanguage.appendChild(option3);
    });
    
    // Set default target to English
    targetLanguage.value = 'en';
}

// Dictionary API using Free Dictionary API
async function lookup() {
    const word = input.value.trim();
    const language = document.getElementById('dictLanguage').value;
    output.innerHTML = '<div class="card"><div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Searching dictionary...</div></div>';
    
    if (!word) {
        output.innerHTML = '<div class="card"><div class="def">Please enter a word to search</div></div>';
        return;
    }

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/${language}/${encodeURIComponent(word)}`);
        
        if (!response.ok) {
            throw new Error(`Word not found in ${languages[language].name} dictionary`);
        }
        
        const data = await response.json();
        displayDictionaryResults(data, language);
        
    } catch (error) {
        console.error('Dictionary error:', error);
        output.innerHTML = `
            <div class="card">
                <h2>Oops!</h2>
                <div class="def">
                    No definition found for "<strong>${word}</strong>" in ${languages[language].name}.
                    ${error.message ? error.message : 'Try another word or language.'}
                </div>
            </div>`;
    }
}

// Display dictionary results
function displayDictionaryResults(data, language) {
    output.innerHTML = '';
    
    data.forEach(entry => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h2>${entry.word}</h2>
            ${entry.phonetic ? `<div class="phonetic">${entry.phonetic}</div>` : ''}
        `;
        
        // Add pronunciation audio if available
        if (entry.phonetics && entry.phonetics.length > 0) {
            const audioPhonetic = entry.phonetics.find(p => p.audio);
            if (audioPhonetic && audioPhonetic.audio) {
                card.innerHTML += `
                    <button class="audio-btn" onclick="playAudio('${audioPhonetic.audio}')">
                        <i class="fas fa-volume-up"></i> Listen
                    </button>
                `;
            }
        }
        
        entry.meanings.forEach(m => {
            card.innerHTML += `<div class="pos">${m.partOfSpeech}</div>`;
            m.definitions.forEach((d, i) => {
                card.innerHTML += `
                    <div class="def"><strong>${i+1}.</strong> ${d.definition}</div>
                    ${d.example ? `<div class="example">"${d.example}"</div>` : ''}
                    ${d.synonyms && d.synonyms.length > 0 ? 
                        `<div class="synonyms"><strong>Synonyms:</strong> ${d.synonyms.join(', ')}</div>` : ''}
                    ${d.antonyms && d.antonyms.length > 0 ? 
                        `<div class="antonyms"><strong>Antonyms:</strong> ${d.antonyms.join(', ')}</div>` : ''}
                `;
            });
        });
        
        // Add translation option
        card.innerHTML += `
            <div class="translate-option">
                <button onclick="translateWord('${entry.word}', '${language}')">
                    <i class="fas fa-language"></i> Translate this word
                </button>
            </div>
        `;
        
        output.appendChild(card);
    });
}

// Play pronunciation audio
function playAudio(audioUrl) {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audio.play().catch(e => console.error('Audio playback failed:', e));
}

// Translate word from dictionary results
async function translateWord(word, sourceLang) {
    // Switch to translator mode
    document.querySelector('.mode-btn[data-mode="translator"]').click();
    
    // Set the text and languages
    textToTranslate.value = word;
    document.getElementById('sourceLanguage').value = sourceLang;
    
    // Trigger translation
    setTimeout(() => {
        translateText();
    }, 300);
}

// Translation using MyMemory API (no API key needed)
async function translateText() {
    const text = textToTranslate.value.trim();
    const sourceLang = document.getElementById('sourceLanguage').value;
    const targetLang = document.getElementById('targetLanguage').value;
    
    if (!text) {
        translationResults.innerHTML = '<div class="translation-card"><div class="translation-text">Please enter text to translate</div></div>';
        return;
    }
    
    translationResults.innerHTML = `
        <div class="translation-card">
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i> Translating...
            </div>
        </div>`;
    
    try {
        // Use MyMemory API as it doesn't require an API key
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang === 'auto' ? 'auto' : sourceLang}|${targetLang}`);
        
        if (!response.ok) throw new Error('Translation service unavailable');
        
        const data = await response.json();
        
        if (data.responseData && data.responseData.translatedText) {
            displayTranslationResults(
                text, 
                data.responseData.translatedText, 
                { 
                    language: sourceLang === 'auto' ? (data.responseData.detectedLanguage || 'en') : sourceLang,
                    confidence: data.responseData.match ? (data.responseData.match / 100) : undefined
                },
                targetLang
            );
        } else {
            throw new Error('No translation found');
        }
    } catch (error) {
        console.error('Translation error:', error);
        translationResults.innerHTML = `
            <div class="translation-card">
                <h2>Error</h2>
                <div class="translation-text">
                    Failed to translate: ${error.message || 'Service unavailable'}
                </div>
                <div class="translation-meta">
                    Please try again later or use shorter text.
                </div>
            </div>`;
    }
}

// Display translation results
function displayTranslationResults(originalText, translatedText, detectedLanguage, targetLang) {
    translationResults.innerHTML = '';
    
    // Main translation card
    const translationCard = document.createElement('div');
    translationCard.className = 'translation-card';
    translationCard.innerHTML = `
        <h2>Translation Results</h2>
        <div class="translation-original">
            <strong>Original (${languages[detectedLanguage.language]?.name || detectedLanguage.language}):</strong>
            <div class="translation-text">${originalText}</div>
        </div>
        <div class="translation-result">
            <strong>Translated (${languages[targetLang]?.name || targetLang}):</strong>
            <div class="translation-text">${translatedText}</div>
        </div>
        ${detectedLanguage.confidence ? `
            <div class="translation-meta">
                <span>Detection confidence: ${Math.round(detectedLanguage.confidence * 100)}%</span>
            </div>
        ` : ''}
    `;
    
    // Add dictionary lookup option if text is a single word
    const translatedWord = translatedText.split(/\s+/)[0];
    if (translatedWord && translatedWord.length > 0 && translatedWord.length < 30 && !translatedWord.match(/[^\w']/)) {
        const lookupBtn = document.createElement('button');
        lookupBtn.className = 'dict-lookup-btn';
        lookupBtn.innerHTML = `<i class="fas fa-book"></i> Look up "${translatedWord}" in dictionary`;
        lookupBtn.onclick = () => {
            // Switch to dictionary mode
            document.querySelector('.mode-btn[data-mode="dictionary"]').click();
            // Set the word and language
            input.value = translatedWord;
            document.getElementById('dictLanguage').value = targetLang;
            // Trigger search
            setTimeout(() => {
                lookup();
            }, 300);
        };
        translationCard.appendChild(lookupBtn);
    }
    
    translationResults.appendChild(translationCard);
}

// Event Listeners
btn.addEventListener('click', lookup);
input.addEventListener('keydown', e => e.key === 'Enter' && lookup());
translateBtn.addEventListener('click', translateText);
textToTranslate.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        translateText();
    }
});

