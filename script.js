/**
 * ==============================================================================
 * DEV MEMORY TECH - LÓGICA DE GAMIFICAÇÃO (VANILLA JAVASCRIPT)
 * ==============================================================================
 * Funcionalidades Gamificadas:
 * - Algoritmo Fisher-Yates para embaralhamento uniforme
 * - Contagem Regressiva (Countdown Timer) de 60 segundos com alerta de perigo
 * - Sistema Dinâmico de Pontuação (Acertos, Erros e Bônus por Rapidez)
 * - Trava de segurança (lockBoard) contra race conditions e spam de cliques
 * - Modal Dinâmico com estados de Vitória ("Missão Cumprida") e Derrota ("Game Over")
 */

// --- 1. CONFIGURAÇÕES & CATÁLOGO DE TECNOLOGIAS ---
const GAME_CONFIG = {
  INITIAL_TIME: 60,       // Tempo inicial em segundos
  POINTS_MATCH: 150,      // Pontos por par correto
  POINTS_PENALTY: 20,     // Penalidade por par incorreto
  POINTS_TIME_BONUS: 15   // Multiplicador de bônus por cada segundo restante na vitória
};

const TECH_CARDS = [
  { id: 'javascript', name: 'JavaScript', icon: 'devicon-javascript-plain colored' },
  { id: 'react',      name: 'React',      icon: 'devicon-react-original colored' },
  { id: 'nodejs',     name: 'Node.js',    icon: 'devicon-nodejs-plain colored' },
  { id: 'python',     name: 'Python',     icon: 'devicon-python-plain colored' },
  { id: 'docker',     name: 'Docker',     icon: 'devicon-docker-plain colored' },
  { id: 'git',        name: 'Git',        icon: 'devicon-git-plain colored' },
  { id: 'linux',      name: 'Linux',      icon: 'devicon-linux-plain' },
  { id: 'aws',        name: 'AWS',        icon: 'devicon-amazonwebservices-plain-wordmark colored' }
];

const TOTAL_PAIRS = TECH_CARDS.length;

// --- 2. ESTADO GLOBAL DO JOGO ---
let cards = [];               // Baralho embaralhado
let firstCard = null;         // 1ª carta selecionada no turno
let secondCard = null;        // 2ª carta selecionada no turno
let hasFlippedCard = false;   // Flag indicando se há carta aguardando par
let lockBoard = false;        // Trava do tabuleiro durante animações e fim de jogo

let moves = 0;                // Quantidade de tentativas (2 cartas = 1 movimento)
let matchedPairs = 0;         // Total de pares encontrados
let currentScore = 0;         // Pontuação atual

let timeLeft = GAME_CONFIG.INITIAL_TIME;
let timerInterval = null;     // Referência do setInterval do cronômetro
let isGameStarted = false;    // Ativação no primeiro clique

// --- 3. REFERÊNCIAS DO DOM ---
const gameBoard = document.getElementById('game-board');
const movesDisplay = document.getElementById('moves-display');
const timerDisplay = document.getElementById('timer-display');
const timerCard = document.getElementById('timer-card');
const timerBar = document.getElementById('timer-bar');
const scoreDisplay = document.getElementById('score-display');
const scorePopup = document.getElementById('score-popup');
const btnRestart = document.getElementById('btn-restart');

// Elementos do Modal Dinâmico
const gameModal = document.getElementById('game-modal');
const modalBox = document.getElementById('modal-box');
const modalIcon = document.getElementById('modal-icon');
const modalTitle = document.getElementById('modal-title');
const modalSubtitle = document.getElementById('modal-subtitle');
const modalFinalTime = document.getElementById('modal-final-time');
const modalFinalMoves = document.getElementById('modal-final-moves');
const modalFinalPairs = document.getElementById('modal-final-pairs');
const modalFinalScore = document.getElementById('modal-final-score');
const btnModalAction = document.getElementById('btn-modal-action');
const modalBtnText = document.getElementById('modal-btn-text');

// --- 4. INICIALIZAÇÃO E REINICIALIZAÇÃO ---

/**
 * Inicializa uma nova partida do zero.
 */
function initGame() {
  resetGameState();
  createDeck();
  renderBoard();
}

/**
 * Reseta todas as variáveis de estado, limpa timers e atualiza os displays do HUD.
 */
function resetGameState() {
  firstCard = null;
  secondCard = null;
  hasFlippedCard = false;
  lockBoard = false;
  
  moves = 0;
  matchedPairs = 0;
  currentScore = 0;
  timeLeft = GAME_CONFIG.INITIAL_TIME;
  isGameStarted = false;

  // Interrompe qualquer loop de cronômetro ativo
  clearInterval(timerInterval);
  timerInterval = null;

  // Atualização dos componentes da UI
  movesDisplay.textContent = '0';
  scoreDisplay.textContent = '0';
  timerDisplay.textContent = `${timeLeft}s`;
  
  // Reseta classes de perigo e barra de progresso
  timerCard.classList.remove('danger');
  timerBar.classList.remove('danger');
  timerBar.style.width = '100%';

  // Fecha e esconde o modal
  gameModal.classList.remove('active');
  gameModal.setAttribute('aria-hidden', 'true');
}

