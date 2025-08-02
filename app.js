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

// Dictionary API
async function lookup() {
  const word = input.value.trim();
  const language = document.getElementById('dictLanguage').value;
  output.innerHTML = '';
  if (!word) return;

  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/${language}/${word}`
    );
    if (!res.ok) throw new Error('Word not found');
    const data = await res.json();

    data.forEach(entry => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h2>${entry.word}</h2>
        ${entry.phonetic ? `<div class="phonetic">${entry.phonetic}</div>` : ''}
      `;
      entry.meanings.forEach(m => {
        card.innerHTML += `<div class="pos">${m.partOfSpeech}</div>`;
        m.definitions.forEach((d,i) => {
          card.innerHTML += `
            <div class="def"><strong>${i+1}.</strong> ${d.definition}</div>
            ${d.example ? `<div class="example">“${d.example}”</div>` : ''}
          `;
        });
      });
      output.appendChild(card);
    });
  } catch (error) {
    output.innerHTML = `
      <div class="card">
        <h2>Oops!</h2>
        <div class="def">
          No definition found for "<strong>${word}</strong>".
          ${error.message === 'Word not found' ? 'Try another word or language.' : ''}
        </div>
      </div>`;
  }
}

// Translation API (using LibreTranslate)
async function translateText() {
  const text = textToTranslate.value.trim();
  const sourceLang = document.getElementById('sourceLanguage').value;
  const targetLang = document.getElementById('targetLanguage').value;
  
  if (!text) return;
  
  translationResults.innerHTML = `
    <div class="translation-card">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i> Translating...
      </div>
    </div>`;
  
  try {
    // Using LibreTranslate (you may need to set up your own instance or use an alternative)
    const response = await fetch('https://libretranslate.de/translate', {
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
    
    if (!response.ok) throw new Error('Translation failed');
    
    const data = await response.json();
    
    translationResults.innerHTML = `
      <div class="translation-card">
        <h2>Translation</h2>
        <div class="translation-text">${data.translatedText}</div>
        <div class="translation-meta">
          <span>Detected language: ${data.detectedLanguage?.language || sourceLang}</span>
          <span>Confidence: ${data.detectedLanguage?.confidence ? Math.round(data.detectedLanguage.confidence * 100) + '%' : 'N/A'}</span>
        </div>
      </div>`;
  } catch (error) {
    translationResults.innerHTML = `
      <div class="translation-card">
        <h2>Error</h2>
        <div class="translation-text">
          Failed to translate: ${error.message}
        </div>
        <div class="translation-meta">
          Please try again later or use shorter text.
        </div>
      </div>`;
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
