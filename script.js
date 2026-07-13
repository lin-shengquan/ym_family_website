let mobileMenuOpen = false;

function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobileMenu');
  mobileMenuOpen = !mobileMenuOpen;
  mobileMenu.style.display = mobileMenuOpen ? 'block' : 'none';
}

function flipCard(card) {
  card.classList.toggle('flipped');
}

function toggleStory(card) {
  card.classList.toggle('expanded');
}

function toggleReaction(btn) {
  btn.classList.toggle('active');
}

function addEmoji(emoji) {
  const contentInput = document.getElementById('content');
  contentInput.value += emoji;
  contentInput.focus();
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

function generateAvatar(name) {
  const colors = [
    'linear-gradient(135deg, #87CEEB, #5DADE2)',
    'linear-gradient(135deg, #FFB6C1, #FF69B4)',
    'linear-gradient(135deg, #98FB98, #32CD32)',
    'linear-gradient(135deg, #FFD700, #FFA500)',
    'linear-gradient(135deg, #DDA0DD, #9932CC)',
    'linear-gradient(135deg, #F0E68C, #BDB76B)',
    'linear-gradient(135deg, #87CEFA, #4169E1)',
    'linear-gradient(135deg, #FA8072, #DC143C)'
  ];
  const seed = name.charCodeAt(0) % colors.length;
  return colors[seed];
}

function getAvatarEmoji(name) {
  const emojis = ['😊', '😄', '🥰', '😎', '🤗', '😇', '🙂', '😋'];
  const seed = name.charCodeAt(0) % emojis.length;
  return emojis[seed];
}

function toggleLike(messageId) {
  const messages = getMessages();
  const message = messages.find(m => m.id === messageId);
  if (message) {
    message.liked = !message.liked;
    message.likes = message.liked ? (message.likes || 0) + 1 : Math.max(0, (message.likes || 0) - 1);
    saveMessages(messages);
    renderMessages(messages);
  }
}

function submitMessage(event) {
  event.preventDefault();
  
  const nameInput = document.getElementById('name');
  const contentInput = document.getElementById('content');
  
  const name = nameInput.value.trim();
  const content = contentInput.value.trim();
  
  if (!name || !content) {
    return;
  }
  
  const message = {
    id: Date.now().toString(),
    name: name,
    content: content,
    timestamp: new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }),
    liked: false,
    likes: 0
  };
  
  const messages = getMessages();
  messages.unshift(message);
  saveMessages(messages);
  
  renderMessages(messages);
  
  nameInput.value = '';
  contentInput.value = '';
}

function getMessages() {
  const stored = localStorage.getItem('family_messages');
  return stored ? JSON.parse(stored) : [];
}

function saveMessages(messages) {
  localStorage.setItem('family_messages', JSON.stringify(messages));
}

function renderMessages(messages) {
  const container = document.getElementById('messages-container');
  
  if (messages.length === 0) {
    container.innerHTML = '<div class="no-messages">还没有留言，快来抢沙发吧！🏆</div>';
    return;
  }
  
  container.innerHTML = messages.map(msg => `
    <div class="message-item">
      <div class="message-avatar" style="background: ${generateAvatar(msg.name)}">
        ${getAvatarEmoji(msg.name)}
      </div>
      <div class="message-content-wrapper">
        <div class="message-name">👤 ${msg.name}</div>
        <div class="message-content">${msg.content}</div>
        <div class="message-time">⏰ ${msg.timestamp}</div>
        <div class="message-actions">
          <button class="like-btn ${msg.liked ? 'liked' : ''}" onclick="toggleLike('${msg.id}')">
            ❤️ ${msg.likes || 0}
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function updateNavHighlight() {
  const sections = ['home', 'members', 'fun-stories', 'games', 'message-board'];
  const navLinks = document.querySelectorAll('.nav-link');
  let currentSection = '';
  
  for (const section of sections) {
    const element = document.getElementById(section);
    if (element) {
      const rect = element.getBoundingClientRect();
      if (rect.top <= 150 && rect.bottom >= 150) {
        currentSection = section;
        break;
      }
    }
  }
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

function updateBackToTopButton() {
  const backToTop = document.getElementById('backToTop');
  if (window.scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

function updateNavbarStyle() {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

function initCursorFollower() {
  const cursor = document.getElementById('cursorFollower');
  if (!cursor) return;
  
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX - 10}px`;
    cursor.style.top = `${e.clientY - 10}px`;
  });
  
  const hoverableElements = document.querySelectorAll('button, a, .member-card, .story-card, .emoji-btn, .like-btn');
  hoverableElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });
}

function hideLoader() {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 1500);
  }
}

let currentGame = '';
let gameScore = 0;
let gameTimer = null;
let gameTime = 0;

const familyMembers = [
  { name: '爸爸', emoji: '👨', hobby: '工作狂' },
  { name: '妈妈', emoji: '👩', hobby: '爱打扮' },
  { name: '姐姐', emoji: '👧', hobby: '爱吃零食' },
  { name: '我', emoji: '👦', hobby: '打游戏' }
];

