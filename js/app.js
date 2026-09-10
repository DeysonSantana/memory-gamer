/**
 * ==============================================================================
 * MEMORYMASTER - ORQUESTRADOR CENTRAL DA SPA (SPA APP CONTROLLER)
 * ==============================================================================
 * Gerencia o ciclo de vida da aplicação:
 * - Troca de telas (Lobby, Jogo, Construtor de Baralhos, Leaderboard)
 * - Identidade do Jogador (Nickname e Avatar Emoji)
 * - Inicialização do GameEngine, Áudio, Temas e PWA
 * - Compartilhamento por URL e QR Code nativo
 * - Importação e Exportação de Baralhos (JSON e CSV)
 */

import { themeManager, THEMES } from './themeManager.js';
import { soundFx } from './audio.js';
import { deckManager } from './deckManager.js';
import { GameEngine } from './gameEngine.js';
import { leaderboardManager } from './leaderboardManager.js';
import { CsvParser } from './csvParser.js';
import { ShareManager } from './shareManager.js';
import { QrCodeEngine } from './qrcodeEngine.js';
import { offlineManager } from './offlineManager.js';

class MemoryMasterApp {
  constructor() {
    this.currentScreen = 'lobby';
    this.selectedDeck = null;
    this.selectedMode = 'timed';
    this.selectedDifficulty = 'medium';

    this.nickname = localStorage.getItem('memorymaster_nickname') || 'Estudante';
    this.avatarEmoji = localStorage.getItem('memorymaster_avatar') || '🎓';

    this.gameEngine = new GameEngine({
      onScoreUpdate: (score, delta) => this.handleScoreUpdate(score, delta),
      onTimerUpdate: (time, mode, limit) => this.handleTimerUpdate(time, mode, limit),
      onMovesUpdate: (moves) => this.handleMovesUpdate(moves),
      onComboUpdate: (combo) => this.handleComboUpdate(combo),
      onCuriosity: (text) => this.showCuriosityPill(text),
      onGameOver: (result) => this.handleGameOver(result)
    });
  }

  init() {
    // 1. Inicializa Temas e PWA
    themeManager.init();
    offlineManager.init('btn-install-pwa', 'offline-badge');

    // 2. Elementos de Interface
    this.cacheDomElements();
    this.setupEventListeners();

    // 3. Atualiza perfil
    this.updateProfileUI();

    // 4. Renderiza lista de baralhos no lobby
    this.renderDeckSelector();

    // 5. Checa se o usuário abriu um link com baralho compartilhado (#share=...)
    this.checkSharedUrlPayload();
  }

  cacheDomElements() {
    // Telas
    this.screens = {
      lobby: document.getElementById('screen-lobby'),
      game: document.getElementById('screen-game'),
      builder: document.getElementById('screen-builder'),
      leaderboard: document.getElementById('screen-leaderboard')
    };

    // HUD do Jogo
    this.hudTimer = document.getElementById('hud-timer');
    this.hudTimerCard = document.getElementById('hud-timer-card');
    this.hudTimerBar = document.getElementById('hud-timer-bar');
    this.hudScore = document.getElementById('hud-score');
    this.hudMoves = document.getElementById('hud-moves');
    this.hudComboBadge = document.getElementById('hud-combo-badge');
    this.hudScorePopup = document.getElementById('hud-score-popup');
    this.gameBoard = document.getElementById('game-board');
    this.gameDeckTitle = document.getElementById('game-deck-title');
    this.curiosityPill = document.getElementById('curiosity-pill');
    this.curiosityText = document.getElementById('curiosity-text');

    // Modais
    this.gameModal = document.getElementById('game-modal');
    this.shareModal = document.getElementById('share-modal');
    this.avatarModal = document.getElementById('avatar-modal');
  }

