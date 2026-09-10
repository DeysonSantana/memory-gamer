/**
 * ==============================================================================
 * MEMORYMASTER - PARSER E GERADOR DE CSV EDUCACIONAL COM SUPORTE A ÍCONES
 * ==============================================================================
 * Permite que professores e instrutores criem e exportem baralhos
 * usando planilhas eletrônicas com textos, emojis e curiosidades.
 */

export class CsvParser {
  /**
   * Converte texto CSV em uma lista de pares de cartas
   * Formato suportado: Termo_A, Visual_A, Termo_B, Visual_B, Curiosidade
   * ou formato clássico: Termo_A, Termo_B, Categoria_Dica, Curiosidade
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

    const firstLine = lines[0];
    const commaCount = (firstLine.match(/,/g) || []).length;
    const semicolonCount = (firstLine.match(/;/g) || []).length;
    const delimiter = semicolonCount > commaCount ? ';' : ',';

    const pairs = [];
    const startIndex = 1;

    for (let i = startIndex; i < lines.length; i++) {
      const row = this.parseRow(lines[i], delimiter);
      if (row.length >= 2) {
        let termA = row[0].trim();
        let visualA = '💡';
        let termB = '';
        let visualB = '✨';
        let curiosity = '';

        if (row.length >= 5) {
          // Formato rico: Termo_A, Visual_A, Termo_B, Visual_B, Curiosidade
          visualA = row[1].trim() || '💡';
          termB = row[2].trim();
          visualB = row[3].trim() || '✨';
          curiosity = row[4].trim() || `${termA} corresponde a ${termB}.`;
        } else if (row.length >= 3) {
          // Formato intermediário: Termo_A, Termo_B, [Dica ou Curiosidade]
          termB = row[1].trim();
          curiosity = row[2].trim() || `${termA} corresponde a ${termB}.`;
        } else {
          termB = row[1].trim();
          curiosity = `${termA} corresponde a ${termB}.`;
        }

        if (termA && termB) {
          pairs.push({
            id: `pair_${Date.now()}_${i}`,
            cardA: { content: termA, subtext: 'Conceito', visual: visualA },
            cardB: { content: termB, subtext: 'Correspondência', visual: visualB },
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

  static exportToCsv(pairs) {
    const header = ['Termo_A', 'Icone_A', 'Termo_B', 'Icone_B', 'Curiosidade_Explicacao'];
    const rows = pairs.map(p => {
      const a = (p.cardA?.content || '').replace(/"/g, '""');
      const va = (p.cardA?.visual || '💡').replace(/"/g, '""');
      const b = (p.cardB?.content || '').replace(/"/g, '""');
      const vb = (p.cardB?.visual || '✨').replace(/"/g, '""');
      const cur = (p.curiosity || '').replace(/"/g, '""');
      return `"${a}","${va}","${b}","${vb}","${cur}"`;
    });

    return [header.join(','), ...rows].join('\r\n');
  }

  static generateTemplate() {
    return [
      'Termo_A,Icone_A,Termo_B,Icone_B,Curiosidade_Explicacao',
      'Mitocôndria,⚡,Respiração Celular,🫁,Organela responsável pela síntese de ATP.',
      'Fotossíntese,☀️,Cloroplasto,🌿,Processo que converte luz solar em energia química.',
      'DNA,🧬,Código Genético,📜,Estrutura em dupla hélice que carrega informações hereditárias.',
      'H2O,💧,Água,🌊,Solvente universal composto por dois hidrogênios e um oxigênio.',
      'NaCl,🧂,Sal de Cozinha,🍳,Composto iônico formado por sódio e cloro.',
      'Brasília,🏛️,Brasil,🇧🇷,Capital federal planejada no planalto central brasileiro.'
    ].join('\r\n');
  }
}