const quizQuestions = [
  { question: '谁是家里的工作狂？', options: ['爸爸', '妈妈', '姐姐', '我'], answer: 0 },
  { question: '谁最喜欢吃零食？', options: ['爸爸', '妈妈', '姐姐', '我'], answer: 2 },
  { question: '谁最爱打扮自己？', options: ['爸爸', '妈妈', '姐姐', '我'], answer: 1 },
  { question: '谁是游戏高手？', options: ['爸爸', '妈妈', '姐姐', '我'], answer: 3 },
  { question: '谁总是最后一个起床？', options: ['爸爸', '妈妈', '姐姐', '我'], answer: 3 },
  { question: '谁负责家里的家务？', options: ['爸爸', '妈妈', '姐姐', '我'], answer: 1 },
  { question: '谁最喜欢看动画片？', options: ['爸爸', '妈妈', '姐姐', '我'], answer: 2 },
  { question: '谁总是忘记带钥匙？', options: ['爸爸', '妈妈', '姐姐', '我'], answer: 0 }
];

function startGame(gameType) {
  currentGame = gameType;
  const modal = document.getElementById('gameModal');
  const title = document.getElementById('gameTitle');
  const area = document.getElementById('gameArea');
  const startBtn = document.getElementById('gameStartBtn');
  
  modal.classList.add('active');
  gameScore = 0;
  startBtn.onclick = startCurrentGame;
  
  if (gameType === 'snack-battle') {
    title.textContent = '🍪 零食大作战';
    area.innerHTML = renderSnackGame();
    startBtn.textContent = '开始对战';
  } else if (gameType === 'memory') {
    title.textContent = '🧠 记忆力挑战';
    area.innerHTML = renderMemoryGame();
    startBtn.textContent = '开始游戏';
  } else if (gameType === 'quiz') {
    title.textContent = '❓ 家庭问答';
    area.innerHTML = renderQuizGame(0);
    startBtn.textContent = '开始游戏';
  } else if (gameType === 'maze-escape') {
    title.textContent = '🏃 逃离姐姐';
    area.innerHTML = renderMazeGame();
    startBtn.textContent = '开始游戏';
  }
}

function closeGame() {
  const modal = document.getElementById('gameModal');
  modal.classList.remove('active');
  clearInterval(gameTimer);
  clearInterval(mazeEnemyTimer);
  clearTimeout(mazeShieldTimeout);
  clearTimeout(mazeDistractTimeout);
  clearTimeout(mazeFreezeTimeout);
  clearInterval(stealTimer);
  clearInterval(stealMomTimer);
  aiTimeouts.forEach(timeout => clearTimeout(timeout));
  aiTimeouts = [];
  document.removeEventListener('keydown', handleMazeKeydown);
  document.removeEventListener('keydown', handleStealKeydown);
}

function startCurrentGame() {
  if (currentGame === 'snack-battle') {
    startSnackGame();
  } else if (currentGame === 'memory') {
    startMemoryGame();
  } else if (currentGame === 'quiz') {
    startQuizGame();
  } else if (currentGame === 'maze-escape') {
    startMazeGame();
  } else if (currentGame === 'steal-snacks') {
    startStealSnacksGame();
  }
}

const snacks = ['🍪', '🍫', '🍿', '🍰', '🧁', '🍬', '🍭', '🍩', '🍪', '🍫', '🍿', '🍰'];

let playerScore = 0;
let aiScore = 0;
let snackCount = 0;
let aiTimeouts = [];
let currentDifficulty = 'medium';

const difficultySettings = {
  easy: {
    aiDelayMin: 1000,
    aiDelayMax: 2000,
    snackSpawnRate: 0.4,
    snackLifetime: 2500,
    enemySpeed: 1500
  },
  medium: {
    aiDelayMin: 500,
    aiDelayMax: 1500,
    snackSpawnRate: 0.3,
    snackLifetime: 2000,
    enemySpeed: 800
  },
  hard: {
    aiDelayMin: 200,
    aiDelayMax: 800,
    snackSpawnRate: 0.2,
    snackLifetime: 1500,
    enemySpeed: 400
  }
};

let mazeDifficulty = 'medium';

function renderSnackGame() {
  return `
    <div class="game-players">
      <div class="player-info player-1">
        <h4>👦 我</h4>
        <div class="player-score" id="playerScore">0</div>
      </div>
      <div class="player-info player-2">
        <h4>👧 姐姐 (AI)</h4>
        <div class="player-score" id="aiScore">0</div>
      </div>
    </div>
    <div class="difficulty-selector">
      <span>选择难度：</span>
      <button class="difficulty-btn ${currentDifficulty === 'easy' ? 'active' : ''}" onclick="setDifficulty('easy')">😊 简单</button>
      <button class="difficulty-btn ${currentDifficulty === 'medium' ? 'active' : ''}" onclick="setDifficulty('medium')">😐 普通</button>
      <button class="difficulty-btn ${currentDifficulty === 'hard' ? 'active' : ''}" onclick="setDifficulty('hard')">😈 困难</button>
    </div>
    <div class="game-timer">时间: <span id="snackTimer">30</span>秒</div>
    <div class="snack-game" id="snackGameArea"></div>
  `;
}

