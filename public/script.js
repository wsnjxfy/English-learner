let chapters = [];
let currentChapterIndex = 0;
let currentChapter = [];
let currentSentenceIndex = 0;

const englishDiv = document.getElementById('english');
const translationDiv = document.getElementById('translation');
const nextBtn = document.getElementById('nextBtn');
const translateBtn = document.getElementById('translateBtn');
const chapterSelect = document.getElementById('chapterSelect');
const sentenceSelect = document.getElementById('sentenceSelect');

async function initChapters() {
  try {
    const res = await fetch('/api/chapters');
    chapters = await res.json();

    if (!chapters || chapters.length === 0) {
      englishDiv.innerText = '未找到章节';
      return;
    }

    updateChapterSelect();
    await loadChapter(0);
  } catch (err) {
    console.error('加载章节失败', err);
    englishDiv.innerText = '加载章节失败';
  }
}

async function loadChapter(index) {
  currentChapterIndex = index;
  currentSentenceIndex = 0;

  try {
    const res = await fetch(chapters[index].file);
    const data = await res.json();

    currentChapter = Object.keys(data).map(key => ({
      english: key,
      translation: data[key].translation
    }));

    updateSentenceSelect();
    showCurrentSentence();
  } catch (err) {
    console.error('加载章节失败', err);
    englishDiv.innerText = '加载章节失败';
  }
}

function showCurrentSentence() {
  const sentence = currentChapter[currentSentenceIndex];
  if (!sentence) return;
  englishDiv.innerText = sentence.english;
  translationDiv.innerText = sentence.translation;
  translationDiv.style.display = 'none';
  sentenceSelect.value = currentSentenceIndex;
}

translateBtn.addEventListener('click', () => {
  translationDiv.style.display = 'block';
});

nextBtn.addEventListener('click', () => {
  if (currentSentenceIndex < currentChapter.length - 1) {
    currentSentenceIndex++;
    showCurrentSentence();
  } else {
    alert('已经是本章最后一句');
  }
});

function updateChapterSelect() {
  chapterSelect.innerHTML = '';
  chapters.forEach((c, i) => {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = c.name.replace(/_/g, ' ');
    if (i === currentChapterIndex) option.selected = true;
    chapterSelect.appendChild(option);
  });
}

chapterSelect.addEventListener('change', (e) => {
  const idx = parseInt(e.target.value);
  if (!isNaN(idx)) loadChapter(idx);
});

function updateSentenceSelect() {
  sentenceSelect.innerHTML = '';
  currentChapter.forEach((s, i) => {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `句 ${i + 1}`;
    if (i === currentSentenceIndex) option.selected = true;
    sentenceSelect.appendChild(option);
  });
}

sentenceSelect.addEventListener('change', (e) => {
  const idx = parseInt(e.target.value);
  if (!isNaN(idx)) {
    currentSentenceIndex = idx;
    showCurrentSentence();
  }
});

window.addEventListener('DOMContentLoaded', initChapters);
