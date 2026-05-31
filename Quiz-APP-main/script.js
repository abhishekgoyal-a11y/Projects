/* ============================================================
   Brain Quest – script.js
   Quiz engine: timer, answer checking, feedback, results
   ============================================================ */

'use strict';

/* ---------- Question Bank ---------- */
const questions = [
  {
    cat: 'Science',
    q: 'What is the powerhouse of the cell?',
    opts: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi apparatus'],
    ans: 1
  },
  {
    cat: 'Technology',
    q: "What does 'HTTP' stand for?",
    opts: [
      'HyperText Transfer Protocol',
      'High Transfer Text Protocol',
      'Hyper Transfer Tech Protocol',
      'HyperText Tech Process'
    ],
    ans: 0
  },
  {
    cat: 'Math',
    q: 'What is the value of π (pi) to two decimal places?',
    opts: ['3.12', '3.14', '3.16', '3.18'],
    ans: 1
  },
  {
    cat: 'Science',
    q: 'How many planets are in our solar system?',
    opts: ['7', '8', '9', '10'],
    ans: 1
  },
  {
    cat: 'Technology',
    q: 'Which language is primarily used for styling web pages?',
    opts: ['JavaScript', 'Python', 'CSS', 'HTML'],
    ans: 2
  },
  {
    cat: 'History',
    q: 'In which year did World War II end?',
    opts: ['1943', '1944', '1945', '1946'],
    ans: 2
  },
  {
    cat: 'Science',
    q: 'What gas do plants absorb from the atmosphere during photosynthesis?',
    opts: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
    ans: 2
  },
  {
    cat: 'Technology',
    q: 'What does CPU stand for?',
    opts: [
      'Central Processing Unit',
      'Computer Personal Unit',
      'Core Processing Unit',
      'Central Program Utility'
    ],
    ans: 0
  },
  {
    cat: 'Math',
    q: 'What is the square root of 144?',
    opts: ['11', '12', '13', '14'],
    ans: 1
  },
  {
    cat: 'History',
    q: 'Who was the first person to walk on the Moon?',
    opts: ['Buzz Aldrin', 'Yuri Gagarin', 'Neil Armstrong', 'John Glenn'],
    ans: 2
  },
  {
    cat: 'Geography',
    q: 'Which is the largest ocean on Earth?',
    opts: ['Atlantic Ocean', 'Indian Ocean', 'Pacific Ocean', 'Arctic Ocean'],
    ans: 2
  },
  {
    cat: 'Science',
    q: 'Which part of the human body pumps blood?',
    opts: ['Lungs', 'Heart', 'Kidneys', 'Brain'],
    ans: 1
  },
  {
    cat: 'Technology',
    q: 'Which company created the Android operating system?',
    opts: ['Apple', 'Microsoft', 'Google', 'Samsung'],
    ans: 2
  },
  {
    cat: 'Math',
    q: 'What is 15 multiplied by 6?',
    opts: ['60', '75', '90', '105'],
    ans: 2
  },
  {
    cat: 'History',
    q: 'Who is known as the Father of the Indian Constitution?',
    opts: ['Mahatma Gandhi', 'B. R. Ambedkar', 'Jawaharlal Nehru', 'Sardar Patel'],
    ans: 1
  },
  {
    cat: 'Geography',
    q: 'What is the capital city of Australia?',
    opts: ['Sydney', 'Melbourne', 'Canberra', 'Perth'],
    ans: 2
  },
  {
    cat: 'Science',
    q: 'What is the chemical symbol for water?',
    opts: ['O2', 'H2O', 'CO2', 'NaCl'],
    ans: 1
  },
  {
    cat: 'Technology',
    q: 'What does RAM stand for?',
    opts: ['Random Access Memory', 'Read Active Module', 'Rapid App Machine', 'Run Access Method'],
    ans: 0
  },
  {
    cat: 'Math',
    q: 'How many degrees are in a right angle?',
    opts: ['45', '60', '90', '180'],
    ans: 2
  },
  {
    cat: 'Sports',
    q: 'How many players are there in a standard cricket team?',
    opts: ['9', '10', '11', '12'],
    ans: 2
  },
  {
    cat: 'Science',
    q: 'Which planet is known as the Red Planet?',
    opts: ['Venus', 'Mars', 'Jupiter', 'Mercury'],
    ans: 1
  },
  {
    cat: 'General',
    q: 'Which instrument is used to measure temperature?',
    opts: ['Barometer', 'Thermometer', 'Hygrometer', 'Speedometer'],
    ans: 1
  },
  {
    cat: 'Technology',
    q: 'Which tag is used to create a hyperlink in HTML?',
    opts: ['link', 'a', 'href', 'url'],
    ans: 1
  },
  {
    cat: 'Geography',
    q: 'Which country is famous for the Eiffel Tower?',
    opts: ['Italy', 'France', 'Germany', 'Spain'],
    ans: 1
  },
  {
    cat: 'General',
    q: 'How many colors are in a rainbow?',
    opts: ['5', '6', '7', '8'],
    ans: 2
  }
];

