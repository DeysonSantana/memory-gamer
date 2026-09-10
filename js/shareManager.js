/**
 * ==============================================================================
 * MEMORYMASTER - GERENCIADOR DE COMPARTILHAMENTO STATELESS (URL SHARING)
 * ==============================================================================
 * Permite que um professor crie um baralho e gere um link compartilhável
 * que carrega os dados diretamente na URL (Hash payload).
 * Nenhum banco de dados ou servidor intermediário é necessário!
 */

export class ShareManager {
  /**
   * Converte um objeto Deck em uma string compactada e gera a URL compartilhável
   * @param {Object} deck 
   * @returns {string} URL completa com payload
   */
  static generateShareUrl(deck) {
    try {
      const minimalDeck = {
        title: deck.title,
        category: deck.category || 'Geral',
        icon: deck.icon || 'fa-graduation-cap',
        pairs: deck.pairs.map(p => ({
          id: p.id,
          a: p.cardA?.content || '',
          as: p.cardA?.subtext || '',
          b: p.cardB?.content || '',
          bs: p.cardB?.subtext || '',
          c: p.curiosity || ''
        }))
      };

      const jsonString = JSON.stringify(minimalDeck);
      // Codificação UTF-8 segura para Base64
      const encodedData = btoa(encodeURIComponent(jsonString).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode('0x' + p1);
      }));

      const baseUrl = window.location.origin + window.location.pathname;
      return `${baseUrl}#share=${encodedData}`;
    } catch (err) {
      console.error('Erro ao gerar link de compartilhamento:', err);
      return '';
    }
  }

  /**
   * Extrai e reconstrói o baralho a partir do hash da URL atual
   * @returns {Object|null} Deck decodificado ou null se não houver
   */
  static parseUrlPayload() {
    const hash = window.location.hash;
    if (!hash || !hash.startsWith('#share=')) return null;

    try {
      const rawPayload = hash.replace('#share=', '');
      // Decodificação Base64 para UTF-8 segura
      const decodedString = decodeURIComponent(Array.prototype.map.call(atob(rawPayload), (c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const data = JSON.parse(decodedString);
      if (!data || !data.title || !Array.isArray(data.pairs)) return null;

      // Reconstrói no formato oficial
      return {
        id: `shared_${Date.now()}`,
        title: data.title,
        category: data.category || 'Compartilhado',
        icon: data.icon || 'fa-share-nodes',
        isCustom: true,
        pairs: data.pairs.map((p, idx) => ({
          id: p.id || `pair_${idx}`,
          cardA: { content: p.a, subtext: p.as || 'Termo' },
          cardB: { content: p.b, subtext: p.bs || 'Par' },
          curiosity: p.c || `${p.a} corresponde a ${p.b}.`
        }))
      };
    } catch (err) {
      console.warn('Falha ao decodificar baralho da URL:', err);
      return null;
    }
  }

  /**
   * Limpa o hash da URL sem recarregar a página
   */
  static clearUrlPayload() {
    if (window.location.hash.startsWith('#share=')) {
      history.replaceState(null, document.title, window.location.pathname + window.location.search);
    }
  }
}
