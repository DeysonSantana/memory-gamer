/**
 * ==============================================================================
 * MEMORYMASTER - MOTOR DE JOGO E GAMIFICAÇÃO (MDA ENGINE)
 * ==============================================================================
 * Gerencia:
 * - Algoritmo Fisher-Yates de embaralhamento
 * - Modos de Jogo: Contra o Tempo, Rápido & Preciso (Combos) e Modo Zen
 * - Dificuldades: Fácil (6 pares), Médio (8 pares), Difícil (12 pares)
 * - Validação de pares conceituais (Termo A <-> Termo B)
 * - Multiplicador de Combo/Streak (🔥 2x, 3x...)
 * - Efeitos sonoros procedurais via SoundEngine
 * - Emissão de Pílulas Pedagógicas de Curiosidade
 */

import { soundFx } from './audio.js';

export class GameEngine {
  constructor(callbacks = {}) {
    this.callbacks = {
      onScoreUpdate: () => {},
      onTimerUpdate: () => {},
      onMovesUpdate: () => {},
      onComboUpdate: () => {},
      onCuriosity: () => {},
      onGameOver: () => {},
      ...callbacks
    };

    this.resetState();
  }

  resetState() {
    this.deck = null;
    this.mode = 'timed'; // 'timed' | 'combo' | 'zen'
    this.difficulty = 'medium'; // 'easy' (6), 'medium' (8), 'hard' (12)
    
    this.cards = [];
    this.firstCard = null;
    this.secondCard = null;
    this.hasFlippedCard = false;
    this.lockBoard = false;

    this.moves = 0;
    this.matchedPairs = 0;
    this.totalPairs = 8;
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;

    this.timeLimit = 60;
    this.timeSeconds = 60; // No modo timed é regressivo; no zen/combo é progressivo
    this.timerInterval = null;
    this.isGameActive = false;
    this.isGameStarted = false;
  }

  /**
   * Configura e inicia uma nova partida
   * @param {Object} deck - Baralho escolhido
   * @param {string} mode - 'timed' | 'combo' | 'zen'
   * @param {string} difficulty - 'easy' | 'medium' | 'hard'
   */
  start(deck, mode = 'timed', difficulty = 'medium') {
    this.stopTimer();
    this.resetState();

    this.deck = deck;
    this.mode = mode;
    this.difficulty = difficulty;

    // Define a quantidade de pares conforme a dificuldade
    const pairLimits = { easy: 6, medium: 8, hard: 12 };
    this.totalPairs = Math.min(pairLimits[difficulty] || 8, deck.pairs.length);

    // Ajusta o tempo limite no modo contra o tempo
    if (this.mode === 'timed') {
      this.timeLimit = this.difficulty === 'easy' ? 45 : this.difficulty === 'medium' ? 60 : 90;
      this.timeSeconds = this.timeLimit;
    } else {
      this.timeSeconds = 0;
    }

    this.prepareDeckCards();
    this.isGameActive = true;

    // Dispara atualizações iniciais na UI
    this.callbacks.onScoreUpdate(this.score, 0);
    this.callbacks.onMovesUpdate(this.moves);
    this.callbacks.onComboUpdate(this.streak);
    this.callbacks.onTimerUpdate(this.timeSeconds, this.mode, this.timeLimit);

    return this.cards;
  }

  /**
   * Prepara os pares de cartas (A e B) e embaralha com Fisher-Yates
   */
  prepareDeckCards() {
    // Seleciona os pares necessários aleatoriamente
    const shuffledSource = this.shuffle([...this.deck.pairs]);
    const selectedPairs = shuffledSource.slice(0, this.totalPairs);

    const generatedCards = [];

    selectedPairs.forEach((pair, pairIndex) => {
      // Carta A
      generatedCards.push({
        instanceId: `card_${pair.id}_A_${pairIndex}`,
        pairId: pair.id,
        content: pair.cardA.content,
        subtext: pair.cardA.subtext || '',
        visual: pair.cardA.visual || pair.cardA.emoji || '💡',
        icon: pair.cardA.icon || '',
        isIcon: !!pair.cardA.isIcon,
        side: 'A',
        curiosity: pair.curiosity || ''
      });

      // Carta B (Par correspondente)
      generatedCards.push({
        instanceId: `card_${pair.id}_B_${pairIndex}`,
        pairId: pair.id,
        content: pair.cardB.content,
        subtext: pair.cardB.subtext || '',
        visual: pair.cardB.visual || pair.cardB.emoji || '✨',
        icon: pair.cardB.icon || '',
        isIcon: !!pair.cardB.isIcon,
        side: 'B',
        curiosity: pair.curiosity || ''
      });
    });

    this.cards = this.shuffle(generatedCards);
  }