/**
 * Duplica as cartas de tecnologias para formar os pares e aplica o Fisher-Yates.
 */
function createDeck() {
  const fullDeck = [...TECH_CARDS, ...TECH_CARDS];
  cards = shuffleDeck(fullDeck);
}

/**
 * Algoritmo Fisher-Yates (Knuth Shuffle):
 * Percorre o array de trás para frente trocando o elemento atual por outro aleatório.
 * Complexidade de tempo: O(n) | Espaço: O(n)
 * @param {Array} array 
 * @returns {Array} Array embaralhado
 */
function shuffleDeck(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }
  return shuffled;
}

/**
 * Renderiza os elementos HTML das cartas no tabuleiro com suporte a Flip 3D.
 */
function renderBoard() {
  gameBoard.innerHTML = '';

  cards.forEach((tech) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.tech = tech.id; // Chave de comparação

    card.innerHTML = `
      <div class="card-face card-back"></div>
      <div class="card-face card-front">
        <i class="${tech.icon}"></i>
        <span>${tech.name}</span>
      </div>
    `;

    card.addEventListener('click', () => handleCardClick(card));
    gameBoard.appendChild(card);
  });
}

// --- 5. FUNÇÕES VITAIS: CONTROLE DO CRONÔMETRO (COUNTDOWN) ---

/**
 * INÍCIO DO CRONÔMETRO REGRESSIVO:
 * Inicia no primeiro clique do usuário. A cada 1 segundo (1000ms),
 * decrementa o tempo restante, atualiza a barra de progresso e ativa alertas
 * se o tempo for inferior a 15 segundos. Se chegar a zero, dispara Game Over.
 */
function startCountdown() {
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    timeLeft--;

    // Atualiza o display e a barra de progresso
    timerDisplay.textContent = `${timeLeft}s`;
    const percentage = (timeLeft / GAME_CONFIG.INITIAL_TIME) * 100;
    timerBar.style.width = `${Math.max(percentage, 0)}%`;

    // Alerta visual quando o tempo estiver crítico (< 15s)
    if (timeLeft <= 15) {
      timerCard.classList.add('danger');
      timerBar.classList.add('danger');
    }

    // Condição de Derrota: Tempo Esgotado
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleGameOver(false); // Derrota por tempo
    }
  }, 1000);
}

// --- 6. FUNÇÕES VITAIS: TRAVAMENTO E MECÂNICA DE CLIQUE ---

/**
 * GERENCIADOR DE CLIQUES NAS CARTAS:
 * Aplica as validações de travamento para garantir integridade do jogo.
 * @param {HTMLElement} card - Elemento da carta clicada
 */
function handleCardClick(card) {
  // TRAVAMENTO DO TABULEIRO:
  // Se lockBoard for true (validação em curso ou fim de jogo), nenhum clique é aceito.
  if (lockBoard) return;

  // Evita clicar na mesma carta já aberta ou em uma carta já acertada
  if (card === firstCard || card.classList.contains('matched') || card.classList.contains('flipped')) {
    return;
  }

  // Inicia o countdown no 1º clique da partida
  if (!isGameStarted) {
    startCountdown();
    isGameStarted = true;
  }

  // Vira a carta
  card.classList.add('flipped');

  // Primeiro clique da rodada
  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = card;
    return;
  }

  // Segundo clique da rodada: armazena e incrementa movimento
  secondCard = card;
  incrementMoves();

  // Executa a checagem de par
  checkCardsMatch();
}

function incrementMoves() {
  moves++;
  movesDisplay.textContent = moves;
}

/**
 * Compara o identificador dataset.tech de ambas as cartas.
 */
function checkCardsMatch() {
  const isMatch = firstCard.dataset.tech === secondCard.dataset.tech;

  if (isMatch) {
    handleMatchSuccess();
  } else {
    handleMatchFailure();
  }
}

/**
 * TRATA O ACERTO DO PAR:
 * - Aplica classe .matched (neon verde)
 * - Incrementa a pontuação
 * - Verifica condição de vitória (8 pares encontrados)
 */
function handleMatchSuccess() {
  firstCard.classList.add('matched');
  secondCard.classList.add('matched');

  // Adiciona pontuação por acerto
  addScore(GAME_CONFIG.POINTS_MATCH, true);

  matchedPairs++;
  resetRoundState();

  // Condição de Vitória: Todos os pares encontrados antes do tempo acabar
  if (matchedPairs === TOTAL_PAIRS) {
    clearInterval(timerInterval);
    handleGameOver(true); // Vitória!
  }
}