/* ---------- State ---------- */
let current    = 0;
let score      = 0;
let skipped    = 0;
let answered   = false;
let timerInterval;
let timeLeft   = 20;
let startTime  = null;
let totalTime  = 0;
let activeQuestions = [];

const TIMER_MAX = 20;
const ROUND_SIZE = 10;
const CIRC      = 2 * Math.PI * 58; // SVG ring circumference (r=58)

/* ---------- DOM References ---------- */
const startScreen  = document.getElementById('startScreen');
const quizScreen   = document.getElementById('quizScreen');
const resultScreen = document.getElementById('resultScreen');

const btnStart   = document.getElementById('btnStart');
const btnNext    = document.getElementById('btnNext');
const btnRestart = document.getElementById('btnRestart');

const qNum        = document.getElementById('qNum');
const qCat        = document.getElementById('qCat');
const qText       = document.getElementById('qText');
const progressBar = document.getElementById('progressBar');
const timerBox    = document.getElementById('timerBox');
const optionsGrid = document.getElementById('optionsGrid');
const feedbackBar = document.getElementById('feedbackBar');

const scorePercent = document.getElementById('scorePercent');
const resultTitle  = document.getElementById('resultTitle');
const resultSub    = document.getElementById('resultSub');
const resCorrect   = document.getElementById('resCorrect');
const resWrong     = document.getElementById('resWrong');
const resTime      = document.getElementById('resTime');
const resSkipped   = document.getElementById('resSkipped');
const scoreDash    = document.getElementById('scoreDash');

/* ---------- Event Listeners ---------- */
btnStart.addEventListener('click', startQuiz);
btnNext.addEventListener('click', nextQuestion);
btnRestart.addEventListener('click', restartQuiz);

/* ---------- Screen Management ---------- */
function showScreen(id) {
  [startScreen, quizScreen, resultScreen].forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  target.classList.add('active');
  // Re-trigger animation
  void target.offsetWidth;
}

/* ---------- Quiz Start ---------- */
function startQuiz() {
  current   = 0;
  score     = 0;
  skipped   = 0;
  answered  = false;
  activeQuestions = shuffleQuestions(questions).slice(0, ROUND_SIZE);
  startTime = Date.now();
  showScreen('quizScreen');
  loadQuestion();
}

function shuffleQuestions(list) {
  const shuffled = [...list];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/* ---------- Load Question ---------- */
function loadQuestion() {
  answered = false;
  timeLeft = TIMER_MAX;

  const q = activeQuestions[current];

  // Header
  qNum.textContent  = current + 1;
  qCat.textContent  = q.cat;
  qText.textContent = q.q;

  // Progress bar
  progressBar.style.width = ((current + 1) / ROUND_SIZE * 100) + '%';
  progressBar.parentElement.setAttribute('aria-valuenow', Math.round((current + 1) / ROUND_SIZE * 100));

  // Reset UI
  feedbackBar.className = 'feedback-bar';
  feedbackBar.innerHTML = '';
  btnNext.className = 'btn-next';

  // Build option buttons
  optionsGrid.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'opt-btn';
    btn.setAttribute('aria-label', `Option ${letters[i]}: ${opt}`);
    btn.innerHTML = `<span class="opt-letter" aria-hidden="true">${letters[i]}</span><span>${opt}</span>`;
    btn.addEventListener('click', () => selectAnswer(i, btn));
    optionsGrid.appendChild(btn);
  });

  // Start timer
  updateTimerDisplay();
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      autoSkip();
    }
  }, 1000);
}

