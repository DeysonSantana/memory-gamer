/**
 * ==============================================================================
 * MEMORYMASTER - GERENCIADOR DE AUTENTICAÇÃO (GOOGLE & GUEST DUAL-MODE)
 * ==============================================================================
 * Permite:
 * 1. Login com conta do Google via Firebase Auth
 * 2. Modo Convidado com Avatar Emoji e Nickname (Zero Fricção)
 * 3. Sincronização e persistência de perfil
 */

import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { auth, isFirebaseConfigured } from './firebaseConfig.js';

const STORAGE_SESSION_USER = 'memorymaster_session_user';

class AuthManager {
  constructor() {
    this.currentUser = this.loadSessionUser();
    this.isGoogleUser = !!(this.currentUser && !this.currentUser.isGuest);
    this.listeners = [];

    // Perfil convidado padrão
    this.guestProfile = {
      uid: 'guest_' + (localStorage.getItem('memorymaster_guest_id') || this.generateGuestId()),
      displayName: localStorage.getItem('memorymaster_nickname') || 'Estudante',
      email: '',
      photoURL: null,
      avatarEmoji: localStorage.getItem('memorymaster_avatar') || '🎓',
      isGuest: true
    };

    if (!this.currentUser) {
      this.currentUser = this.guestProfile;
    }

    this.initAuth();
  }

  loadSessionUser() {
    try {
      const data = localStorage.getItem(STORAGE_SESSION_USER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  saveSessionUser(user) {
    if (user && !user.isGuest) {
      localStorage.setItem(STORAGE_SESSION_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_SESSION_USER);
    }
  }

  generateGuestId() {
    const id = Math.random().toString(36).substring(2, 9);
    localStorage.setItem('memorymaster_guest_id', id);
    return id;
  }

  initAuth() {
    if (auth) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.currentUser = {
            uid: user.uid,
            displayName: user.displayName || user.email?.split('@')[0] || 'Jogador Google',
            email: user.email || '',
            photoURL: user.photoURL || null,
            avatarEmoji: '⭐',
            isGuest: false
          };
          this.isGoogleUser = true;
          this.saveSessionUser(this.currentUser);
        } else {
          this.currentUser = this.guestProfile;
          this.isGoogleUser = false;
          this.saveSessionUser(null);
        }
        this.notifyListeners();
      });
    } else {
      this.notifyListeners();
    }
  }

  /**
   * Realiza login com Google via Firebase
   */
  async signInWithGoogle() {
    let activeAuth = auth;
    if (!activeAuth) {
      const { initFirebase } = await import('./firebaseConfig.js');
      const fb = initFirebase();
      activeAuth = fb.auth;
    }

    if (!activeAuth) {
      throw new Error('Não foi possível inicializar a autenticação do Google.');
    }

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const result = await signInWithPopup(activeAuth, provider);
      return result.user;
    } catch (error) {
      if (error.code !== 'auth/popup-closed-by-user') {
        console.error('Falha no login com Google:', error);
      }
      throw error;
    }
  }

  /**
   * Realiza logout do Google e retorna ao modo convidado
   */
  async logout() {
    if (auth && this.isGoogleUser) {
      await signOut(auth);
    }
    this.currentUser = this.guestProfile;
    this.isGoogleUser = false;
    this.notifyListeners();
  }

  /**
   * Atualiza dados de convidado (nickname e avatar emoji)
   */
  updateGuestProfile(nickname, emoji) {
    if (nickname) {
      this.guestProfile.displayName = nickname;
      localStorage.setItem('memorymaster_nickname', nickname);
    }
    if (emoji) {
      this.guestProfile.avatarEmoji = emoji;
      localStorage.setItem('memorymaster_avatar', emoji);
    }

    if (!this.isGoogleUser) {
      this.currentUser = { ...this.guestProfile };
      this.notifyListeners();
    }
  }

  getUser() {
    return this.currentUser || this.guestProfile;
  }

  onUserChanged(callback) {
    this.listeners.push(callback);
    callback(this.getUser());
  }

  notifyListeners() {
    const user = this.getUser();
    this.listeners.forEach(cb => cb(user));
  }
}

export const authManager = new AuthManager();
