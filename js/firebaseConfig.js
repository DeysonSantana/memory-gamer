/**
 * ==============================================================================
 * MEMORYMASTER - CONFIGURAÇÃO FIREBASE (DIRETIVAS QUIZMASTER & DUAL-MODE)
 * ==============================================================================
 * Segue a mesma diretiva do QuizMaster:
 * - Configuração padrão global pronta para deploy em GitHub Pages
 * - Suporta Firebase Auth com Google e Firestore Real-Time
 * - Fallback automático gracioso se desconectado
 */

import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const STORAGE_KEY_CONFIG = 'memorymaster_firebase_config';

// Configuração padrão oficial (mesmas credenciais e projeto do QuizMaster para GitHub Pages)
export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyCqGd42xeen1HGc4PpgBa8sH1nhOi17ylM",
  authDomain: "quizmaster-f9388.firebaseapp.com",
  projectId: "quizmaster-f9388",
  storageBucket: "quizmaster-f9388.firebasestorage.app",
  messagingSenderId: "169092133424",
  appId: "1:169092133424:web:019d8ef6e122468864f3f5",
  measurementId: "G-XEPBYW3SVY"
};

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

export function getEffectiveFirebaseConfig() {
  return getSavedFirebaseConfig() || DEFAULT_FIREBASE_CONFIG;
}

export function saveFirebaseConfig(config) {
  if (!config) {
    localStorage.removeItem(STORAGE_KEY_CONFIG);
  } else {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  }
  return initFirebase();
}

export function isFirebaseConfigured() {
  const cfg = getEffectiveFirebaseConfig();
  return !!(cfg && cfg.apiKey && cfg.projectId);
}

export function initFirebase() {
  const config = getEffectiveFirebaseConfig();

  if (config && config.apiKey && config.projectId) {
    try {
      if (getApps().length === 0) {
        firebaseApp = initializeApp(config);
      } else {
        firebaseApp = getApps()[0];
      }
      authInstance = getAuth(firebaseApp);
      firestoreInstance = getFirestore(firebaseApp);
      console.log('[Firebase] Conectado com sucesso com as diretivas do QuizMaster (Nuvem Ativa).');
      return { app: firebaseApp, auth: authInstance, db: firestoreInstance, isLive: true };
    } catch (err) {
      console.warn('[Firebase] Aviso de conexão, mantendo fallback:', err);
      return { app: null, auth: null, db: null, isLive: false };
    }
  }

  return { app: null, auth: null, db: null, isLive: false };
}

// Inicialização imediata
const { auth, db } = initFirebase();
export { auth, db };