/* ---------- Timer Display ---------- */
function updateTimerDisplay() {
  timerBox.textContent = timeLeft;
  if (timeLeft <= 5) {
    timerBox.classList.add('urgent');
  } else {
    timerBox.classList.remove('urgent');
  }
}

/* ---------- Answer Selection ---------- */
function selectAnswer(idx, clickedBtn) {
  if (answered) return;
  answered = true;
  clearInterval(timerInterval);

  const q = activeQuestions[current];
  const allBtns = optionsGrid.querySelectorAll('.opt-btn');

  // Disable all options
  allBtns.forEach(b => (b.disabled = true));

  if (idx === q.ans) {
    // Correct
    score++;
    clickedBtn.classList.add('correct');
    showFeedback('correct', '✓ Correct!');
  } else {
    // Wrong — highlight picked as wrong, reveal correct
    clickedBtn.classList.add('wrong');
    allBtns[q.ans].classList.add('reveal');
    showFeedback('wrong', `✗ Wrong. The correct answer was <strong>${q.opts[q.ans]}</strong>`);
  }

  btnNext.className = 'btn-next show';
}

/* ---------- Auto-Skip on Timeout ---------- */
function autoSkip() {
  if (answered) return;
  answered = true;
  skipped++;

  const q = activeQuestions[current];
  const allBtns = optionsGrid.querySelectorAll('.opt-btn');
  allBtns.forEach(b => (b.disabled = true));
  allBtns[q.ans].classList.add('reveal');

  showFeedback('wrong', `⏱ Time's up! The answer was <strong>${q.opts[q.ans]}</strong>`);
  btnNext.className = 'btn-next show';
}

/* ---------- Feedback Bar ---------- */
function showFeedback(type, html) {
  feedbackBar.innerHTML = html;
  if (type === 'correct') {
    feedbackBar.className = 'feedback-bar correct-fb show';
  } else {
    feedbackBar.className = 'feedback-bar wrong-fb show';
  }
}

/* ---------- Next Question ---------- */
function nextQuestion() {
  current++;
  if (current < ROUND_SIZE) {
    loadQuestion();
  } else {
    clearInterval(timerInterval);
    totalTime = Math.round((Date.now() - startTime) / 1000);
    showResults();
  }
}

/* ---------- Show Results ---------- */
function showResults() {
  showScreen('resultScreen');

  const pct    = Math.round(score / ROUND_SIZE * 100);
  const wrong  = ROUND_SIZE - score;

  // Text stats
  scorePercent.textContent = pct + '%';
  resCorrect.textContent   = score;
  resWrong.textContent     = wrong;
  resTime.textContent      = totalTime + 's';
  resSkipped.textContent   = skipped;

  // Title & message
  const tiers = [
    { title: 'Keep Practicing!',  sub: 'Every expert was once a beginner.' },
    { title: 'Good Effort!',      sub: "You're getting there — keep going!" },
    { title: 'Nice Work!',        sub: 'Solid performance. Well done.' },
    { title: 'Great Job!',        sub: 'You really know your stuff!' },
    { title: 'Outstanding!',      sub: 'Perfect score — absolute legend! 🏆' }
  ];
  const tierIdx = pct === 100 ? 4 : pct >= 80 ? 3 : pct >= 60 ? 2 : pct >= 40 ? 1 : 0;
  resultTitle.textContent = tiers[tierIdx].title;
  resultSub.textContent   = tiers[tierIdx].sub;

  // Animate SVG ring (reset transition first for replay)
  scoreDash.style.transition  = 'none';
  scoreDash.style.strokeDashoffset = CIRC;
  // Use double rAF to ensure reset paints before animating
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      scoreDash.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
      scoreDash.style.strokeDashoffset = CIRC - (pct / 100) * CIRC;
    });
  });
}

/* ---------- Restart ---------- */
function restartQuiz() {
  startQuiz();
}