function setDifficulty(difficulty) {
  currentDifficulty = difficulty;
  document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent.includes(difficulty === 'easy' ? '简单' : difficulty === 'medium' ? '普通' : '困难')) {
      btn.classList.add('active');
    }
  });
}

function startSnackGame() {
  playerScore = 0;
  aiScore = 0;
  snackCount = 0;
  gameTime = 30;
  const settings = difficultySettings[currentDifficulty];
  
  document.getElementById('playerScore').textContent = '0';
  document.getElementById('aiScore').textContent = '0';
  document.getElementById('snackTimer').textContent = '30';
  
  const gameArea = document.getElementById('snackGameArea');
  gameArea.innerHTML = '';
  
  const startBtn = document.getElementById('gameStartBtn');
  startBtn.textContent = '重新开始';
  startBtn.onclick = function() { startGame('snack-battle'); };
  
  gameTimer = setInterval(() => {
    gameTime--;
    document.getElementById('snackTimer').textContent = gameTime;
    
    if (gameTime <= 0) {
      endSnackGame();
      return;
    }
    
    if (snackCount < 30 && Math.random() > settings.snackSpawnRate) {
      spawnSnack();
    }
  }, 500);
}

function spawnSnack() {
  const gameArea = document.getElementById('snackGameArea');
  const snack = snacks[Math.floor(Math.random() * snacks.length)];
  const snackElement = document.createElement('div');
  snackElement.className = 'snack-item';
  snackElement.textContent = snack;
  snackElement.id = `snack-${Date.now()}`;
  
  const maxX = gameArea.offsetWidth - 60;
  const maxY = gameArea.offsetHeight - 60;
  snackElement.style.left = `${Math.random() * maxX}px`;
  snackElement.style.top = `${Math.random() * maxY}px`;
  
  snackElement.addEventListener('click', () => catchSnack(snackElement, 'player'));
  gameArea.appendChild(snackElement);
  snackCount++;
  
  const settings = difficultySettings[currentDifficulty];
  
  setTimeout(() => {
    if (snackElement.parentNode) {
      snackElement.remove();
    }
  }, settings.snackLifetime);
  
  const aiDelay = settings.aiDelayMin + Math.random() * (settings.aiDelayMax - settings.aiDelayMin);
  const aiTimeout = setTimeout(() => {
    if (snackElement.parentNode && !snackElement.classList.contains('caught')) {
      catchSnack(snackElement, 'ai');
    }
  }, aiDelay);
  aiTimeouts.push(aiTimeout);
}

function catchSnack(snackElement, catcher) {
  if (snackElement.classList.contains('caught')) return;
  
  snackElement.classList.add('caught');
  
  if (catcher === 'player') {
    playerScore++;
    document.getElementById('playerScore').textContent = playerScore;
  } else {
    aiScore++;
    document.getElementById('aiScore').textContent = aiScore;
  }
  
  setTimeout(() => {
    if (snackElement.parentNode) {
      snackElement.remove();
    }
  }, 300);
}

function endSnackGame() {
  clearInterval(gameTimer);
  const area = document.getElementById('gameArea');
  const startBtn = document.getElementById('gameStartBtn');
  startBtn.textContent = '再玩一次';
  startBtn.onclick = function() { startGame('snack-battle'); };
  
  let message = '';
  
  if (playerScore > aiScore) {
    message = '🎉 太棒了！你赢了姐姐！零食都是你的！';
  } else if (playerScore < aiScore) {
    message = '😢 哎呀！姐姐抢走了更多零食！下次加油！';
  } else {
    message = '🤝 平局！你们平分零食！';
  }
  
  area.innerHTML = `
    <div class="game-over">
      <h4>🍪 游戏结束！</h4>
      <p>我的得分：<strong>${playerScore}</strong> | 姐姐得分：<strong>${aiScore}</strong></p>
      <p>${message}</p>
    </div>
  `;
}

function renderMemoryGame() {
  const cards = [];
  familyMembers.forEach(member => {
    cards.push({ ...member, id: `${member.name}-1` });
    cards.push({ ...member, id: `${member.name}-2` });
  });
  
  cards.sort(() => Math.random() - 0.5);
  
  return `
    <div class="game-score">配对: <span id="memoryScore">0</span>/4</div>
    <div class="memory-game">
      ${cards.map(card => `
        <div class="memory-card" onclick="flipMemoryCard('${card.id}')" id="memory-${card.id}">
          <div class="memory-card-front">❓</div>
          <div class="memory-card-back">${card.emoji}</div>
        </div>
      `).join('')}
    </div>
    <input type="hidden" id="memoryCards" value='${JSON.stringify(cards)}'>
  `;
}

let flippedCards = [];
let matchedPairs = 0;

function startMemoryGame() {
  gameScore = 0;
  matchedPairs = 0;
  flippedCards = [];
  document.getElementById('memoryScore').textContent = '0';
  
  document.querySelectorAll('.memory-card').forEach(card => {
    card.classList.remove('flipped', 'matched');
    card.style.pointerEvents = 'auto';
  });
}

function flipMemoryCard(cardId) {
  const card = document.getElementById(`memory-${cardId}`);
  
  if (card.classList.contains('flipped') || card.classList.contains('matched')) {
    return;
  }
  
  if (flippedCards.length >= 2) {
    return;
  }
  
  card.classList.add('flipped');
  flippedCards.push(cardId);
  
  if (flippedCards.length === 2) {
    checkMemoryMatch();
  }
}

