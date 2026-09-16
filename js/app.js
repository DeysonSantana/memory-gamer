/**
 * ==============================================================================
 * MEMORYMASTER - ORQUESTRADOR CENTRAL DA SPA (SPA APP CONTROLLER)
 * ==============================================================================
 * Gerencia o ciclo de vida da aplicação:
 * - Troca de telas (Lobby, Jogo, Construtor, Leaderboard, Sala Multiplayer)
 * - Autenticação com Google via Firebase & Modo Convidado
 * - Salas Multiplayer ao Vivo (Lobby síncrono com PIN e Pódio coletivo)
 * - Sincronização e cálculo de responsividade extrema
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
import { authManager } from './authManager.js';
import { roomManager } from './roomManager.js';
import { saveFirebaseConfig, getSavedFirebaseConfig, isFirebaseConfigured } from './firebaseConfig.js';

class MemoryMasterApp {
  constructor() {
    this.currentScreen = 'lobby';
    this.selectedDeck = null;
    this.selectedMode = 'timed';
    this.selectedDifficulty = 'medium';

    this.nickname = localStorage.getItem('memorymaster_nickname') || 'Estudante';
    this.avatarEmoji = localStorage.getItem('memorymaster_avatar') || '🎓';
    this.activeRoom = null;

    this.gameEngine = new GameEngine({
      onScoreUpdate: (score, delta) => this.handleScoreUpdate(score, delta),
      onTimerUpdate: (time, mode, limit) => this.handleTimerUpdate(time, mode, limit),
      onMovesUpdate: (moves) => this.handleMovesUpdate(moves),
      onComboUpdate: (combo) => this.handleComboUpdate(combo),
      onCuriosity: (text) => this.showCuriosityPill(text),
      onGameOver: (result) => this.handleGameOver(result),
      onProgress: (stats) => this.handleGameProgress(stats)
    });
  }

  init() {
    // 1. Inicializa Temas e PWA
    themeManager.init();
    offlineManager.init('btn-install-pwa', 'offline-badge');

    // 2. Cache de elementos do DOM
    this.cacheDomElements();

    // 3. Ouvintes de eventos e autenticação
    this.setupEventListeners();
    this.setupAuthListeners();

    // 4. Renderiza lista de baralhos no lobby
    this.renderDeckSelector();

    // 5. Ajuste inicial de responsividade fluida
    this.setupResponsiveLayout();

    // 6. Verifica URLs compartilhadas (#share=... ou #room=...)
    this.checkUrlPayloads();
  }

  cacheDomElements() {
    // Telas
    this.screens = {
      lobby: document.getElementById('screen-lobby'),
      game: document.getElementById('screen-game'),
      builder: document.getElementById('screen-builder'),
      leaderboard: document.getElementById('screen-leaderboard'),
      roomLobby: document.getElementById('screen-room-lobby')
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
    this.modesModal = document.getElementById('modes-modal');
    this.firebaseModal = document.getElementById('firebase-modal');
    this.joinRoomModal = document.getElementById('join-room-modal');
    this.groupPodiumModal = document.getElementById('group-podium-modal');
    this.userProfileModal = document.getElementById('user-profile-modal');

    // Elementos do Menu Lateral Mobile (Estilo QuizMaster)
    this.mobileDrawerContainer = document.getElementById('mobile-drawer-container');
    this.mobileDrawerBackdrop = document.getElementById('mobile-drawer-backdrop');
    this.mobileMenuToggleBtn = document.getElementById('mobile-menu-toggle-btn');
    this.closeMobileDrawerBtn = document.getElementById('close-mobile-drawer-btn');
    this.drawerBrandLogo = document.getElementById('drawer-brand-logo');
    this.drawerAuthBtn = document.getElementById('drawer-auth-btn');
    this.drawerUserName = document.getElementById('drawer-user-name');
    this.drawerUserStatus = document.getElementById('drawer-user-status');
    this.drawerUserAvatarText = document.getElementById('drawer-user-avatar-text');
    this.drawerUserAvatarImg = document.getElementById('drawer-user-avatar-img');
    this.drawerBuilderBtn = document.getElementById('drawer-builder-btn');
    this.drawerMyDecksBtn = document.getElementById('drawer-my-decks-btn');
    this.drawerRoomsBtn = document.getElementById('drawer-rooms-btn');
    this.drawerShareBtn = document.getElementById('drawer-share-btn');
    this.drawerThemeBtn = document.getElementById('drawer-theme-btn');
    this.drawerThemeName = document.getElementById('drawer-theme-name');
    this.drawerSoundBtn = document.getElementById('drawer-sound-btn');
  }

  setupEventListeners() {
    // Alternar Tema
    document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
      const next = themeManager.cycleNextTheme();
      this.updateDrawerThemeLabel(next.name);
      this.showToast(`Tema: ${next.name}`);
    });

    // Alternar Áudio
    const btnMute = document.getElementById('btn-sound-toggle');
    btnMute?.addEventListener('click', () => {
      const isMuted = soundFx.toggleMute();
      btnMute.innerHTML = isMuted
        ? '<i class="fa-solid fa-volume-xmark"></i>'
        : '<i class="fa-solid fa-volume-high"></i>';
      this.updateDrawerSoundLabel(isMuted);
      this.showToast(isMuted ? 'Som desativado' : 'Som ativado');
    });

    // Navegação no Header
    document.getElementById('nav-lobby')?.addEventListener('click', () => this.navigateTo('lobby'));
    document.getElementById('nav-builder')?.addEventListener('click', () => this.openDeckBuilder());
    document.getElementById('nav-leaderboard')?.addEventListener('click', () => this.openLeaderboard());

    // Explicação dos Modos de Jogo
    document.getElementById('btn-modes-info')?.addEventListener('click', () => {
      this.openModal(this.modesModal);
    });

    // Botão Iniciar Jogo Solo no Lobby
    document.getElementById('btn-start-game')?.addEventListener('click', () => this.startSoloGame());

    // Botões de Sala Multiplayer
    document.getElementById('btn-create-room')?.addEventListener('click', () => this.createGroupRoom());
    document.getElementById('btn-join-room-prompt')?.addEventListener('click', () => {
      this.openModal(this.joinRoomModal);
    });
    document.getElementById('btn-confirm-join-pin')?.addEventListener('click', () => this.confirmJoinByPin());

    // Controles da Sala de Espera
    document.getElementById('btn-start-room-game')?.addEventListener('click', () => this.startRoomGameAction());
    document.getElementById('btn-leave-room')?.addEventListener('click', () => this.leaveCurrentRoom());
    document.getElementById('btn-copy-room-pin')?.addEventListener('click', () => this.copyRoomPinLink());

    // Ações do Jogo e Modais
    document.getElementById('btn-restart-game')?.addEventListener('click', () => this.restartGame());
    document.getElementById('btn-exit-game')?.addEventListener('click', () => this.exitGame());
    document.getElementById('btn-share-deck')?.addEventListener('click', () => this.openDeckShareModal());
    document.getElementById('btn-copy-share-url')?.addEventListener('click', () => this.copyShareUrl());

    // Botões dos Modais de Fim de Jogo
    document.getElementById('btn-modal-replay')?.addEventListener('click', () => {
      this.closeModal(this.gameModal);
      this.startSoloGame();
    });
    document.getElementById('btn-modal-lobby')?.addEventListener('click', () => {
      this.closeModal(this.gameModal);
      this.navigateTo('lobby');
    });
    document.getElementById('btn-podium-close')?.addEventListener('click', () => {
      this.closeModal(this.groupPodiumModal);
      this.leaveCurrentRoom();
      this.navigateTo('lobby');
    });

    // Avatar e Nickname Convidado
    document.getElementById('user-avatar-btn')?.addEventListener('click', () => {
      this.openModal(this.avatarModal);
    });
    document.getElementById('user-nickname')?.addEventListener('change', (e) => {
      const val = e.target.value.trim() || 'Estudante';
      this.nickname = val;
      authManager.updateGuestProfile(val, this.avatarEmoji);
    });

    // Firebase Config Modal
    document.getElementById('btn-firebase-settings')?.addEventListener('click', () => {
      this.openFirebaseConfigModal();
    });
    document.getElementById('btn-save-firebase-cfg')?.addEventListener('click', () => {
      this.saveFirebaseConfigAction();
    });

    this.setupAvatarGrid();
    this.setupBuilderEvents();
    this.setupMobileDrawerEvents();
    this.setupUserProfileModalEvents();
  }

  // --- MENU LATERAL MOBILE (ESTILO QUIZMASTER) ---
  setupMobileDrawerEvents() {
    this.mobileMenuToggleBtn?.addEventListener('click', () => {
      this.openMobileDrawer();
    });

    this.closeMobileDrawerBtn?.addEventListener('click', () => {
      this.closeMobileDrawer();
    });

    this.mobileDrawerBackdrop?.addEventListener('click', () => {
      this.closeMobileDrawer();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.mobileDrawerContainer?.classList.contains('active')) {
        this.closeMobileDrawer();
      }
    });

    this.drawerBrandLogo?.addEventListener('click', () => {
      this.closeMobileDrawer();
      this.navigateTo('lobby');
    });

    this.drawerBuilderBtn?.addEventListener('click', () => {
      this.closeMobileDrawer();
      this.openDeckBuilder();
    });

    this.drawerMyDecksBtn?.addEventListener('click', () => {
      this.closeMobileDrawer();
      this.navigateTo('lobby');
      const decksSec = document.getElementById('deck-list-container');
      decksSec?.scrollIntoView({ behavior: 'smooth' });
    });

    this.drawerRoomsBtn?.addEventListener('click', () => {
      this.closeMobileDrawer();
      this.navigateTo('lobby');
      const roomsSec = document.querySelector('.group-rooms-banner');
      roomsSec?.scrollIntoView({ behavior: 'smooth' });
    });

    this.drawerShareBtn?.addEventListener('click', () => {
      this.closeMobileDrawer();
      this.openDeckShareModal();
    });

    this.drawerThemeBtn?.addEventListener('click', () => {
      const next = themeManager.cycleNextTheme();
      this.updateDrawerThemeLabel(next.name);
      this.showToast(`Tema: ${next.name}`);
    });

    this.drawerSoundBtn?.addEventListener('click', () => {
      const isMuted = soundFx.toggleMute();
      this.updateDrawerSoundLabel(isMuted);
      const btnHeaderMute = document.getElementById('btn-sound-toggle');
      if (btnHeaderMute) {
        btnHeaderMute.innerHTML = isMuted
          ? '<i class="fa-solid fa-volume-xmark"></i>'
          : '<i class="fa-solid fa-volume-high"></i>';
      }
      this.showToast(isMuted ? 'Som desativado' : 'Som ativado');
    });

    this.drawerAuthBtn?.addEventListener('click', async () => {
      const user = authManager.getUser();
      if (user && !user.isGuest) {
        this.closeMobileDrawer();
        this.openModal(this.userProfileModal);
      } else {
        try {
          this.showToast('Conectando com o Google...');
          await authManager.signInWithGoogle();
          this.showToast('Login com Google realizado com sucesso!');
        } catch (err) {
          if (err.code !== 'auth/popup-closed-by-user') {
            alert('Falha no login com Google: ' + err.message);
          }
        }
      }
    });
  }

  openMobileDrawer() {
    this.mobileDrawerContainer?.classList.add('active');
    const currentTheme = themeManager.getCurrentTheme();
    this.updateDrawerThemeLabel(currentTheme ? currentTheme.name : 'Dark Neon');
    this.updateDrawerSoundLabel(soundFx.isMuted);
    soundFx.playClick();
  }

  closeMobileDrawer() {
    this.mobileDrawerContainer?.classList.remove('active');
  }

  updateDrawerThemeLabel(themeInput) {
    if (this.drawerThemeName) {
      const name = (typeof themeInput === 'object' && themeInput) ? themeInput.name : themeInput;
      this.drawerThemeName.textContent = `Tema: ${name || 'Dark Neon'}`;
    }
  }

  updateDrawerSoundLabel(isMuted) {
    if (this.drawerSoundBtn) {
      this.drawerSoundBtn.textContent = isMuted ? 'Mudo' : 'Ligado';
    }
  }

  setupUserProfileModalEvents() {
    document.getElementById('modal-profile-login-btn')?.addEventListener('click', async () => {
      try {
        this.closeModal(this.userProfileModal);
        this.showToast('Conectando com o Google...');
        await authManager.signInWithGoogle();
        this.showToast('Login com Google realizado com sucesso!');
      } catch (err) {
        if (err.code !== 'auth/popup-closed-by-user') {
          alert('Falha no login com Google: ' + err.message);
        }
      }
    });

    document.getElementById('modal-profile-logout-btn')?.addEventListener('click', async () => {
      this.closeModal(this.userProfileModal);
      await authManager.logout();
      this.showToast('Você desconectou da conta Google.');
    });

    document.getElementById('close-user-profile-modal-btn')?.addEventListener('click', () => {
      this.closeModal(this.userProfileModal);
    });

    // Clicar na área de perfil do header desktop abre o modal de perfil
    document.getElementById('google-profile-area')?.addEventListener('click', (e) => {
      if (e.target.closest('#btn-google-logout')) return;
      this.openModal(this.userProfileModal);
    });
  }

  // --- AUTENTICAÇÃO GOOGLE & GUEST ---
  setupAuthListeners() {
    const btnGoogleLogin = document.getElementById('btn-google-login');
    const btnGoogleLogout = document.getElementById('btn-google-logout');

    btnGoogleLogin?.addEventListener('click', async () => {
      try {
        this.showToast('Conectando com o Google...');
        await authManager.signInWithGoogle();
        this.showToast('Login com Google realizado com sucesso!');
      } catch (err) {
        if (err.code !== 'auth/popup-closed-by-user') {
          alert('Erro ao autenticar com Google: ' + err.message);
        }
      }
    });

    btnGoogleLogout?.addEventListener('click', async () => {
      await authManager.logout();
      this.showToast('Você saiu da sua conta Google.');
    });

    authManager.onUserChanged((user) => {
      this.updateAuthUI(user);
    });
  }

  updateAuthUI(user) {
    const avatarEl = document.getElementById('user-avatar-display');
    const nickInput = document.getElementById('user-nickname');
    const googleLoginBtn = document.getElementById('btn-google-login');
    const googleProfileArea = document.getElementById('google-profile-area');
    const googleUserPhoto = document.getElementById('google-user-photo');
    const googleUserName = document.getElementById('google-user-name');

    // Elementos do Drawer
    const drawerUserName = this.drawerUserName;
    const drawerUserStatus = this.drawerUserStatus;
    const drawerUserAvatarText = this.drawerUserAvatarText;
    const drawerUserAvatarImg = this.drawerUserAvatarImg;
    const drawerAuthBtn = this.drawerAuthBtn;

    // Elementos do Modal de Perfil
    const modalProfileName = document.getElementById('modal-profile-name');
    const modalProfileEmail = document.getElementById('modal-profile-email');
    const modalProfileBadge = document.getElementById('modal-profile-badge');
    const modalProfilePhoto = document.getElementById('modal-profile-photo');
    const modalProfileEmoji = document.getElementById('modal-profile-emoji');
    const modalLoginBtn = document.getElementById('modal-profile-login-btn');
    const modalLogoutBtn = document.getElementById('modal-profile-logout-btn');

    if (user.isGuest) {
      if (avatarEl) avatarEl.textContent = user.avatarEmoji || '🎓';
      if (nickInput) {
        nickInput.value = user.displayName;
        nickInput.removeAttribute('disabled');
      }
      googleLoginBtn?.classList.remove('hidden');
      googleProfileArea?.classList.add('hidden');

      // Drawer em modo Convidado
      if (drawerUserName) drawerUserName.textContent = user.displayName || 'Estudante';
      if (drawerUserStatus) drawerUserStatus.textContent = 'Banco Local (GitHub Pages)';
      if (drawerUserAvatarText) {
        drawerUserAvatarText.textContent = user.avatarEmoji || '🎓';
        drawerUserAvatarText.classList.remove('hidden');
      }
      if (drawerUserAvatarImg) drawerUserAvatarImg.classList.add('hidden');
      if (drawerAuthBtn) drawerAuthBtn.textContent = 'Entrar';

      // Modal de Perfil
      if (modalProfileName) modalProfileName.textContent = user.displayName || 'Estudante';
      if (modalProfileEmail) modalProfileEmail.textContent = 'Armazenamento local no navegador';
      if (modalProfileBadge) {
        modalProfileBadge.textContent = 'Modo Convidado';
        modalProfileBadge.style.color = 'var(--text-muted)';
      }
      modalProfilePhoto?.classList.add('hidden');
      modalProfileEmoji?.classList.remove('hidden');
      if (modalProfileEmoji) modalProfileEmoji.textContent = user.avatarEmoji || '🎓';
      modalLoginBtn?.classList.remove('hidden');
      modalLogoutBtn?.classList.add('hidden');
    } else {
      if (avatarEl) {
        avatarEl.innerHTML = user.photoURL
          ? `<img src="${user.photoURL}" alt="User" class="avatar-photo-img">`
          : '⭐';
      }
      if (nickInput) {
        nickInput.value = user.displayName;
        nickInput.setAttribute('disabled', 'true');
      }
      googleLoginBtn?.classList.add('hidden');
      googleProfileArea?.classList.remove('hidden');
      if (googleUserName) googleUserName.textContent = user.displayName;
      if (googleUserPhoto && user.photoURL) googleUserPhoto.src = user.photoURL;

      // Drawer em modo Google
      if (drawerUserName) drawerUserName.textContent = user.displayName;
      if (drawerUserStatus) drawerUserStatus.textContent = user.email || 'Conta Google Conectada';
      if (user.photoURL && drawerUserAvatarImg) {
        drawerUserAvatarImg.src = user.photoURL;
        drawerUserAvatarImg.classList.remove('hidden');
        drawerUserAvatarText?.classList.add('hidden');
      } else {
        if (drawerUserAvatarText) {
          drawerUserAvatarText.textContent = '⭐';
          drawerUserAvatarText.classList.remove('hidden');
        }
        drawerUserAvatarImg?.classList.add('hidden');
      }
      if (drawerAuthBtn) drawerAuthBtn.textContent = 'Perfil';

      // Modal de Perfil
      if (modalProfileName) modalProfileName.textContent = user.displayName;
      if (modalProfileEmail) modalProfileEmail.textContent = user.email || 'Autenticado via Google';
      if (modalProfileBadge) {
        modalProfileBadge.textContent = 'Google Cloud Ativo';
        modalProfileBadge.style.color = 'var(--accent-match)';
      }
      if (user.photoURL && modalProfilePhoto) {
        modalProfilePhoto.src = user.photoURL;
        modalProfilePhoto.classList.remove('hidden');
        modalProfileEmoji?.classList.add('hidden');
      } else {
        modalProfilePhoto?.classList.add('hidden');
        modalProfileEmoji?.classList.remove('hidden');
      }
      modalLoginBtn?.classList.add('hidden');
      modalLogoutBtn?.classList.remove('hidden');
    }
  }

  openFirebaseConfigModal() {
    const cfg = getSavedFirebaseConfig() || {};
    document.getElementById('cfg-api-key').value = cfg.apiKey || '';
    document.getElementById('cfg-auth-domain').value = cfg.authDomain || '';
    document.getElementById('cfg-project-id').value = cfg.projectId || '';
    document.getElementById('cfg-storage-bucket').value = cfg.storageBucket || '';
    document.getElementById('cfg-app-id').value = cfg.appId || '';
    this.openModal(this.firebaseModal);
  }

  saveFirebaseConfigAction() {
    const apiKey = document.getElementById('cfg-api-key').value.trim();
    const authDomain = document.getElementById('cfg-auth-domain').value.trim();
    const projectId = document.getElementById('cfg-project-id').value.trim();
    const storageBucket = document.getElementById('cfg-storage-bucket').value.trim();
    const appId = document.getElementById('cfg-app-id').value.trim();

    if (!apiKey || !projectId) {
      saveFirebaseConfig(null);
      this.showToast('Configuração limpa. Modo Local/Offline ativo.');
    } else {
      saveFirebaseConfig({ apiKey, authDomain, projectId, storageBucket, appId });
      this.showToast('Credenciais salvas com sucesso!');
    }
    this.closeModal(this.firebaseModal);
  }

  // --- NAVEGAÇÃO E RESPONSIVIDADE EXTREMA ---
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
    } else if (screenId === 'game') {
      this.calculateOptimalBoardDimensions();
    }
  }

  setupResponsiveLayout() {
    const handleResize = () => {
      if (this.currentScreen === 'game') {
        this.calculateOptimalBoardDimensions();
      }
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => setTimeout(handleResize, 150));
  }

  calculateOptimalBoardDimensions() {
    if (!this.gameBoard) return;
    const cardsCount = this.gameBoard.children.length;
    if (!cardsCount) return;

    // Calcula altura disponível excluindo navbar, header e HUD
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const isMobile = vw < 600;

    // Em mobile, mantemos 4 colunas para 12 e 16 cartas e 4 colunas para 24 cartas
    let cols = cardsCount === 24 ? (isMobile ? 4 : 6) : 4;
    let rows = Math.ceil(cardsCount / cols);

    const availableHeight = Math.max(300, vh - (isMobile ? 180 : 220));
    const availableWidth = Math.min(880, vw - 24);

    const maxCardByH = Math.floor((availableHeight - (rows * 8)) / rows);
    const maxCardByW = Math.floor((availableWidth - (cols * 8)) / cols);
    const optimalSize = Math.min(maxCardByH, maxCardByW, isMobile ? 85 : 120);

    this.gameBoard.style.setProperty('--card-size', `${Math.max(54, optimalSize)}px`);
  }

  // --- CONTROLES DE AVATAR CONVIDADO ---
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
        authManager.updateGuestProfile(this.nickname, emoji);
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

  // --- SALAS MULTIPLAYER EM GRUPO ---
  async createGroupRoom() {
    const user = authManager.getUser();
    if (!this.selectedDeck) {
      this.selectedDeck = deckManager.getAllDecks()[0];
    }

    const modeInput = document.querySelector('input[name="game-mode"]:checked');
    const diffInput = document.querySelector('input[name="difficulty"]:checked');
    const mode = modeInput ? modeInput.value : 'timed';
    const difficulty = diffInput ? diffInput.value : 'medium';

    try {
      this.showToast('Criando sala ao vivo...');
      const room = await roomManager.createRoom(user, this.selectedDeck, difficulty, mode);
      this.openRoomLobby(room);
    } catch (err) {
      alert('Erro ao criar sala: ' + err.message);
    }
  }

  async confirmJoinByPin() {
    const pinInput = document.getElementById('input-room-pin');
    const pin = pinInput?.value?.trim();
    if (!pin || pin.length < 5) {
      alert('Digite um PIN válido de 6 dígitos.');
      return;
    }

    try {
      this.showToast('Entrando na sala...');
      const user = authManager.getUser();
      const room = await roomManager.joinRoom(pin, user);
      this.closeModal(this.joinRoomModal);
      this.openRoomLobby(room);
    } catch (err) {
      alert(err.message);
    }
  }

  openRoomLobby(room) {
    this.activeRoom = room;
    this.navigateTo('roomLobby');

    // Atualiza PIN e Link
    const pinBadge = document.getElementById('room-pin-display');
    const deckBadge = document.getElementById('room-deck-display');
    if (pinBadge) pinBadge.textContent = room.pin;
    if (deckBadge) deckBadge.textContent = `${room.deckTitle} (${room.difficulty.toUpperCase()})`;

    // Gera QR Code para os alunos escanearem
    const joinUrl = `${window.location.origin}${window.location.pathname}#room=${room.pin}`;
    const qrCanvas = document.getElementById('room-qr-canvas');
    if (qrCanvas) {
      QrCodeEngine.render(qrCanvas, joinUrl, 160);
    }

    // Ouve atualizações em tempo real da sala
    roomManager.onRoomUpdated((updatedRoom) => {
      this.handleRoomUpdate(updatedRoom);
    });
  }

  handleRoomUpdate(room) {
    this.activeRoom = room;

    // Atualiza lista de participantes no lobby
    const playerList = document.getElementById('room-players-list');
    const playersCount = document.getElementById('room-players-count');
    const btnStart = document.getElementById('btn-start-room-game');
    const waitingText = document.getElementById('room-waiting-text');

    if (playersCount) playersCount.textContent = `${room.players.length} participante(s)`;

    if (playerList) {
      playerList.innerHTML = '';
      room.players.forEach(p => {
        const item = document.createElement('div');
        item.className = 'room-player-chip';
        item.innerHTML = `
          <span class="player-chip-avatar">${p.avatarEmoji || '🎓'}</span>
          <span class="player-chip-name">${p.displayName}</span>
          ${p.isHost ? '<span class="host-pill">HOST</span>' : ''}
          ${roomManager.isHost && !p.isHost ? `<button class="btn-kick" title="Remover jogador" data-uid="${p.uid}"><i class="fa-solid fa-xmark"></i></button>` : ''}
        `;

        if (roomManager.isHost && !p.isHost) {
          item.querySelector('.btn-kick')?.addEventListener('click', () => {
            roomManager.kickPlayer(room.pin, p.uid);
          });
        }

        playerList.appendChild(item);
      });
    }

    // Visibilidade dos botões do Host
    if (roomManager.isHost) {
      btnStart?.classList.remove('hidden');
      waitingText?.classList.add('hidden');
    } else {
      btnStart?.classList.add('hidden');
      waitingText?.classList.remove('hidden');
    }

    // Se o Host iniciou o jogo, todos entram na partida sincronizada
    if (room.status === 'active' && this.currentScreen !== 'game') {
      this.startSynchronizedMatch(room);
    }

    // Se a partida foi finalizada por todos, exibe o Pódio Coletivo
    if (room.status === 'finished') {
      this.showGroupPodium(room);
    }
  }

  async startRoomGameAction() {
    if (!this.activeRoom) return;
    this.showToast('Iniciando partida para todos os jogadores...');
    await roomManager.startRoomGame(this.activeRoom.pin);
  }

  startSynchronizedMatch(room) {
    this.gameDeckTitle.textContent = `${room.deckTitle} [SALA ${room.pin}]`;
    const cards = this.gameEngine.start(room.deckData, room.mode, room.difficulty, room.seed);
    this.renderGameBoard(cards);
    this.navigateTo('game');
  }

  handleGameProgress(stats) {
    if (this.activeRoom) {
      const user = authManager.getUser();
      roomManager.updatePlayerScore(this.activeRoom.pin, user.uid, stats);
    }
  }

  showGroupPodium(room) {
    const list = document.getElementById('group-podium-list');
    if (!list) return;

    list.innerHTML = '';
    // Ordena decrescente por pontuação
    const sorted = [...room.players].sort((a, b) => b.score - a.score);

    sorted.forEach((p, idx) => {
      const row = document.createElement('div');
      row.className = `leaderboard-row ${idx < 3 ? `podium-${idx + 1}` : ''}`;
      const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;

      row.innerHTML = `
        <div class="rank-col">${medal}</div>
        <div class="player-col">
          <span class="player-avatar">${p.avatarEmoji || '🎓'}</span>
          <div class="player-details">
            <span class="player-name">${p.displayName}</span>
            <span class="player-deck">${p.moves} jogadas</span>
          </div>
        </div>
        <div class="score-col"><strong>${p.score}</strong> pts</div>
      `;
      list.appendChild(row);
    });

    this.openModal(this.groupPodiumModal);
  }

  copyRoomPinAction() {
    if (!this.activeRoom) return;
    const url = `${window.location.origin}${window.location.pathname}#room=${this.activeRoom.pin}`;
    navigator.clipboard.writeText(url);
    this.showToast('Link da sala copiado! Envie aos seus alunos.');
  }

  leaveCurrentRoom() {
    roomManager.leaveCurrentRoom();
    this.activeRoom = null;
    this.navigateTo('lobby');
  }

  // --- JOGO SOLO ---
  startSoloGame() {
    this.activeRoom = null;
    if (!this.selectedDeck) {
      this.selectedDeck = deckManager.getAllDecks()[0];
    }

    const modeInput = document.querySelector('input[name="game-mode"]:checked');
    this.selectedMode = modeInput ? modeInput.value : 'timed';

    const diffInput = document.querySelector('input[name="difficulty"]:checked');
    this.selectedDifficulty = diffInput ? diffInput.value : 'medium';

    this.gameDeckTitle.textContent = this.selectedDeck.title;

    const cards = this.gameEngine.start(this.selectedDeck, this.selectedMode, this.selectedDifficulty);
    this.renderGameBoard(cards);
    this.navigateTo('game');
  }

  renderGameBoard(cards) {
    this.gameBoard.innerHTML = '';
    this.gameBoard.className = `game-board cards-${cards.length}`;

    cards.forEach((cardData) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'card';
      cardEl.dataset.instanceId = cardData.instanceId;

      let frontHtml = '';
      const visualEmoji = cardData.visual || (cardData.side === 'A' ? '💡' : '✨');

      if (cardData.isIcon && cardData.icon) {
        frontHtml = `
          <div class="card-visual-icon"><i class="${cardData.icon}"></i></div>
          <span class="card-title">${cardData.content}</span>
          ${cardData.subtext ? `<span class="card-subtext">${cardData.subtext}</span>` : ''}
        `;
      } else {
        frontHtml = `
          <div class="card-visual-emoji">${visualEmoji}</div>
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

    this.calculateOptimalBoardDimensions();
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

    const user = authManager.getUser();

    if (result.isVictory) {
      modalBox.className = 'modal-content win';
      modalIcon.className = 'fa-solid fa-trophy';
      modalTitle.textContent = 'Missão Cumprida!';
      modalSubtitle.textContent = `Você dominou os conceitos de ${result.deck.title}!`;

      // Salva no Ranking Local Solo
      leaderboardManager.addScore({
        nickname: user.displayName,
        avatarEmoji: user.avatarEmoji || '🎓',
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
      if (this.activeRoom) {
        // Se estiver em sala multiplayer, exibe o pódio da sala
        this.showGroupPodium(this.activeRoom);
      } else {
        this.openModal(this.gameModal);
      }
    }, 500);
  }

  // --- CONSTRUTOR DE BARALHOS (DECK BUILDER) ---
  openDeckBuilder() {
    this.navigateTo('builder');
    this.renderBuilderPairsList();
  }

  setupBuilderEvents() {
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
    for (let i = 0; i < 6; i++) {
      this.addBuilderPairRow();
    }
  }

  addBuilderPairRow(pairData = null) {
    const list = document.getElementById('builder-pairs-list');
    if (!list) return;

    const visualA = pairData?.cardA?.visual || '💡';
    const visualB = pairData?.cardB?.visual || '✨';

    const row = document.createElement('div');
    row.className = 'builder-pair-row';
    row.innerHTML = `
      <div class="row-inputs">
        <div class="pair-card-editor">
          <input type="text" class="input-visual-a" placeholder="Ícone A" value="${visualA}" title="Emoji ou Ícone para Carta A" maxlength="4">
          <input type="text" class="input-term-a" placeholder="Termo A (ex: H₂O)" value="${pairData?.cardA?.content || ''}">
        </div>
        <div class="pair-card-editor">
          <input type="text" class="input-visual-b" placeholder="Ícone B" value="${visualB}" title="Emoji ou Ícone para Carta B" maxlength="4">
          <input type="text" class="input-term-b" placeholder="Termo B (ex: Água)" value="${pairData?.cardB?.content || ''}">
        </div>
        <input type="text" class="input-curiosity" placeholder="Curiosidade pedagógica explicativa" value="${pairData?.curiosity || ''}">
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
      const visualA = row.querySelector('.input-visual-a')?.value.trim() || '💡';
      const termA = row.querySelector('.input-term-a').value.trim();
      const visualB = row.querySelector('.input-visual-b')?.value.trim() || '✨';
      const termB = row.querySelector('.input-term-b').value.trim();
      const cur = row.querySelector('.input-curiosity').value.trim();

      if (termA && termB) {
        pairs.push({
          id: `custom_pair_${idx}`,
          cardA: { content: termA, subtext: 'Conceito', visual: visualA },
          cardB: { content: termB, subtext: 'Correspondência', visual: visualB },
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

  // --- CHECK URL PAYLOADS (#share=... ou #room=...) ---
  checkUrlPayloads() {
    const hash = window.location.hash;

    // 1. Checa se é entrada em sala (#room=123456)
    if (hash && hash.startsWith('#room=')) {
      const pin = hash.replace('#room=', '').trim();
      setTimeout(async () => {
        try {
          const user = authManager.getUser();
          const room = await roomManager.joinRoom(pin, user);
          this.openRoomLobby(room);
          this.showToast(`Entrou na sala ${pin}!`);
        } catch (err) {
          alert('Erro ao entrar na sala do link: ' + err.message);
        }
      }, 300);
      return;
    }

    // 2. Checa se é baralho compartilhado (#share=...)
    const sharedDeck = ShareManager.parseUrlPayload();
    if (sharedDeck) {
      const confirmed = confirm(
        `Você recebeu o baralho "${sharedDeck.title}" (${sharedDeck.pairs.length} pares) via link compartilhado!\nDeseja jogá-lo agora?`
      );

      if (confirmed) {
        const saved = deckManager.saveDeck(sharedDeck);
        this.selectedDeck = saved;
        this.renderDeckSelector();
        this.startSoloGame();
      }
      ShareManager.clearUrlPayload();
    }
  }

  // --- LEADERBOARD LOCAL ---
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
    setTimeout(() => toast.classList.remove('active'), 2800);
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

// Inicializa a aplicação
document.addEventListener('DOMContentLoaded', () => {
  window.app = new MemoryMasterApp();
  window.app.init();
});
