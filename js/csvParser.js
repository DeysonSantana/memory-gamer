/**
 * ==============================================================================
 * MEMORYMASTER - PARSER E GERADOR DE CSV EDUCACIONAL
 * ==============================================================================
 * Permite que professores e instrutores criem e exportem baralhos
 * usando planilhas eletrônicas (Google Sheets, Microsoft Excel, LibreOffice).
 * Suporta separadores por vírgula (,) ou ponto-e-vírgula (;).
 */

export class CsvParser {
  /**
   * Converte texto CSV em uma lista de pares de cartas
   * @param {string} csvText 
   * @returns {{ success: boolean, pairs?: Array, error?: string }}
   */
  static parse(csvText) {
    if (!csvText || typeof csvText !== 'string') {
      return { success: false, error: 'O conteúdo do arquivo CSV está vazio.' };
    }

    const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) {
      return { success: false, error: 'O arquivo CSV precisa ter pelo menos um cabeçalho e um par de cartas.' };
    }

    // Detecta o delimitador (, ou ;)
    const firstLine = lines[0];
    const commaCount = (firstLine.match(/,/g) || []).length;
    const semicolonCount = (firstLine.match(/;/g) || []).length;
    const delimiter = semicolonCount > commaCount ? ';' : ',';

    const pairs = [];
    const startIndex = 1; // Pula a linha do cabeçalho

    for (let i = startIndex; i < lines.length; i++) {
      const row = this.parseRow(lines[i], delimiter);
      if (row.length >= 2) {
        const termA = row[0].trim();
        const termB = row[1].trim();
        const subtextA = (row[2] && row[2].trim()) || 'Conceito';
        const curiosity = (row[3] && row[3].trim()) || `${termA} está diretamente relacionado a ${termB}.`;

        if (termA && termB) {
          pairs.push({
            id: `pair_${Date.now()}_${i}`,
            cardA: { content: termA, subtext: subtextA },
            cardB: { content: termB, subtext: 'Correspondência' },
            curiosity: curiosity
          });
        }
      }
    }

    if (pairs.length < 6) {
      return {
        success: false,
        error: `O baralho possui apenas ${pairs.length} pares válidos. São necessários pelo menos 6 pares para jogar!`
      };
    }

    return { success: true, pairs };
  }

  /**
   * Faz o parse de uma única linha CSV respeitando aspas
   */
  static parseRow(text, delimiter) {
    const pattern = new RegExp(
      `(\\${delimiter}|\\r?\\n|\\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^"\\${delimiter}\\r\\n]*))`,
      'gi'
    );
    const result = [];
    let matches;

    while ((matches = pattern.exec(text))) {
      let matchedValue;
      if (matches[2] !== undefined) {
        matchedValue = matches[2].replace(/""/g, '"');
      } else if (matches[3] !== undefined) {
        matchedValue = matches[3];
      }
      if (matchedValue !== undefined) {
        result.push(matchedValue);
      }
    }
    return result;
  }

  /**
   * Exporta um array de pares para string CSV formatada
   * @param {Array} pairs 
   * @returns {string}
   */
  static exportToCsv(pairs) {
    const header = ['Termo_A', 'Termo_B', 'Categoria_Dica', 'Curiosidade_Explicacao'];
    const rows = pairs.map(p => {
      const a = (p.cardA?.content || '').replace(/"/g, '""');
      const b = (p.cardB?.content || '').replace(/"/g, '""');
      const sub = (p.cardA?.subtext || '').replace(/"/g, '""');
      const cur = (p.curiosity || '').replace(/"/g, '""');
      return `"${a}","${b}","${sub}","${cur}"`;
    });

    return [header.join(','), ...rows].join('\r\n');
  }

  /**
   * Gera um modelo de CSV limpo para download pelo professor
   */
  static generateTemplate() {
    return [
      'Termo_A,Termo_B,Categoria_Dica,Curiosidade_Explicacao',
      'Mitocôndria,Respiração Celular,Biologia,Organela responsável pela síntese de ATP.',
      'Fotossíntese,Cloroplasto,Botânica,Processo que converte luz solar em energia química.',
      'DNA,Código Genético,Genética,Estrutura em dupla hélice que carrega informações hereditárias.',
      'H2O,Água,Química,Solvente universal composto por dois hidrogênios e um oxigênio.',
      'NaCl,Sal de Cozinha,Química,Composto iônico formado por sódio e cloro.',
      'Brasília,Brasil,Geografia,Capital federal planejada no planalto central brasileiro.'
    ].join('\r\n');
  }
}