  setupEventListeners() {
    // Alternar Tema
    document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
      const next = themeManager.cycleNextTheme();
      this.showToast(`Tema: ${next.name}`);
    });

    // Alternar Áudio
    const btnMute = document.getElementById('btn-sound-toggle');
    btnMute?.addEventListener('click', () => {
      const isMuted = soundFx.toggleMute();
      btnMute.innerHTML = isMuted
        ? '<i class="fa-solid fa-volume-xmark"></i>'
        : '<i class="fa-solid fa-volume-high"></i>';
      this.showToast(isMuted ? 'Som desativado' : 'Som ativado');
    });

    // Navegação no Header
    document.getElementById('nav-lobby')?.addEventListener('click', () => this.navigateTo('lobby'));
    document.getElementById('nav-builder')?.addEventListener('click', () => this.openDeckBuilder());
    document.getElementById('nav-leaderboard')?.addEventListener('click', () => this.openLeaderboard());

    // Botão Iniciar Jogo no Lobby
    document.getElementById('btn-start-game')?.addEventListener('click', () => this.startGame());

    // Controles no HUD do Jogo
    document.getElementById('btn-restart-game')?.addEventListener('click', () => this.startGame());
    document.getElementById('btn-exit-game')?.addEventListener('click', () => this.navigateTo('lobby'));

    // Botões dos Modais
    document.getElementById('btn-modal-replay')?.addEventListener('click', () => {
      this.closeModal(this.gameModal);
      this.startGame();
    });
    document.getElementById('btn-modal-lobby')?.addEventListener('click', () => {
      this.closeModal(this.gameModal);
      this.navigateTo('lobby');
    });

    // Avatar e Nickname
    document.getElementById('user-avatar-btn')?.addEventListener('click', () => {
      this.openModal(this.avatarModal);
    });
    document.getElementById('user-nickname')?.addEventListener('change', (e) => {
      this.nickname = e.target.value.trim() || 'Estudante';
      localStorage.setItem('memorymaster_nickname', this.nickname);
    });

    this.setupAvatarGrid();
    this.setupBuilderEvents();
  }

  /**
   * Alterna a exibição entre as telas da SPA
   * @param {string} screenId 
   */
  navigateTo(screenId) {
    this.currentScreen = screenId;
    Object.keys(this.screens).forEach(key => {
      if (this.screens[key]) {
        this.screens[key].classList.toggle('active', key === screenId);
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (screenId === 'lobby') {
      this.renderDeckSelector();
    }
  }

  // --- CONTROLES DE IDENTIDADE DO USUÁRIO ---
  updateProfileUI() {
    const avatarEl = document.getElementById('user-avatar-display');
    const nickInput = document.getElementById('user-nickname');
    if (avatarEl) avatarEl.textContent = this.avatarEmoji;
    if (nickInput) nickInput.value = this.nickname;
  }

  setupAvatarGrid() {
    const emojis = ['🎓', '🔬', '🚀', '💡', '🦁', '⚡', '🎨', '🧠', '🏆', '🌟', '💻', '🌍', '📐', '⚗️', '📚', '🎯'];
    const grid = document.getElementById('avatar-grid');
    if (!grid) return;

    grid.innerHTML = '';
    emojis.forEach(emoji => {
      const btn = document.createElement('button');
      btn.className = 'avatar-option';
      btn.textContent = emoji;
      btn.addEventListener('click', () => {
        this.avatarEmoji = emoji;
        localStorage.setItem('memorymaster_avatar', emoji);
        this.updateProfileUI();
        this.closeModal(this.avatarModal);
      });
      grid.appendChild(btn);
    });
  }

  // --- SELETOR DE BARALHO NO LOBBY ---
  renderDeckSelector() {
    const container = document.getElementById('deck-list-container');
    if (!container) return;

    const decks = deckManager.getAllDecks();
    container.innerHTML = '';

    decks.forEach((deck, index) => {
      const card = document.createElement('div');
      card.className = `deck-card ${(!this.selectedDeck && index === 0) || this.selectedDeck?.id === deck.id ? 'selected' : ''}`;
      card.dataset.deckId = deck.id;

      card.innerHTML = `
        <div class="deck-icon"><i class="fa-solid ${deck.icon || 'fa-graduation-cap'}"></i></div>
        <div class="deck-info">
          <div class="deck-header">
            <span class="deck-tag">${deck.category || 'Geral'}</span>
            ${deck.isCustom ? '<span class="deck-custom-badge">Criado</span>' : ''}
          </div>
          <h3 class="deck-title">${deck.title}</h3>
          <p class="deck-desc">${deck.description || 'Pares conceituais para memorização ativa.'}</p>
          <div class="deck-meta">
            <span><i class="fa-solid fa-layer-group"></i> ${deck.pairs.length} pares</span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        document.querySelectorAll('.deck-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedDeck = deck;
      });

      container.appendChild(card);
    });

    if (!this.selectedDeck && decks.length > 0) {
      this.selectedDeck = decks[0];
    }
  }

  // --- FLUXO DO JOGO ---
  startGame() {
    if (!this.selectedDeck) {
      this.selectedDeck = deckManager.getAllDecks()[0];
    }

    // Lê os filtros do lobby
    const modeInput = document.querySelector('input[name="game-mode"]:checked');
    this.selectedMode = modeInput ? modeInput.value : 'timed';

    const diffInput = document.querySelector('input[name="difficulty"]:checked');
    this.selectedDifficulty = diffInput ? diffInput.value : 'medium';

    this.gameDeckTitle.textContent = this.selectedDeck.title;

    // Inicia o motor do jogo
    const cards = this.gameEngine.start(this.selectedDeck, this.selectedMode, this.selectedDifficulty);
    this.renderGameBoard(cards);

    this.navigateTo('game');
  }

  renderGameBoard(cards) {
    this.gameBoard.innerHTML = '';

    // Configura classe de grid dinâmico conforme total de cartas (12, 16 ou 24)
    this.gameBoard.className = `game-board cards-${cards.length}`;

    cards.forEach((cardData) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'card';
      cardEl.dataset.instanceId = cardData.instanceId;

      let frontHtml = '';
      if (cardData.isIcon && cardData.icon) {
        frontHtml = `
          <i class="${cardData.icon}"></i>
          <span class="card-title">${cardData.content}</span>
        `;
      } else {
        frontHtml = `
          <span class="card-title">${cardData.content}</span>
          ${cardData.subtext ? `<span class="card-subtext">${cardData.subtext}</span>` : ''}
        `;
      }

      cardEl.innerHTML = `
        <div class="card-face card-back"></div>
        <div class="card-face card-front">
          ${frontHtml}
        </div>
      `;

      cardEl.addEventListener('click', () => {
        this.gameEngine.handleCardClick(cardEl, cardData);
      });

      this.gameBoard.appendChild(cardEl);
    });
  }

  // --- FEEDBACK DO HUD ---
  handleScoreUpdate(score, delta) {
    this.hudScore.textContent = score;

    if (delta !== 0) {
      this.hudScorePopup.textContent = delta > 0 ? `+${delta}` : `${delta}`;
      this.hudScorePopup.className = `score-popup ${delta > 0 ? 'plus' : 'minus'}`;
      setTimeout(() => {
        this.hudScorePopup.className = 'score-popup';
      }, 650);
    }
  }

  handleTimerUpdate(seconds, mode, limit) {
    if (mode === 'timed') {
      this.hudTimer.textContent = `${seconds}s`;
      const pct = (seconds / limit) * 100;
      this.hudTimerBar.style.width = `${Math.max(pct, 0)}%`;

      if (seconds <= 10) {
        this.hudTimerCard.classList.add('danger');
        this.hudTimerBar.classList.add('danger');
      } else {
        this.hudTimerCard.classList.remove('danger');
        this.hudTimerBar.classList.remove('danger');
      }
    } else {
      // Modo Combo ou Zen: Formatação MM:SS
      const m = String(Math.floor(seconds / 60)).padStart(2, '0');
      const s = String(seconds % 60).padStart(2, '0');
      this.hudTimer.textContent = `${m}:${s}`;
      this.hudTimerBar.style.width = '100%';
      this.hudTimerCard.classList.remove('danger');
      this.hudTimerBar.classList.remove('danger');
    }
  }

  handleMovesUpdate(moves) {
    this.hudMoves.textContent = moves;
  }

  handleComboUpdate(streak) {
    if (streak > 1) {
      this.hudComboBadge.textContent = `🔥 ${streak}x Combo!`;
      this.hudComboBadge.classList.add('active');
    } else {
      this.hudComboBadge.classList.remove('active');
    }
  }

  showCuriosityPill(text) {
    this.curiosityText.textContent = text;
    this.curiosityPill.classList.add('show');

    clearTimeout(this.curiosityTimeout);
    this.curiosityTimeout = setTimeout(() => {
      this.curiosityPill.classList.remove('show');
    }, 4500);
  }

  handleGameOver(result) {
    const modalBox = document.getElementById('game-modal-box');
    const modalIcon = document.getElementById('game-modal-icon');
    const modalTitle = document.getElementById('game-modal-title');
    const modalSubtitle = document.getElementById('game-modal-subtitle');

    document.getElementById('modal-final-score').textContent = `${result.score} pts`;
    document.getElementById('modal-final-moves').textContent = result.moves;
    document.getElementById('modal-final-streak').textContent = `${result.maxStreak}x`;

    if (result.isVictory) {
      modalBox.className = 'modal-content win';
      modalIcon.className = 'fa-solid fa-trophy';
      modalTitle.textContent = 'Missão Cumprida!';
      modalSubtitle.textContent = `Você dominou os conceitos de ${result.deck.title}!`;

      // Salva no Ranking Local
      leaderboardManager.addScore({
        nickname: this.nickname,
        avatarEmoji: this.avatarEmoji,
        deckId: result.deck.id,
        deckTitle: result.deck.title,
        mode: result.mode,
        score: result.score,
        moves: result.moves,
        timeSeconds: result.timeSeconds,
        maxStreak: result.maxStreak
      });
    } else {
      modalBox.className = 'modal-content lose';
      modalIcon.className = 'fa-solid fa-hourglass-end';
      modalTitle.textContent = 'Tempo Esgotado!';
      modalSubtitle.textContent = 'O tempo acabou antes de todos os pares serem encontrados.';
    }

    setTimeout(() => {
      this.openModal(this.gameModal);
    }, 500);
  }

  // --- CONSTRUTOR DE BARALHOS (DECK BUILDER) ---
  openDeckBuilder() {
    this.navigateTo('builder');
    this.renderBuilderPairsList();
  }

  setupBuilderEvents() {
    const pairList = document.getElementById('builder-pairs-list');
    const btnAddPair = document.getElementById('btn-add-pair');
    const btnSaveDeck = document.getElementById('btn-save-deck');
    const btnExportCsv = document.getElementById('btn-export-csv');
    const btnCsvTemplate = document.getElementById('btn-csv-template');
    const fileCsvInput = document.getElementById('file-import-csv');
    const fileJsonInput = document.getElementById('file-import-json');

    btnAddPair?.addEventListener('click', () => {
      this.addBuilderPairRow();
    });

    btnSaveDeck?.addEventListener('click', () => {
      this.saveCustomDeckFromForm();
    });

    btnCsvTemplate?.addEventListener('click', () => {
      const template = CsvParser.generateTemplate();
      this.downloadFile(template, 'modelo_baralho_memorymaster.csv', 'text/csv');
    });

    btnExportCsv?.addEventListener('click', () => {
      const currentDeck = this.selectedDeck || deckManager.getAllDecks()[0];
      const csv = CsvParser.exportToCsv(currentDeck.pairs);
      this.downloadFile(csv, `${currentDeck.id}_pares.csv`, 'text/csv');
    });

    fileCsvInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const res = CsvParser.parse(event.target.result);
        if (res.success) {
          this.loadPairsIntoBuilder(res.pairs);
          this.showToast(`Importados ${res.pairs.length} pares com sucesso!`);
        } else {
          alert(res.error);
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    });

    fileJsonInput?.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const saved = await deckManager.importDeckFromJson(file);
        this.showToast(`Baralho "${saved.title}" importado com sucesso!`);
        this.renderDeckSelector();
      } catch (err) {
        alert(err.message);
      }
      e.target.value = '';
    });

    // Compartilhamento via QR Code & Link
    document.getElementById('btn-share-deck')?.addEventListener('click', () => {
      this.openShareModalForCurrentDeck();
    });
    document.getElementById('btn-copy-share-url')?.addEventListener('click', () => {
      const input = document.getElementById('share-url-input');
      if (input) {
        navigator.clipboard.writeText(input.value);
        this.showToast('Link copiado para a área de transferência!');
      }
    });
  }

  renderBuilderPairsList() {
    const list = document.getElementById('builder-pairs-list');
    if (!list) return;

    list.innerHTML = '';
    // Inicializa com 6 linhas vazias se não houver
    for (let i = 0; i < 6; i++) {
      this.addBuilderPairRow();
    }
  }

  addBuilderPairRow(pairData = null) {
    const list = document.getElementById('builder-pairs-list');
    if (!list) return;

    const row = document.createElement('div');
    row.className = 'builder-pair-row';
    row.innerHTML = `
      <div class="row-inputs">
        <input type="text" class="input-term-a" placeholder="Termo A (ex: H₂O)" value="${pairData?.cardA?.content || ''}">
        <input type="text" class="input-term-b" placeholder="Termo B (ex: Água)" value="${pairData?.cardB?.content || ''}">
        <input type="text" class="input-curiosity" placeholder="Curiosidade / Pílula de aprendizado" value="${pairData?.curiosity || ''}">
      </div>
      <button type="button" class="btn-remove-row" title="Remover par"><i class="fa-solid fa-trash"></i></button>
    `;

    row.querySelector('.btn-remove-row').addEventListener('click', () => {
      if (list.children.length > 6) {
        row.remove();
      } else {
        this.showToast('Mínimo de 6 pares necessários!');
      }
    });

    list.appendChild(row);
  }

  loadPairsIntoBuilder(pairs) {
    const list = document.getElementById('builder-pairs-list');
    list.innerHTML = '';
    pairs.forEach(p => this.addBuilderPairRow(p));
  }

  saveCustomDeckFromForm() {
    const titleInput = document.getElementById('builder-deck-title');
    const categoryInput = document.getElementById('builder-deck-category');
    const descInput = document.getElementById('builder-deck-desc');

    const title = titleInput.value.trim();
    if (!title) {
      alert('Por favor, informe um título para o baralho.');
      return;
    }

    const rows = document.querySelectorAll('.builder-pair-row');
    const pairs = [];

    rows.forEach((row, idx) => {
      const termA = row.querySelector('.input-term-a').value.trim();
      const termB = row.querySelector('.input-term-b').value.trim();
      const cur = row.querySelector('.input-curiosity').value.trim();

      if (termA && termB) {
        pairs.push({
          id: `custom_pair_${idx}`,
          cardA: { content: termA, subtext: 'Termo' },
          cardB: { content: termB, subtext: 'Correspondência' },
          curiosity: cur || `${termA} está diretamente ligado a ${termB}.`
        });
      }
    });

    if (pairs.length < 6) {
      alert(`Você preencheu apenas ${pairs.length} pares válidos. São necessários no mínimo 6 pares!`);
      return;
    }

    const newDeck = deckManager.saveDeck({
      title,
      category: categoryInput.value.trim() || 'Customizado',
      description: descInput.value.trim() || 'Baralho educativo personalizado.',
      icon: 'fa-brain',
      pairs
    });

    this.showToast(`Baralho "${newDeck.title}" salvo com sucesso!`);
    this.selectedDeck = newDeck;
    this.navigateTo('lobby');
  }

  openShareModalForCurrentDeck() {
    const deck = this.selectedDeck || deckManager.getAllDecks()[0];
    const shareUrl = ShareManager.generateShareUrl(deck);

    const input = document.getElementById('share-url-input');
    const canvas = document.getElementById('share-qr-canvas');

    if (input) input.value = shareUrl;
    if (canvas) QrCodeEngine.render(canvas, shareUrl, 200);

    document.getElementById('share-deck-title').textContent = deck.title;
    this.openModal(this.shareModal);
  }

  // --- CHECK URL SHARE PAYLOAD ---
  checkSharedUrlPayload() {
    const sharedDeck = ShareManager.parseUrlPayload();
    if (sharedDeck) {
      const confirmed = confirm(
        `Você recebeu o baralho "${sharedDeck.title}" (${sharedDeck.pairs.length} pares) via link compartilhado!\nDeseja jogá-lo agora?`
      );

      if (confirmed) {
        const saved = deckManager.saveDeck(sharedDeck);
        this.selectedDeck = saved;
        this.renderDeckSelector();
        this.startGame();
      }
      ShareManager.clearUrlPayload();
    }
  }

  // --- LEADERBOARD ---
  openLeaderboard() {
    this.navigateTo('leaderboard');
    this.renderLeaderboardTable();
  }

  renderLeaderboardTable() {
    const container = document.getElementById('leaderboard-list');
    if (!container) return;

    const scores = leaderboardManager.getTopScores('all', 15);
    container.innerHTML = '';

    if (scores.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-trophy"></i>
          <p>Nenhuma pontuação registrada ainda. Jogue uma partida para inaugurar o pódio!</p>
        </div>
      `;
      return;
    }

    scores.forEach((entry, idx) => {
      const item = document.createElement('div');
      item.className = `leaderboard-row ${idx < 3 ? `podium-${idx + 1}` : ''}`;

      const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;

      item.innerHTML = `
        <div class="rank-col">${medal}</div>
        <div class="player-col">
          <span class="player-avatar">${entry.avatarEmoji}</span>
          <div class="player-details">
            <span class="player-name">${entry.nickname}</span>
            <span class="player-deck">${entry.deckTitle}</span>
          </div>
        </div>
        <div class="stat-col"><i class="fa-solid fa-fire"></i> ${entry.maxStreak}x</div>
        <div class="score-col"><strong>${entry.score}</strong> pts</div>
      `;

      container.appendChild(item);
    });
  }

  // --- UTILITÁRIOS ---
  openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('active');
    modalEl.setAttribute('aria-hidden', 'false');
  }

  closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove('active');
    modalEl.setAttribute('aria-hidden', 'true');
  }

  showToast(message) {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-notification';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('active');
    setTimeout(() => toast.classList.remove('active'), 2500);
  }

  downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  window.app = new MemoryMasterApp();
  window.app.init();
});
