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

// Language codes and names for UI
const languages = {
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'zh': 'Chinese',
    'ja': 'Japanese',
    'ar': 'Arabic',
    'hi': 'Hindi'
};

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

// Dictionary API with fallback
async function lookup() {
    const word = input.value.trim();
    const language = document.getElementById('dictLanguage').value;
    output.innerHTML = '<div class="card"><div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Searching...</div></div>';
    
    if (!word) {
        output.innerHTML = '<div class="card"><div class="def">Please enter a word to search</div></div>';
        return;
    }

    try {
        // Try DictionaryAPI.dev first
        const dictRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/${language}/${encodeURIComponent(word)}`);
        
        if (dictRes.ok) {
            const data = await dictRes.json();
            displayDictionaryResults(data, language);
            return;
        }
        
        // If DictionaryAPI fails, try WordsAPI (note: requires API key in production)
        await fallbackDictionaryLookup(word, language);
        
    } catch (error) {
        console.error('Dictionary error:', error);
        output.innerHTML = `
            <div class="card">
                <h2>Oops!</h2>
                <div class="def">
                    No definition found for "<strong>${word}</strong>".
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
            if (audioPhonetic) {
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
                    ${d.example ? `<div class="example">“${d.example}”</div>` : ''}
                    ${d.synonyms && d.synonyms.length > 0 ? 
                        `<div class="synonyms">Synonyms: ${d.synonyms.join(', ')}</div>` : ''}
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

// Fallback dictionary API
async function fallbackDictionaryLookup(word, language) {
    // In production, you would use a fallback API here
    // For example, WordsAPI (requires API key) or another service
    throw new Error('Dictionary service unavailable. Try another word or language.');
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

// Translation API with fallback
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
        // Try LibreTranslate first
        const libretranslateRes = await fetch('https://libretranslate.de/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: text,
                source: sourceLang === 'auto' ? 'auto' : sourceLang,
                target: targetLang,
                format: 'text'
            })
        });
        
        if (libretranslateRes.ok) {
            const data = await libretranslateRes.json();
            displayTranslationResults(text, data.translatedText, data.detectedLanguage || { language: sourceLang });
            return;
        }
        
        // If LibreTranslate fails, try MyMemory API as fallback
        await fallbackTranslation(text, sourceLang, targetLang);
        
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

// Display translation results with dictionary lookup option
function displayTranslationResults(originalText, translatedText, detectedLanguage) {
    translationResults.innerHTML = '';
    
    // Main translation card
    const translationCard = document.createElement('div');
    translationCard.className = 'translation-card';
    translationCard.innerHTML = `
        <h2>Translation</h2>
        <div class="translation-original">
            <strong>Original (${languages[detectedLanguage.language] || detectedLanguage.language}):</strong>
            <div class="translation-text">${originalText}</div>
        </div>
        <div class="translation-result">
            <strong>Translated (${languages[document.getElementById('targetLanguage').value]}):</strong>
            <div class="translation-text">${translatedText}</div>
        </div>
        <div class="translation-meta">
            <span>Detected language: ${languages[detectedLanguage.language] || detectedLanguage.language}</span>
            ${detectedLanguage.confidence ? 
                `<span>Confidence: ${Math.round(detectedLanguage.confidence * 100)}%</span>` : ''}
        </div>
    `;
    
    // Add dictionary lookup option if text is a single word
    if (translatedText.split(/\s+/).length === 1) {
        const lookupBtn = document.createElement('button');
        lookupBtn.className = 'dict-lookup-btn';
        lookupBtn.innerHTML = `<i class="fas fa-book"></i> Look up "${translatedText}" in dictionary`;
        lookupBtn.onclick = () => {
            // Switch to dictionary mode
            document.querySelector('.mode-btn[data-mode="dictionary"]').click();
            // Set the word and language
            input.value = translatedText;
            document.getElementById('dictLanguage').value = document.getElementById('targetLanguage').value;
            // Trigger search
            setTimeout(() => {
                lookup();
            }, 300);
        };
        
        translationCard.appendChild(lookupBtn);
    }
    
    translationResults.appendChild(translationCard);
}

// Fallback translation API
async function fallbackTranslation(text, sourceLang, targetLang) {
    // Try MyMemory API as fallback
    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang === 'auto' ? 'auto' : sourceLang}|${targetLang}`);
        
        if (!response.ok) throw new Error('Translation service unavailable');
        
        const data = await response.json();
        
        if (data.responseData && data.responseData.translatedText) {
            displayTranslationResults(
                text, 
                data.responseData.translatedText, 
                { 
                    language: sourceLang === 'auto' ? data.responseData.detectedLanguage || 'en' : sourceLang,
                    confidence: data.responseData.match ? data.responseData.match / 100 : undefined
                }
            );
        } else {
            throw new Error('No translation found');
        }
    } catch (error) {
        throw new Error('Fallback translation service failed. Please try again later.');
    }
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
    Object.entries(languages).forEach(([code, name]) => {
        const option1 = document.createElement('option');
        option1.value = code;
        option1.textContent = name;
        dictLanguage.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = code;
        option2.textContent = name;
        sourceLanguage.appendChild(option2.cloneNode(true));
        
        const option3 = option2.cloneNode(true);
        targetLanguage.appendChild(option3);
    });
    
    // Set default target to English
    targetLanguage.value = 'en';
}

// Initialize the app
initLanguageDropdowns();
