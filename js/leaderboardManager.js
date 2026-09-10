/**
 * ==============================================================================
 * MEMORYMASTER - GERENCIADOR DE RANKING E PÓDIO LOCAL
 * ==============================================================================
 * Armazena e classifica as melhores partidas por disciplina/baralho,
 * com persistência local (LocalStorage) e visualização de pódio (1º, 2º e 3º lugares).
 */

class LeaderboardManager {
  constructor() {
    this.storageKey = 'memorymaster_leaderboard';
    this.scores = this.loadScores();
  }

  loadScores() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Erro ao ler ranking:', e);
      return [];
    }
  }

  saveScores() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.scores));
    } catch (e) {
      console.error('Erro ao salvar ranking:', e);
    }
  }

  /**
   * Registra uma nova pontuação
   * @param {Object} entry 
   */
  addScore(entry) {
    const record = {
      id: `score_${Date.now()}`,
      nickname: entry.nickname || 'Anônimo',
      avatarEmoji: entry.avatarEmoji || '🎓',
      deckId: entry.deckId,
      deckTitle: entry.deckTitle,
      mode: entry.mode,
      score: entry.score || 0,
      moves: entry.moves || 0,
      timeSeconds: entry.timeSeconds || 0,
      maxStreak: entry.maxStreak || 1,
      createdAt: new Date().toISOString()
    };

    this.scores.push(record);
    // Ordena decrescente por pontuação
    this.scores.sort((a, b) => b.score - a.score);

    // Mantém no máximo os 100 melhores registros
    if (this.scores.length > 100) {
      this.scores = this.scores.slice(0, 100);
    }

    this.saveScores();
    return record;
  }

  /**
   * Retorna os melhores resultados com filtro opcional por baralho
   * @param {string} deckId 
   * @param {number} limit 
   */
  getTopScores(deckId = 'all', limit = 10) {
    let filtered = this.scores;
    if (deckId !== 'all') {
      filtered = filtered.filter(s => s.deckId === deckId);
    }
    return filtered.slice(0, limit);
  }

  /**
   * Limpa o histórico de pontuações
   */
  clear() {
    this.scores = [];
    this.saveScores();
  }
}

export const leaderboardManager = new LeaderboardManager();