function checkMemoryMatch() {
  const card1 = document.getElementById(`memory-${flippedCards[0]}`);
  const card2 = document.getElementById(`memory-${flippedCards[1]}`);
  
  const name1 = flippedCards[0].split('-')[0];
  const name2 = flippedCards[1].split('-')[0];
  
  if (name1 === name2) {
    setTimeout(() => {
      card1.classList.add('matched');
      card2.classList.add('matched');
      matchedPairs++;
      document.getElementById('memoryScore').textContent = matchedPairs;
      
      if (matchedPairs === 4) {
        setTimeout(() => {
          endMemoryGame();
        }, 500);
      }
    }, 500);
  } else {
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
    }, 1000);
  }
  
  flippedCards = [];
}

function endMemoryGame() {
  const area = document.getElementById('gameArea');
  area.innerHTML = `
    <div class="game-over">
      <h4>🧠 恭喜过关！</h4>
      <p>你的记忆力真棒！</p>
      <button class="game-btn" onclick="startGame('memory')">再玩一次</button>
    </div>
  `;
}

let currentQuestionIndex = 0;

function renderQuizGame(index) {
  const question = quizQuestions[index];
  return `
    <div class="game-score">得分: <span id="quizScore">${gameScore}</span></div>
    <div class="game-timer">第 <span id="quizQuestion">${index + 1}</span>/8 题</div>
    <div class="quiz-game">
      <div class="quiz-question">${question.question}</div>
      <div class="quiz-options">
        ${question.options.map((option, i) => `
          <div class="quiz-option" onclick="selectQuizOption(${i})" id="quiz-option-${i}">
            ${option}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function startQuizGame() {
  gameScore = 0;
  currentQuestionIndex = 0;
  document.getElementById('quizScore').textContent = '0';
  renderQuizGame(0);
}

function selectQuizOption(optionIndex) {
  const question = quizQuestions[currentQuestionIndex];
  const optionElement = document.getElementById(`quiz-option-${optionIndex}`);
  
  document.querySelectorAll('.quiz-option').forEach(opt => {
    opt.style.pointerEvents = 'none';
  });
  
  if (optionIndex === question.answer) {
    optionElement.classList.add('correct');
    gameScore += 12.5;
    document.getElementById('quizScore').textContent = gameScore;
  } else {
    optionElement.classList.add('wrong');
    document.getElementById(`quiz-option-${question.answer}`).classList.add('correct');
  }
  
  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex >= quizQuestions.length) {
      endQuizGame();
    } else {
      document.getElementById('gameArea').innerHTML = renderQuizGame(currentQuestionIndex);
    }
  }, 1500);
}

let mazeMap = [];
let mazePlayerPos = {x: 1, y: 1};
let mazeEnemyPos = {x: 7, y: 7};
let mazeSteps = 0;
let mazeTimer = null;
let mazeEnemyTimer = null;
let mazePowerups = [];
let mazeShieldActive = false;
let mazeDistractActive = false;
let mazeShieldTimeout = null;
let mazeDistractTimeout = null;
let mazeFreezeTimeout = null;

function generateMaze(width, height) {
  const map = [];
  for (let y = 0; y < height; y++) {
    map[y] = [];
    for (let x = 0; x < width; x++) {
      map[y][x] = 1;
    }
  }
  
  const stack = [];
  const startX = 1;
  const startY = 1;
  map[startY][startX] = 0;
  stack.push({x: startX, y: startY});
  
  const directions = [
    {dx: 0, dy: -2},
    {dx: 0, dy: 2},
    {dx: -2, dy: 0},
    {dx: 2, dy: 0}
  ];
  
  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = [];
    
    for (const dir of directions) {
      const nx = current.x + dir.dx;
      const ny = current.y + dir.dy;
      
      if (nx > 0 && nx < width - 1 && ny > 0 && ny < height - 1 && map[ny][nx] === 1) {
        neighbors.push({x: nx, y: ny, dx: dir.dx / 2, dy: dir.dy / 2});
      }
    }
    
    if (neighbors.length > 0) {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      map[current.y + next.dy][current.x + next.dx] = 0;
      map[next.y][next.x] = 0;
      stack.push({x: next.x, y: next.y});
    } else {
      stack.pop();
    }
  }
  
  map[height - 2][width - 2] = 2;
  
  return map;
}