  /**
   * Algoritmo de Embaralhamento Fisher-Yates (Knuth) O(n)
   */
  shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /**
   * Gerencia o clique em uma carta
   * @param {HTMLElement} cardElement 
   * @param {Object} cardData 
   */
  handleCardClick(cardElement, cardData) {
    if (!this.isGameActive || this.lockBoard) return;
    if (cardElement.classList.contains('flipped') || cardElement.classList.contains('matched')) return;
    if (cardElement === this.firstCard?.element) return;

    // Inicia o cronômetro no primeiro clique
    if (!this.isGameStarted) {
      this.startTimer();
      this.isGameStarted = true;
    }

    // Toca som de flip
    soundFx.playFlip();
    cardElement.classList.add('flipped');

    if (!this.hasFlippedCard) {
      // 1ª carta do turno
      this.hasFlippedCard = true;
      this.firstCard = { element: cardElement, data: cardData };
      return;
    }

    // 2ª carta do turno
    this.secondCard = { element: cardElement, data: cardData };
    this.moves++;
    this.callbacks.onMovesUpdate(this.moves);

    this.checkMatch();
  }

  /**
   * Checa se as duas cartas formam um par correto
   */
  checkMatch() {
    const isMatch = this.firstCard.data.pairId === this.secondCard.data.pairId;

    if (isMatch) {
      this.handleSuccess();
    } else {
      this.handleFailure();
    }
  }

  handleSuccess() {
    const cardA = this.firstCard.element;
    const cardB = this.secondCard.element;
    const curiosityText = this.firstCard.data.curiosity;

    cardA.classList.add('matched');
    cardB.classList.add('matched');

    this.matchedPairs++;
    this.streak++;
    if (this.streak > this.maxStreak) {
      this.maxStreak = this.streak;
    }

    // Reproduz áudio de match ou combo
    if (this.streak > 1) {
      soundFx.playCombo(this.streak);
    } else {
      soundFx.playMatch();
    }

    // Cálculo gamificado de pontos
    // Base: +120 pontos | Bônus Streak: (streak - 1) * 30
    const basePoints = 120;
    const streakBonus = (this.streak - 1) * 30;
    const pointsGained = basePoints + streakBonus;
    this.score += pointsGained;

    this.callbacks.onScoreUpdate(this.score, pointsGained);
    this.callbacks.onComboUpdate(this.streak);

    // Emite pílula formativa de curiosidade
    if (curiosityText) {
      this.callbacks.onCuriosity(curiosityText);
    }

    this.resetTurn();

    // Checa vitória
    if (this.matchedPairs === this.totalPairs) {
      this.handleWin();
    }
  }

  handleFailure() {
    this.lockBoard = true;
    soundFx.playError();

    // Penalidade em pontos (exceto no modo Zen)
    let penalty = 0;
    if (this.mode !== 'zen') {
      penalty = 15;
      this.score = Math.max(0, this.score - penalty);
      this.callbacks.onScoreUpdate(this.score, -penalty);
    }

    // Zera o streak
    this.streak = 0;
    this.callbacks.onComboUpdate(this.streak);

    const el1 = this.firstCard.element;
    const el2 = this.secondCard.element;

    el1.classList.add('shake');
    el2.classList.add('shake');

    setTimeout(() => {
      el1.classList.remove('shake', 'flipped');
      el2.classList.remove('shake', 'flipped');
      this.resetTurn();
    }, 850);
  }

  resetTurn() {
    this.hasFlippedCard = false;
    this.lockBoard = false;
    this.firstCard = null;
    this.secondCard = null;
  }

  startTimer() {
    this.stopTimer();

    this.timerInterval = setInterval(() => {
      if (this.mode === 'timed') {
        this.timeSeconds--;
        this.callbacks.onTimerUpdate(this.timeSeconds, this.mode, this.timeLimit);

        if (this.timeSeconds <= 8 && this.timeSeconds > 0) {
          soundFx.playTick();
        }

        if (this.timeSeconds <= 0) {
          this.stopTimer();
          this.handleTimeout();
        }
      } else {
        // No modo combo ou zen o tempo conta progressivamente
        this.timeSeconds++;
        this.callbacks.onTimerUpdate(this.timeSeconds, this.mode, null);
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  handleWin() {
    this.stopTimer();
    this.isGameActive = false;

    // Bônus final de rapidez no modo timed
    let speedBonus = 0;
    if (this.mode === 'timed' && this.timeSeconds > 0) {
      speedBonus = this.timeSeconds * 12;
      this.score += speedBonus;
      this.callbacks.onScoreUpdate(this.score, speedBonus);
    }

    soundFx.playVictory();

    this.callbacks.onGameOver({
      isVictory: true,
      score: this.score,
      moves: this.moves,
      timeSeconds: this.timeSeconds,
      mode: this.mode,
      maxStreak: this.maxStreak,
      speedBonus: speedBonus,
      deck: this.deck
    });
  }

  handleTimeout() {
    this.isGameActive = false;
    this.lockBoard = true;
    soundFx.playGameOver();

    this.callbacks.onGameOver({
      isVictory: false,
      score: this.score,
      moves: this.moves,
      timeSeconds: 0,
      mode: this.mode,
      maxStreak: this.maxStreak,
      speedBonus: 0,
      deck: this.deck
    });
  }
}
