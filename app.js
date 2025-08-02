// DOM Elements
const btn = document.getElementById('searchBtn');
const translateBtn = document.getElementById('translateBtn');
const input = document.getElementById('wordInput');
const output = document.getElementById('results');
const toggle = document.getElementById('themeToggle');
const sourceLang = document.getElementById('sourceLang');
const targetLang = document.getElementById('targetLang');
const swapLangs = document.getElementById('swapLangs');
const apiStatus = document.getElementById('apiStatus');

// Dark/Light toggle
toggle.addEventListener('click', () => {
  const isDark = document.body.dataset.theme === 'dark';
  document.body.dataset.theme = isDark ? '' : 'dark';
  toggle.innerHTML = isDark 
    ? '<i class="fas fa-moon"></i>'
    : '<i class="fas fa-sun"></i>';
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
});

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
  document.body.dataset.theme = 'dark';
  toggle.innerHTML = '<i class="fas fa-sun"></i>';
}

// Swap languages
swapLangs.addEventListener('click', () => {
  const temp = sourceLang.value;
  sourceLang.value = targetLang.value;
  targetLang.value = temp;
});

// Dictionary API (DictionaryAPI.dev)
async function lookupWord(word, lang = 'en') {
  if (!word) return null;
  
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/${lang}/${word}`
    );
    
    if (!res.ok) throw new Error('Word not found');
    return await res.json();
  } catch (error) {
    console.error('Dictionary API error:', error);
    return null;
  }
}

// Translation API (LibreTranslate - you may need to set up your own instance)
async function translateText(text, sourceLang, targetLang) {
  if (!text || sourceLang === targetLang) return null;
  
  try {
    // Note: LibreTranslate is a free open-source option, but you may need to host your own instance
    // or use another translation API like Google Cloud Translate or Microsoft Translator
    const res = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang
      }),
      headers: { "Content-Type": "application/json" }
    });
    
    if (!res.ok) throw new Error('Translation failed');
    return await res.json();
  } catch (error) {
    console.error('Translation API error:', error);
    return null;
  }
}

// Display dictionary results
function displayDictionaryResults(data, word) {
  output.innerHTML = '';
  
  if (!data || data.length === 0) {
    output.innerHTML = `
      <div class="card">
        <h2>Oops!</h2>
        <div class="def">
          No definition found for "<strong>${word}</strong>".
        </div>
      </div>`;
    return;
  }
  
  data.forEach(entry => {
    const card = document.createElement('div');
    card.className = 'card';
    
    // Word and phonetic
    card.innerHTML = `
      <h2>${entry.word}</h2>
      ${entry.phonetic ? `<div class="phonetic">${entry.phonetic}</div>` : ''}
    `;
    
    // Meanings
    entry.meanings.forEach(m => {
      card.innerHTML += `<div class="pos">${m.partOfSpeech}</div>`;
      
      m.definitions.forEach((d, i) => {
        card.innerHTML += `
          <div class="def"><strong>${i+1}.</strong> ${d.definition}</div>
          ${d.example ? `<div class="example">"${d.example}"</div>` : ''}
          ${d.synonyms && d.synonyms.length ? `
            <div class="synonyms"><strong>Synonyms:</strong> ${d.synonyms.join(', ')}</div>
          ` : ''}
        `;
      });
    });
    
    // Audio pronunciation if available
    if (entry.phonetics && entry.phonetics.some(p => p.audio)) {
      const phoneticWithAudio = entry.phonetics.find(p => p.audio);
      card.innerHTML += `
        <button class="play-audio" onclick="playAudio('${phoneticWithAudio.audio}')">
          <i class="fas fa-volume-up"></i> Listen
        </button>
      `;
    }
    
    output.appendChild(card);
  });
}

// Display translation results
function displayTranslationResult(text, translation, sourceLang, targetLang) {
  output.innerHTML = '';
  
  const card = document.createElement('div');
  card.className = 'card';
  
  card.innerHTML = `
    <h2><i class="fas fa-language"></i> Translation</h2>
    <div class="translation-result">
      <h3>${getLanguageName(sourceLang)}</h3>
      <div class="def">${text}</div>
      <h3>${getLanguageName(targetLang)}</h3>
      <div class="def">${translation}</div>
    </div>
  `;
  
  output.appendChild(card);
}

// Play audio pronunciation
function playAudio(audioUrl) {
  if (!audioUrl) return;
  const audio = new Audio(audioUrl);
  audio.play().catch(e => console.error('Audio playback failed:', e));
}

// Get full language name from code
function getLanguageName(code) {
  const languages = {
    en: 'English',
    zh: 'Chinese',
    es: 'Spanish',
    hi: 'Hindi',
    ar: 'Arabic',
    pt: 'Portuguese',
    bn: 'Bengali',
    ru: 'Russian',
    ja: 'Japanese',
    pa: 'Punjabi',
    de: 'German',
    fr: 'French'
  };
  return languages[code] || code;
}

// Show loading state
function showLoading() {
  output.innerHTML = '<div class="loader"></div>';
}

// Check API status
async function checkAPIStatus() {
  try {
    // Check dictionary API
    const dictRes = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/hello');
    // Check translation API
    const transRes = await fetch('https://libretranslate.de/languages');
    
    if (!dictRes.ok || !transRes.ok) throw new Error('API issues');
    
    apiStatus.querySelector('span').className = 'online';
    apiStatus.querySelector('span').textContent = 'Online';
  } catch (error) {
    apiStatus.querySelector('span').className = 'offline';
    apiStatus.querySelector('span').textContent = 'Limited (some features may not work)';
  }
}

// Event listeners
btn.addEventListener('click', async () => {
  const word = input.value.trim();
  if (!word) return;
  
  showLoading();
  const data = await lookupWord(word, sourceLang.value);
  displayDictionaryResults(data, word);
});

translateBtn.addEventListener('click', async () => {
  const text = input.value.trim();
  if (!text) return;
  
  showLoading();
  const translation = await translateText(text, sourceLang.value, targetLang.value);
  
  if (translation) {
    displayTranslationResult(text, translation.translatedText, sourceLang.value, targetLang.value);
  } else {
    output.innerHTML = `
      <div class="card">
        <h2>Translation Error</h2>
        <div class="def">
          Could not translate "<strong>${text}</strong>".
        </div>
      </div>`;
  }
});

input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const activeBtn = document.activeElement === translateBtn ? translateBtn : btn;
    activeBtn.click();
  }
});

// Initialize
checkAPIStatus();