function renderMazeGame() {
  mazeMap = generateMaze(13, 9);
  
  mazeEnemyPos = findFarthestPosition();
  
  mazePowerups = generatePowerups();
  mazeShieldActive = false;
  mazeDistractActive = false;
  
  let html = `
    <div class="maze-info">
      <span>步数: <strong id="mazeSteps">0</strong></span>
      <span>状态: <strong id="mazeStatus">准备开始</strong></span>
      <span>道具: <strong id="mazePowerupStatus">无</strong></span>
    </div>
    <div class="maze-difficulty">
      <button class="difficulty-btn ${mazeDifficulty === 'easy' ? 'active' : ''}" onclick="setMazeDifficulty('easy')">😊 简单</button>
      <button class="difficulty-btn ${mazeDifficulty === 'medium' ? 'active' : ''}" onclick="setMazeDifficulty('medium')">😐 普通</button>
      <button class="difficulty-btn ${mazeDifficulty === 'hard' ? 'active' : ''}" onclick="setMazeDifficulty('hard')">😈 困难</button>
    </div>
    <div class="maze-game" id="mazeGame">
      <div class="maze-container">
  `;
  
  for (let y = 0; y < mazeMap.length; y++) {
    for (let x = 0; x < mazeMap[y].length; x++) {
      let className = 'maze-cell';
      if (mazeMap[y][x] === 1) className += ' wall';
      else if (mazeMap[y][x] === 2) className += ' end';
      html += `<div class="${className}" data-x="${x}" data-y="${y}"></div>`;
    }
  }
  
  html += `
      </div>
      <div class="maze-player" id="mazePlayer" style="left: ${1 * 7.69}%; top: ${1 * 11.11}%;">👦</div>
      <div class="maze-enemy" id="mazeEnemy" style="left: ${mazeEnemyPos.x * 7.69}%; top: ${mazeEnemyPos.y * 11.11}%;">👧</div>
  `;
  
  for (const powerup of mazePowerups) {
    html += `
      <div class="maze-chest" id="chest-${powerup.x}-${powerup.y}" style="left: ${powerup.x * 7.69}%; top: ${powerup.y * 11.11}%;">📦</div>
    `;
  }
  
  html += `
    </div>
    <div class="maze-controls">
      <div></div>
      <button class="maze-btn" onclick="moveMazePlayer(0, -1)">↑</button>
      <div></div>
      <button class="maze-btn" onclick="moveMazePlayer(-1, 0)">←</button>
      <button class="maze-btn" onclick="moveMazePlayer(0, 1)">↓</button>
      <button class="maze-btn" onclick="moveMazePlayer(1, 0)">→</button>
    </div>
    <div class="maze-powerup-hints">
      <span>� 箱子 - 接近即可打开</span>
      <span>��️ 护盾 - 3秒无敌</span>
      <span>🎈 气球 - 姐姐被吸引</span>
      <span>⏰ 时钟 - 时间暂停3秒</span>
    </div>
  `;
  
  return html;
}

function generatePowerups() {
  const powerups = [];
  const types = ['shield', 'distract', 'freeze'];
  const openCells = [];
  
  for (let y = 0; y < mazeMap.length; y++) {
    for (let x = 0; x < mazeMap[y].length; x++) {
      if (mazeMap[y][x] === 0 && !(x === 1 && y === 1) && !(x === mazeEnemyPos.x && y === mazeEnemyPos.y)) {
        openCells.push({x, y});
      }
    }
  }
  
  const numPowerups = Math.min(3, Math.floor(openCells.length / 5));
  for (let i = 0; i < numPowerups; i++) {
    if (openCells.length === 0) break;
    const idx = Math.floor(Math.random() * openCells.length);
    const cell = openCells.splice(idx, 1)[0];
    powerups.push({
      x: cell.x,
      y: cell.y,
      type: types[i % types.length]
    });
  }
  
  return powerups;
}

function findFarthestPosition() {
  const playerX = 1;
  const playerY = 1;
  let farthestPos = {x: 1, y: 1};
  let maxDist = 0;
  
  for (let y = 0; y < mazeMap.length; y++) {
    for (let x = 0; x < mazeMap[y].length; x++) {
      if (mazeMap[y][x] === 0 && !(x === playerX && y === playerY)) {
        const dist = Math.abs(x - playerX) + Math.abs(y - playerY);
        if (dist > maxDist) {
          maxDist = dist;
          farthestPos = {x, y};
        }
      }
    }
  }
  
  return farthestPos;
}

function setMazeDifficulty(diff) {
  mazeDifficulty = diff;
  clearInterval(mazeEnemyTimer);
  clearTimeout(mazeShieldTimeout);
  clearTimeout(mazeDistractTimeout);
  clearTimeout(mazeFreezeTimeout);
  document.removeEventListener('keydown', handleMazeKeydown);
  document.getElementById('gameArea').innerHTML = renderMazeGame();
}

function startMazeGame() {
  mazePlayerPos = {x: 1, y: 1};
  mazeSteps = 0;
  
  updateMazePositions();
  document.getElementById('mazeSteps').textContent = '0';
  document.getElementById('mazeStatus').textContent = '游戏中...';
  
  mazeEnemyTimer = setInterval(moveMazeEnemy, difficultySettings[mazeDifficulty].enemySpeed);
  
  document.addEventListener('keydown', handleMazeKeydown);
}

function handleMazeKeydown(e) {
  switch(e.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      e.preventDefault();
      moveMazePlayer(0, -1);
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      e.preventDefault();
      moveMazePlayer(0, 1);
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      e.preventDefault();
      moveMazePlayer(-1, 0);
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      e.preventDefault();
      moveMazePlayer(1, 0);
      break;
  }
}

