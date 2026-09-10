/**
 * ==============================================================================
 * MEMORYMASTER - GERENCIADOR DE TEMAS VISUAIS
 * ==============================================================================
 * Suporta 5 temas imersivos inspirados no QuizMaster com persistência em LocalStorage:
 * 1. Dark Neon (Padrão)
 * 2. Sunset Gradient
 * 3. Emerald Nature
 * 4. Midnight AMOLED
 * 5. Light Modern
 */

export const THEMES = [
  { id: 'dark-neon', name: 'Dark Neon', icon: 'fa-bolt', desc: 'Ciano e neon com fundo escuro gamer' },
  { id: 'sunset', name: 'Sunset Gradient', icon: 'fa-sun', desc: 'Degradê quente de pôr do sol' },
  { id: 'emerald', name: 'Emerald Nature', icon: 'fa-leaf', desc: 'Verdes bio e estética natural' },
  { id: 'midnight', name: 'Midnight AMOLED', icon: 'fa-moon', desc: 'Preto puro econômico e tons índigo' },
  { id: 'light-modern', name: 'Light Modern', icon: 'fa-lightbulb', desc: 'Visual claro para salas de aula diurnas' }
];

class ThemeManager {
  constructor() {
    this.storageKey = 'memorymaster_theme';
    this.currentTheme = localStorage.getItem(this.storageKey) || 'dark-neon';
  }

  /**
   * Inicializa o tema ao carregar a página
   */
  init() {
    this.applyTheme(this.currentTheme);
  }

  /**
   * Aplica o tema no atributo data-theme do elemento raiz <html>
   * @param {string} themeId 
   */
  applyTheme(themeId) {
    const validTheme = THEMES.some(t => t.id === themeId) ? themeId : 'dark-neon';
    this.currentTheme = validTheme;
    document.documentElement.setAttribute('data-theme', validTheme);
    localStorage.setItem(this.storageKey, validTheme);

    // Dispara evento customizado para ouvintes
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: validTheme } }));
  }

  /**
   * Alterna para o próximo tema da lista
   */
  cycleNextTheme() {
    const currentIndex = THEMES.findIndex(t => t.id === this.currentTheme);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    this.applyTheme(THEMES[nextIndex].id);
    return THEMES[nextIndex];
  }

  getCurrentTheme() {
    return this.currentTheme;
  }
}

export const themeManager = new ThemeManager();
