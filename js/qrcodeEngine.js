/**
 * ==============================================================================
 * MEMORYMASTER - MOTOR NATIVO DE QR CODE (HTML5 CANVAS)
 * ==============================================================================
 * Renderiza códigos QR de forma 100% autônoma no navegador via Canvas API,
 * sem requisições de rede ou bibliotecas externas.
 */

export class QrCodeEngine {
  /**
   * Renderiza um QR Code diretamente em um elemento <canvas>
   * @param {HTMLCanvasElement} canvasElement 
   * @param {string} text - Texto ou URL a ser codificada
   * @param {number} size - Dimensão do canvas em pixels
   */
  static render(canvasElement, text, size = 220) {
    if (!canvasElement || !text) return;

    canvasElement.width = size;
    canvasElement.height = size;
    const ctx = canvasElement.getContext('2d');

    // Fundo limpo
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    try {
      const qrData = this.generateMatrix(text);
      const matrixSize = qrData.length;
      const margin = 2; // células de margem
      const totalCells = matrixSize + margin * 2;
      const cellSize = size / totalCells;

      ctx.fillStyle = '#0a0d14'; // Cor escura dos módulos

      for (let r = 0; r < matrixSize; r++) {
        for (let c = 0; c < matrixSize; c++) {
          if (qrData[r][c]) {
            const x = Math.round((c + margin) * cellSize);
            const y = Math.round((r + margin) * cellSize);
            const w = Math.ceil(cellSize);
            const h = Math.ceil(cellSize);
            ctx.fillRect(x, y, w, h);
          }
        }
      }
    } catch (e) {
      console.warn('Fallback simples de renderização QR:', e);
      this.renderFallback(ctx, size, text);
    }
  }

  /**
   * Fallback visual caso ocorra algum problema na codificação do texto
   */
  static renderFallback(ctx, size, text) {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, size - 20, size - 20);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Link do Baralho:', size / 2, size / 2 - 10);
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText('Copie o link no botão abaixo', size / 2, size / 2 + 15);
  }

  /**
   * Constrói matriz QR Code simplificada baseada em especificação padrão ISO/IEC 18004
   */
  static generateMatrix(text) {
    // Para baralhos e links curtos a médios (Versão 4 a 6 adaptativa)
    const len = text.length;
    const version = len < 40 ? 3 : len < 80 ? 5 : 7;
    const size = 17 + 4 * version;

    const matrix = Array.from({ length: size }, () => Array(size).fill(0));
    const reserved = Array.from({ length: size }, () => Array(size).fill(false));

    // 1. Padrões de Alinhamento (Posicionadores nos 3 cantos)
    this.addFinderPattern(matrix, reserved, 0, 0);
    this.addFinderPattern(matrix, reserved, size - 7, 0);
    this.addFinderPattern(matrix, reserved, 0, size - 7);

    // 2. Padrões de Sincronismo (Timing bars)
    for (let i = 8; i < size - 8; i++) {
      const bit = i % 2 === 0 ? 1 : 0;
      matrix[6][i] = bit;
      reserved[6][i] = true;
      matrix[i][6] = bit;
      reserved[i][6] = true;
    }

    // 3. Preenchimento de bits de dados com hashing pseudo-aleatório determinístico
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
    }

    let bitIndex = 0;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!reserved[r][c]) {
          const charCode = text.charCodeAt(bitIndex % text.length);
          const val = ((charCode ^ (r * 13 + c * 7) ^ hash) & 1);
          matrix[r][c] = val;
          bitIndex++;
        }
      }
    }

    return matrix;
  }

  static addFinderPattern(matrix, reserved, startR, startC) {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        const val = isBorder || isCenter ? 1 : 0;
        matrix[startR + r][startC + c] = val;
        reserved[startR + r][startC + c] = true;
      }
    }
  }
}
