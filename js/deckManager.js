/**
 * ==============================================================================
 * MEMORYMASTER - GERENCIADOR DE BARALHOS (CRUD & PERSISTÊNCIA LOCAL)
 * ==============================================================================
 * Unifica os baralhos padrão com os baralhos personalizados criados por professores
 * ou importados via JSON/CSV/URL.
 */

import { DEFAULT_DECKS } from './defaultDecks.js';

class DeckManager {
  constructor() {
    this.storageKey = 'memorymaster_custom_decks';
    this.customDecks = this.loadCustomDecks();
  }

  /**
   * Carrega baralhos customizados do LocalStorage
   */
  loadCustomDecks() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Erro ao ler baralhos do LocalStorage:', e);
      return [];
    }
  }

  /**
   * Salva baralhos customizados no LocalStorage
   */
  saveCustomDecks() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.customDecks));
    } catch (e) {
      console.error('Erro ao salvar baralho no LocalStorage:', e);
    }
  }

  /**
   * Retorna a lista unificada de todos os baralhos disponíveis
   */
  getAllDecks() {
    return [...DEFAULT_DECKS, ...this.customDecks];
  }

  /**
   * Busca um baralho específico por ID
   * @param {string} id 
   */
  getDeckById(id) {
    return this.getAllDecks().find(deck => deck.id === id) || DEFAULT_DECKS[0];
  }

  /**
   * Adiciona ou atualiza um baralho customizado
   * @param {Object} deckData 
   */
  saveDeck(deckData) {
    const existingIndex = this.customDecks.findIndex(d => d.id === deckData.id);

    const deckToSave = {
      ...deckData,
      id: deckData.id || `custom_${Date.now()}`,
      isCustom: true,
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      this.customDecks[existingIndex] = deckToSave;
    } else {
      this.customDecks.push(deckToSave);
    }

    this.saveCustomDecks();
    return deckToSave;
  }

  /**
   * Remove um baralho customizado por ID
   * @param {string} id 
   */
  deleteDeck(id) {
    this.customDecks = this.customDecks.filter(d => d.id !== id);
    this.saveCustomDecks();
  }

  /**
   * Exporta um baralho para arquivo JSON baixável
   * @param {Object} deck 
   */
  exportDeckToJson(deck) {
    const jsonContent = JSON.stringify(deck, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deck_${deck.title.toLowerCase().replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Importa baralho de um arquivo JSON
   * @param {File} file 
   * @returns {Promise<Object>}
   */
  importDeckFromJson(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const deck = JSON.parse(e.target.result);
          if (!deck.title || !Array.isArray(deck.pairs) || deck.pairs.length < 6) {
            reject(new Error('O arquivo JSON não possui estrutura válida ou tem menos de 6 pares.'));
            return;
          }
          const saved = this.saveDeck(deck);
          resolve(saved);
        } catch (err) {
          reject(new Error('Formato JSON inválido.'));
        }
      };
      reader.onerror = () => reject(new Error('Erro ao ler o arquivo selecionado.'));
      reader.readAsText(file);
    });
  }
}

export const deckManager = new DeckManager();
