/**
 * ==============================================================================
 * MEMORYMASTER - GERENCIADOR OFFLINE-FIRST & PWA
 * ==============================================================================
 * Registra o Service Worker (sw.js), monitora status de conexão
 * e gerencia o prompt de instalação do PWA na tela inicial.
 */

export class OfflineManager {
  constructor() {
    this.deferredInstallPrompt = null;
    this.installButton = null;
    this.statusBadge = null;
  }

  init(installButtonId = 'btn-install-pwa', statusBadgeId = 'offline-badge') {
    this.installButton = document.getElementById(installButtonId);
    this.statusBadge = document.getElementById(statusBadgeId);

    this.registerServiceWorker();
    this.setupInstallPrompt();
    this.setupNetworkListeners();
    this.updateOnlineStatus();
  }

  /**
   * Registra o Service Worker caso suportado pelo navegador
   */
  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then((reg) => {
            console.log('ServiceWorker registrado com sucesso:', reg.scope);
          })
          .catch((err) => {
            console.warn('Falha no registro do ServiceWorker:', err);
          });
      });
    }
  }

  /**
   * Captura evento de instalação PWA para exibir botão customizado
   */
  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredInstallPrompt = e;
      if (this.installButton) {
        this.installButton.classList.remove('hidden');
      }
    });

    if (this.installButton) {
      this.installButton.addEventListener('click', async () => {
        if (!this.deferredInstallPrompt) return;
        this.deferredInstallPrompt.prompt();
        const { outcome } = await this.deferredInstallPrompt.userChoice;
        console.log(`Escolha do usuário PWA: ${outcome}`);
        this.deferredInstallPrompt = null;
        this.installButton.classList.add('hidden');
      });
    }

    window.addEventListener('appinstalled', () => {
      console.log('MemoryMaster instalado com sucesso no dispositivo!');
      if (this.installButton) {
        this.installButton.classList.add('hidden');
      }
    });
  }

  /**
   * Monitora conectividade Online / Offline
   */
  setupNetworkListeners() {
    window.addEventListener('online', () => this.updateOnlineStatus());
    window.addEventListener('offline', () => this.updateOnlineStatus());
  }

  updateOnlineStatus() {
    const isOnline = navigator.onLine;
    if (this.statusBadge) {
      if (isOnline) {
        this.statusBadge.classList.add('hidden');
      } else {
        this.statusBadge.classList.remove('hidden');
        this.statusBadge.innerHTML = '<i class="fa-solid fa-plane"></i> Modo Offline Ativo';
      }
    }
  }
}

export const offlineManager = new OfflineManager();