/**
 * TRATA O ERRO DO PAR:
 * - TRAVAMENTO DO TABULEIRO: lockBoard = true (impede novos cliques)
 * - Aplica penalidade na pontuação
 * - Aplica animação de shake
 * - Desvira as cartas após 850ms e libera o tabuleiro (lockBoard = false)
 */
function handleMatchFailure() {
  lockBoard = true; // Bloqueia o tabuleiro para evitar cliques durante o delay

  // Aplica penalidade de pontos por erro
  addScore(-GAME_CONFIG.POINTS_PENALTY, false);

  firstCard.classList.add('shake');
  secondCard.classList.add('shake');

  setTimeout(() => {
    firstCard.classList.remove('shake', 'flipped');
    secondCard.classList.remove('shake', 'flipped');

    resetRoundState(); // Libera o lockBoard e limpa referências
  }, 850);
}

/**
 * Reseta o estado do turno atual e remove o bloqueio do tabuleiro.
 */
function resetRoundState() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

// --- 7. FUNÇÕES VITAIS: FÓRMULA DE PONTUAÇÃO GAMIFICADA ---

/**
 * FÓRMULA DE PONTUAÇÃO DINÂMICA:
 * Atualiza o Score atual somando ou subtraindo pontos.
 * Garante que a pontuação não seja negativa e dispara um popup visual flutuante (+150 / -20).
 * @param {number} points - Quantidade a ser somada ou subtraída
 * @param {boolean} isPositive - Se é ganho ou perda
 */
function addScore(points, isPositive) {
  currentScore = Math.max(0, currentScore + points);
  scoreDisplay.textContent = currentScore;

  // Dispara o feedback flutuante no HUD
  triggerScorePopup(points, isPositive);
}

/**
 * Exibe animação rápida com o valor de pontos no HUD.
 */
function triggerScorePopup(points, isPositive) {
  scorePopup.textContent = isPositive ? `+${points}` : `${points}`;
  scorePopup.className = 'score-popup ' + (isPositive ? 'plus' : 'minus');

  setTimeout(() => {
    scorePopup.className = 'score-popup';
  }, 600);
}

/**
 * CÁLCULO DA PONTUAÇÃO FINAL DE VITÓRIA:
 * Score Final = Pontuação dos Acertos + (Tempo Restante * Multiplicador de Bônus)
 * @param {number} baseScore 
 * @param {number} remainingTime 
 * @returns {number}
 */
function calculateFinalScore(baseScore, remainingTime) {
  const timeBonus = remainingTime * GAME_CONFIG.POINTS_TIME_BONUS;
  return baseScore + timeBonus;
}

// --- 8. MODAL DINÂMICO DE FIM DE JOGO (VITÓRIA / DERROTA) ---

/**
 * Controla a exibição do Modal de Fim de Jogo conforme o resultado.
 * @param {boolean} isVictory - true se encontrou todos os pares, false se o tempo esgotou.
 */
function handleGameOver(isVictory) {
  // Trava o tabuleiro definitivamente no fim de jogo
  lockBoard = true;

  // Preenche dados comuns
  modalFinalTime.textContent = `${timeLeft}s`;
  modalFinalMoves.textContent = moves;
  modalFinalPairs.textContent = `${matchedPairs} / ${TOTAL_PAIRS}`;

  if (isVictory) {
    // --- ESTADO DE VITÓRIA ---
    const finalScore = calculateFinalScore(currentScore, timeLeft);
    
    modalBox.className = 'modal-content win';
    modalIcon.className = 'fa-solid fa-trophy';
    modalTitle.textContent = 'Missão Cumprida!';
    modalSubtitle.textContent = `Sensacional! Você compilou todos os pares com ${timeLeft}s de sobra.`;
    modalFinalScore.textContent = `${finalScore} pts`;
    modalBtnText.textContent = 'Jogar Novamente';
  } else {
    // --- ESTADO DE DERROTA (TEMPO ESGOTADO) ---
    modalBox.className = 'modal-content lose';
    modalIcon.className = 'fa-solid fa-triangle-exclamation';
    modalTitle.textContent = 'Game Over - Tempo Esgotado!';
    modalSubtitle.textContent = 'O prazo do sprint estourou antes de encontrar todos os pares.';
    modalFinalScore.textContent = `${currentScore} pts`;
    modalBtnText.textContent = 'Tentar Novamente';
  }

  // Abre o modal após um pequeno delay para a conclusão visual
  setTimeout(() => {
    gameModal.classList.add('active');
    gameModal.setAttribute('aria-hidden', 'false');
  }, 500);
}

// --- 9. EVENT LISTENERS ---
btnRestart.addEventListener('click', initGame);
btnModalAction.addEventListener('click', initGame);

// Inicia o jogo ao carregar a página
document.addEventListener('DOMContentLoaded', initGame);
