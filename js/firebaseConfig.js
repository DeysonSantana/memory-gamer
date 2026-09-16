/**
 * ==============================================================================
 * MEMORYMASTER - CONFIGURAÇÃO FIREBASE & PERSISTÊNCIA DUAL-MODE
 * ==============================================================================
 * Suporta:
 * 1. Conexão real com Firebase (Auth com Google + Cloud Firestore) via ESM CDN
 * 2. Modo Offline / Simulado (BroadcastChannel + LocalStorage) quando sem chaves
 * 3. Painel de configuração no próprio app para professores inserirem suas credenciais
 */

import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const STORAGE_KEY_CONFIG = 'memorymaster_firebase_config';

// Configuração padrão ou armazenada no navegador
let firebaseApp = null;
let authInstance = null;
let firestoreInstance = null;

export function getSavedFirebaseConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function saveFirebaseConfig(config) {
  if (!config) {
    localStorage.removeItem(STORAGE_KEY_CONFIG);
  } else {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  }
  // Recarrega instâncias
  initFirebase();
}

export function isFirebaseConfigured() {
  const cfg = getSavedFirebaseConfig();
  return !!(cfg && cfg.apiKey && cfg.projectId);
}

export function initFirebase() {
  const config = getSavedFirebaseConfig();

  if (config && config.apiKey && config.projectId) {
    try {
      if (getApps().length === 0) {
        firebaseApp = initializeApp(config);
      } else {
        firebaseApp = getApps()[0];
      }
      authInstance = getAuth(firebaseApp);
      firestoreInstance = getFirestore(firebaseApp);
      console.log('Firebase inicializado com sucesso (Cloud Sync Ativo).');
      return { app: firebaseApp, auth: authInstance, db: firestoreInstance, isLive: true };
    } catch (err) {
      console.warn('Erro ao conectar ao Firebase, ativando fallback local:', err);
    }
  }

  // Modo Simulado / Fallback Local
  return { app: null, auth: null, db: null, isLive: false };
}

// Inicialização imediata
const { auth, db } = initFirebase();
export { auth, db };
