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

class AuthManager {
  constructor() {
    this.currentUser = null;
    this.isGoogleUser = false;
    this.listeners = [];

    // Carrega perfil convidado inicial
    this.guestProfile = {
      uid: 'guest_' + (localStorage.getItem('memorymaster_guest_id') || this.generateGuestId()),
      displayName: localStorage.getItem('memorymaster_nickname') || 'Estudante',
      photoURL: null,
      avatarEmoji: localStorage.getItem('memorymaster_avatar') || '🎓',
      isGuest: true
    };

    this.initAuth();
  }

  generateGuestId() {
    const id = Math.random().toString(36).substring(2, 9);
    localStorage.setItem('memorymaster_guest_id', id);
    return id;
  }

  initAuth() {
    if (auth && isFirebaseConfigured()) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.currentUser = {
            uid: user.uid,
            displayName: user.displayName || 'Jogador Google',
            email: user.email,
            photoURL: user.photoURL,
            avatarEmoji: '⭐',
            isGuest: false
          };
          this.isGoogleUser = true;
        } else {
          this.currentUser = this.guestProfile;
          this.isGoogleUser = false;
        }
        this.notifyListeners();
      });
    } else {
      this.currentUser = this.guestProfile;
      this.isGoogleUser = false;
      this.notifyListeners();
    }
  }

  /**
   * Realiza login com Google via Firebase
   */
  async signInWithGoogle() {
    if (!auth || !isFirebaseConfigured()) {
      throw new Error('As credenciais do Firebase ainda não foram configuradas. Clique em "Configurar Firebase" para inserir as chaves da sua turma.');
    }

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error('Falha no login com Google:', error);
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