function moveMazePlayer(dx, dy) {
  const newX = mazePlayerPos.x + dx;
  const newY = mazePlayerPos.y + dy;
  
  if (newX >= 0 && newX < mazeMap[0].length && newY >= 0 && newY < mazeMap.length) {
    if (mazeMap[newY][newX] !== 1) {
      mazePlayerPos = {x: newX, y: newY};
      mazeSteps++;
      updateMazePositions();
      document.getElementById('mazeSteps').textContent = mazeSteps;
      
      collectPowerup(newX, newY);
      
      checkMazeCollision();
      
      if (mazeMap[newY][newX] === 2) {
        endMazeGame(true);
      }
    }
  }
}

function collectPowerup(x, y) {
  for (let i = mazePowerups.length - 1; i >= 0; i--) {
    const powerup = mazePowerups[i];
    const dist = Math.abs(powerup.x - x) + Math.abs(powerup.y - y);
    
    if (dist <= 1) {
      const chestElement = document.getElementById(`chest-${powerup.x}-${powerup.y}`);
      if (chestElement) {
        chestElement.textContent = powerup.type === 'shield' ? '🛡️' : powerup.type === 'distract' ? '🎈' : '⏰';
        chestElement.classList.add('chest-open');
        
        setTimeout(() => {
          chestElement.style.display = 'none';
        }, 500);
      }
      
      mazePowerups.splice(i, 1);
      
      if (powerup.type === 'shield') {
        activateShield();
      } else if (powerup.type === 'distract') {
        activateDistract();
      } else if (powerup.type === 'freeze') {
        activateFreeze();
      }
      
      break;
    }
  }
}

function activateShield() {
  mazeShieldActive = true;
  const statusEl = document.getElementById('mazePowerupStatus');
  if (statusEl) statusEl.textContent = '🛡️ 护盾';
  const player = document.getElementById('mazePlayer');
  if (player) {
    player.classList.add('shielded');
  }
  
  mazeShieldTimeout = setTimeout(() => {
    mazeShieldActive = false;
    const statusEl = document.getElementById('mazePowerupStatus');
    if (statusEl) statusEl.textContent = '无';
    if (player) {
      player.classList.remove('shielded');
    }
  }, 3000);
}

function activateDistract() {
  mazeDistractActive = true;
  const statusEl = document.getElementById('mazePowerupStatus');
  if (statusEl) statusEl.textContent = '🎈 气球';
  
  mazeDistractTimeout = setTimeout(() => {
    mazeDistractActive = false;
    const statusEl = document.getElementById('mazePowerupStatus');
    if (statusEl) statusEl.textContent = '无';
  }, 3000);
}

function activateFreeze() {
  const statusEl = document.getElementById('mazePowerupStatus');
  if (statusEl) statusEl.textContent = '⏰ 暂停';
  
  clearInterval(mazeEnemyTimer);
  
  mazeFreezeTimeout = setTimeout(() => {
    const statusEl = document.getElementById('mazePowerupStatus');
    if (statusEl) statusEl.textContent = '无';
    mazeEnemyTimer = setInterval(moveMazeEnemy, difficultySettings[mazeDifficulty].enemySpeed);
  }, 3000);
}

function moveMazeEnemy() {
  const directions = [
    {dx: 0, dy: -1},
    {dx: 0, dy: 1},
    {dx: -1, dy: 0},
    {dx: 1, dy: 0}
  ];
  
  let bestDir = directions[0];
  
  if (mazeDistractActive) {
    const validDirs = directions.filter(dir => {
      const newX = mazeEnemyPos.x + dir.dx;
      const newY = mazeEnemyPos.y + dir.dy;
      return newX >= 0 && newX < mazeMap[0].length && newY >= 0 && newY < mazeMap.length && mazeMap[newY][newX] !== 1;
    });
    if (validDirs.length > 0) {
      bestDir = validDirs[Math.floor(Math.random() * validDirs.length)];
    }
  } else {
    let minDist = Infinity;
    for (const dir of directions) {
      const newX = mazeEnemyPos.x + dir.dx;
      const newY = mazeEnemyPos.y + dir.dy;
      
      if (newX >= 0 && newX < mazeMap[0].length && newY >= 0 && newY < mazeMap.length && mazeMap[newY][newX] !== 1) {
        const dist = Math.abs(newX - mazePlayerPos.x) + Math.abs(newY - mazePlayerPos.y);
        if (dist < minDist) {
          minDist = dist;
          bestDir = dir;
        }
      }
    }
  }
  
  mazeEnemyPos.x += bestDir.dx;
  mazeEnemyPos.y += bestDir.dy;
  updateMazePositions();
  
  checkMazeCollision();
}

function updateMazePositions() {
  const player = document.getElementById('mazePlayer');
  const enemy = document.getElementById('mazeEnemy');
  
  if (player) {
    player.style.left = `${mazePlayerPos.x * 7.69}%`;
    player.style.top = `${mazePlayerPos.y * 11.11}%`;
  }
  
  if (enemy) {
    enemy.style.left = `${mazeEnemyPos.x * 7.69}%`;
    enemy.style.top = `${mazeEnemyPos.y * 11.11}%`;
  }
}

function checkMazeCollision() {
  if (mazePlayerPos.x === mazeEnemyPos.x && mazePlayerPos.y === mazeEnemyPos.y) {
    if (!mazeShieldActive) {
      endMazeGame(false);
    }
  }
}

function endMazeGame(win) {
  clearInterval(mazeEnemyTimer);
  document.removeEventListener('keydown', handleMazeKeydown);
  
  const area = document.getElementById('gameArea');
  const startBtn = document.getElementById('gameStartBtn');
  startBtn.textContent = '再玩一次';
  startBtn.onclick = function() { startGame('maze-escape'); };
  
  let message = '';
  
  if (win) {
    message = `🎉 成功逃离姐姐的追捕！用了 ${mazeSteps} 步！`;
  } else {
    message = '😢 被姐姐抓到了！下次要跑得更快哦！';
  }
  
  area.innerHTML = `
    <div class="game-over">
      <h4>🏃 游戏结束！</h4>
      <p>${message}</p>
    </div>
  `;
}

function endQuizGame() {
  const area = document.getElementById('gameArea');
  let message = '';
  if (gameScore === 100) {
    message = '🏆 完美！你是家庭专家！';
  } else if (gameScore >= 75) {
    message = '🌟 很棒！你很了解家人！';
  } else if (gameScore >= 50) {
    message = '👍 不错！继续了解家人吧！';
  } else {
    message = '💪 加油！多和家人交流哦！';
  }
  
  area.innerHTML = `
    <div class="game-over">
      <h4>❓ 问答结束！</h4>
      <p>你的得分：<strong>${gameScore}</strong>分</p>
      <p>${message}</p>
      <button class="game-btn" onclick="startGame('quiz')">再玩一次</button>
    </div>
  `;
}

let stealGameArea = null;
let stealPlayerPos = {x: 3, y: 5};
let stealMomPos = {x: 3, y: 0};
let stealSnacks = [];
let stealScore = 0;
let stealTime = 30;
let stealTimer = null;
let stealMomTimer = null;
let stealDifficulty = 'medium';

const stealSnackTypes = ['🍪', '🍫', '🍿', '🍰', '🧁', '🍬'];

const stealDifficultySettings = {
  easy: { momSpeed: 1200, catchRange: 1 },
  medium: { momSpeed: 800, catchRange: 1 },
  hard: { momSpeed: 500, catchRange: 2 }
};

function renderStealSnacksGame() {
  stealSnacks = [];
  stealPlayerPos = {x: 3, y: 5};
  stealMomPos = {x: 3, y: 0};
  stealScore = 0;
  stealTime = 30;
  
  const tablePositions = [
    {x: 1, y: 2}, {x: 2, y: 2}, {x: 3, y: 2},
    {x: 4, y: 2}, {x: 5, y: 2}, {x: 6, y: 2}
  ];
  
  for (let i = 0; i < 4; i++) {
    const idx = Math.floor(Math.random() * tablePositions.length);
    const pos = tablePositions.splice(idx, 1)[0];
    stealSnacks.push({
      x: pos.x,
      y: pos.y,
      type: stealSnackTypes[Math.floor(Math.random() * stealSnackTypes.length)],
      eaten: false
    });
  }
  
  let html = `
    <div class="steal-info">
      <span>得分: <strong id="stealScore">0</strong></span>
      <span>时间: <strong id="stealTime">30</strong>秒</span>
    </div>
    <div class="steal-difficulty">
      <button class="difficulty-btn ${stealDifficulty === 'easy' ? 'active' : ''}" onclick="setStealDifficulty('easy')">😊 简单</button>
      <button class="difficulty-btn ${stealDifficulty === 'medium' ? 'active' : ''}" onclick="setStealDifficulty('medium')">😐 普通</button>
      <button class="difficulty-btn ${stealDifficulty === 'hard' ? 'active' : ''}" onclick="setStealDifficulty('hard')">😈 困难</button>
    </div>
    <div class="steal-game" id="stealGame">
      <div class="steal-kitchen">
        <div class="steal-danger-zone"></div>
        <div class="steal-mom" id="stealMom" style="left: ${stealMomPos.x * 12.5}%; top: ${stealMomPos.y * 16.67}%;">👩</div>
        <div class="steal-player" id="stealPlayer" style="left: ${stealPlayerPos.x * 12.5}%; top: ${stealPlayerPos.y * 16.67}%;">👦</div>
  `;
  
  for (const snack of stealSnacks) {
    html += `
      <div class="steal-snack" id="stealSnack-${snack.x}-${snack.y}" style="left: ${snack.x * 12.5}%; top: ${snack.y * 16.67}%;">${snack.type}</div>
    `;
  }
  
  html += `
        <div class="steal-table"></div>
      </div>
    </div>
    <div class="steal-controls">
      <div></div>
      <button class="steal-btn" onclick="moveStealPlayer(0, -1)">↑</button>
      <div></div>
      <button class="steal-btn" onclick="moveStealPlayer(-1, 0)">←</button>
      <button class="steal-btn" onclick="moveStealPlayer(0, 1)">↓</button>
      <button class="steal-btn" onclick="moveStealPlayer(1, 0)">→</button>
    </div>
    <div class="steal-hints">
      <span>🎯 移动到零食位置吃掉它</span>
      <span>⚠️ 别被妈妈发现！</span>
    </div>
  `;
  
  return html;
}

function setStealDifficulty(diff) {
  stealDifficulty = diff;
  clearInterval(stealTimer);
  clearInterval(stealMomTimer);
  document.removeEventListener('keydown', handleStealKeydown);
  document.getElementById('gameArea').innerHTML = renderStealSnacksGame();
}

function startStealSnacksGame() {
  const area = document.getElementById('gameArea');
  area.innerHTML = renderStealSnacksGame();
  
  stealTimer = setInterval(() => {
    stealTime--;
    const timeEl = document.getElementById('stealTime');
    if (timeEl) timeEl.textContent = stealTime;
    
    if (stealTime <= 0) {
      endStealGame(true);
    }
  }, 1000);
  
  stealMomTimer = setInterval(() => {
    moveStealMom();
    checkStealCaught();
  }, stealDifficultySettings[stealDifficulty].momSpeed);
  
  document.addEventListener('keydown', handleStealKeydown);
}

function handleStealKeydown(e) {
  switch(e.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      moveStealPlayer(0, -1);
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      moveStealPlayer(0, 1);
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      moveStealPlayer(-1, 0);
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      moveStealPlayer(1, 0);
      break;
  }
}

function moveStealPlayer(dx, dy) {
  const newX = stealPlayerPos.x + dx;
  const newY = stealPlayerPos.y + dy;
  
  if (newX >= 0 && newX <= 6 && newY >= 0 && newY <= 5) {
    stealPlayerPos = {x: newX, y: newY};
    updateStealPositions();
    eatStealSnack(newX, newY);
    checkStealCaught();
  }
}

function moveStealMom() {
  let dx = 0;
  let dy = 0;
  
  if (Math.random() < 0.4) {
    if (stealPlayerPos.x < stealMomPos.x) {
      dx = -1;
    } else if (stealPlayerPos.x > stealMomPos.x) {
      dx = 1;
    }
  } else {
    dx = Math.random() < 0.5 ? -1 : 1;
  }
  
  if (Math.random() < 0.5) {
    if (stealPlayerPos.y < stealMomPos.y) {
      dy = -1;
    } else if (stealPlayerPos.y > stealMomPos.y) {
      dy = 1;
    }
  } else {
    dy = Math.random() < 0.5 ? -1 : 1;
  }
  
  const newX = stealMomPos.x + dx;
  const newY = stealMomPos.y + dy;
  
  if (newX >= 0 && newX <= 6) {
    stealMomPos.x = newX;
  }
  if (newY >= 0 && newY <= 4) {
    stealMomPos.y = newY;
  }
  
  updateStealPositions();
}

function updateStealPositions() {
  const player = document.getElementById('stealPlayer');
  const mom = document.getElementById('stealMom');
  
  if (player) {
    player.style.left = `${stealPlayerPos.x * 12.5}%`;
    player.style.top = `${stealPlayerPos.y * 16.67}%`;
  }
  
  if (mom) {
    mom.style.left = `${stealMomPos.x * 12.5}%`;
    mom.style.top = `${stealMomPos.y * 16.67}%`;
  }
}

function eatStealSnack(x, y) {
  for (const snack of stealSnacks) {
    if (!snack.eaten && snack.x === x && snack.y === y) {
      snack.eaten = true;
      stealScore++;
      
      const snackEl = document.getElementById(`stealSnack-${x}-${y}`);
      if (snackEl) {
        snackEl.style.display = 'none';
      }
      
      const scoreEl = document.getElementById('stealScore');
      if (scoreEl) scoreEl.textContent = stealScore;
      
      if (stealScore >= 4) {
        endStealGame(true);
      }
      
      break;
    }
  }
}

function checkStealCaught() {
  const catchRange = stealDifficultySettings[stealDifficulty].catchRange;
  const dx = Math.abs(stealPlayerPos.x - stealMomPos.x);
  const dy = Math.abs(stealPlayerPos.y - stealMomPos.y);
  
  if (dx <= catchRange && dy <= catchRange) {
    endStealGame(false);
  }
}

function endStealGame(won) {
  clearInterval(stealTimer);
  clearInterval(stealMomTimer);
  document.removeEventListener('keydown', handleStealKeydown);
  
  const area = document.getElementById('gameArea');
  let message = '';
  if (won) {
    if (stealScore >= 4) {
      message = '🎉 太棒了！你成功偷吃了所有零食！';
    } else {
      message = '⏰ 时间到！你偷吃了 ' + stealScore + ' 个零食！';
    }
  } else {
    message = '😱 被妈妈发现了！快跑啊！';
  }
  
  area.innerHTML = `
    <div class="game-over">
      <h4>🍿 游戏结束！</h4>
      <p>${message}</p>
      <p>最终得分：<strong>${stealScore}</strong>分</p>
      <button class="game-btn" onclick="startGame('steal-snacks')">再玩一次</button>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  hideLoader();
  initCursorFollower();
  
  const messages = getMessages();
  renderMessages(messages);
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  window.addEventListener('scroll', () => {
    updateNavHighlight();
    updateBackToTopButton();
    updateNavbarStyle();
  });
  
  updateNavHighlight();
});