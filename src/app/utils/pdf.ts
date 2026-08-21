import {
  PDFDocument,
  PDFFont,
  PDFPage,
  StandardFonts,
  rgb,
} from 'pdf-lib';

// ============================================================
// Tipos de entrada
// CONTRATO MANTIDO EXATAMENTE COMO JÁ EXISTIA
// ============================================================

export interface Diligencia {
  /** Resultado da diligência: true = positiva ("Sim"), false = negativa ("Não") */
  positiva: boolean;

  /** Ex: "Diligência positiva", "Primeira diligência negativa (primeira tentativa)" */
  tipoNotificacao: string;

  /** Itens da "Síntese dos Fatos", um por bullet */
  sinteseDosFatos: string[];

  /** Observações do imóvel (bullets secundários), opcional */
  observacoesImovel?: string[];

  endereco: string;

  /** Ex: "Pessoal", "Por hora certa" */
  forma: string;

  /** Ex: "17/04/2026 10:28" */
  dataHora: string;

  /** Se foi intimado por hora certa */
  porHoraCerta: boolean;

  /** Campo "Obs." livre, opcional */
  observacoes?: string;
}

export interface RelatorioIntimacaoData {
  nomeIntimado: string;
  cpfCnpj: string;
  rg?: string;
  protocolo: string;
  diligencias: Diligencia[];

  /** Data/hora de impressão exibida no rodapé; default = agora */
  impressoEm?: Date;
}

// ============================================================
// Layout
// ============================================================

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;

const MARGIN_LEFT = 42;
const MARGIN_RIGHT = 42;
const MARGIN_TOP = 42;
const MARGIN_BOTTOM = 42;

const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

const HEADER_TITLE_SIZE = 13;
const NAME_SIZE = 11;
const BODY_SIZE = 9;
const SMALL_SIZE = 8;

const LINE_HEIGHT = 12;
const BULLET_INDENT = 12;

const COLOR_TEXT = rgb(0.08, 0.08, 0.08);
const COLOR_MUTED = rgb(0.28, 0.28, 0.28);
const COLOR_LINE = rgb(0.45, 0.45, 0.45);

// ============================================================
// Função principal
// ============================================================

export async function gerarRelatorioIntimacaoPdf(
  data: RelatorioIntimacaoData
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const ctx = new PdfCursor(
    pdfDoc,
    fontRegular,
    fontBold,
    data
  );

  ctx.newPage();

  // ----------------------------------------------------------
  // Cabeçalho
  // ----------------------------------------------------------

  ctx.drawHeader();

  // ----------------------------------------------------------
  // Dados do intimado
  // ----------------------------------------------------------

  drawDadosIntimado(ctx, data);

  // ----------------------------------------------------------
  // Diligências
  // ----------------------------------------------------------

  data.diligencias.forEach((diligencia, index) => {
    drawDiligencia(
      ctx,
      diligencia,
      index + 1
    );
  });

  // ----------------------------------------------------------
  // Rodapé
  // ----------------------------------------------------------

  const impressoEm = data.impressoEm ?? new Date();

  ctx.finalizeFooters(
    formatarDataHora(impressoEm)
  );

  return pdfDoc.save();
}

// ============================================================
// Dados do intimado
// ============================================================

function drawDadosIntimado(
  ctx: PdfCursor,
  data: RelatorioIntimacaoData
): void {
  ctx.ensureSpace(65);

  // Nome
  ctx.drawUnderlinedText(
    data.nomeIntimado.toUpperCase(),
    {
      font: ctx.fontBold,
      size: NAME_SIZE,
    }
  );

  ctx.advance(17);

  // CPF / CNPJ
  ctx.drawInlineLabelValue(
    'Cpf/Cnpj:',
    data.cpfCnpj
  );

  // RG
  if (data.rg) {
    ctx.drawInlineLabelValue(
      'Rg:',
      data.rg,
      {
        xOffset: 190,
      }
    );
  }

  // Protocolo
  ctx.drawInlineLabelValue(
    'Protocolo:',
    data.protocolo,
    {
      xOffset: data.rg ? 330 : 300,
    }
  );

  ctx.advance(17);
}

// ============================================================
// Diligência
// ============================================================

function drawDiligencia(
  ctx: PdfCursor,
  dil: Diligencia,
  numero: number
): void {
  /*
   * A referência do Dejair não utiliza cards/caixas.
   * Cada diligência é um bloco textual separado por
   * uma linha horizontal.
   */

  ctx.ensureSpace(110);

  // ----------------------------------------------------------
  // Resultado
  // ----------------------------------------------------------

  ctx.drawText(
    dil.positiva ? 'Sim' : 'Não',
    {
      font: ctx.fontBold,
      size: BODY_SIZE,
    }
  );

  ctx.advance(15);

  // ----------------------------------------------------------
  // Notificação
  // ----------------------------------------------------------

  ctx.drawInlineLabelValue(
    'Notificação:',
    dil.tipoNotificacao,
    {
      labelBold: true,
      valueBold: false,
    }
  );

  ctx.advance(14);

  // ----------------------------------------------------------
  // Síntese dos fatos
  // ----------------------------------------------------------

  ctx.drawText(
    'Síntese dos Fatos:',
    {
      font: ctx.fontBold,
      size: BODY_SIZE,
    }
  );

  ctx.advance(13);

  for (const fato of dil.sinteseDosFatos) {
    ctx.drawBullet(fato);
  }

  // ----------------------------------------------------------
  // Observações do imóvel
  // ----------------------------------------------------------

  if (
    dil.observacoesImovel &&
    dil.observacoesImovel.length > 0
  ) {
    ctx.advance(2);

    ctx.drawText(
      'Observações do imóvel:',
      {
        font: ctx.fontBold,
        size: BODY_SIZE,
      }
    );

    ctx.advance(13);

    for (const observacao of dil.observacoesImovel) {
      ctx.drawBullet(observacao);
    }
  }

  ctx.advance(5);

  // ----------------------------------------------------------
  // Linha "Foi intimado / Por hora certa / Forma / Data e hora"
  // ----------------------------------------------------------

  ctx.drawInlineLabelValue(
    'Foi intimado:',
    dil.positiva ? 'Sim' : 'Não',
    {
      labelBold: true,
      valueBold: true,
      xOffset: 0,
    }
  );

  ctx.drawInlineLabelValue(
    'Por hora certa:',
    dil.porHoraCerta ? 'Sim' : 'Não',
    {
      labelBold: true,
      valueBold: true,
      xOffset: 100,
    }
  );

  ctx.drawInlineLabelValue(
    'Forma:',
    dil.forma,
    {
      labelBold: true,
      valueBold: true,
      xOffset: 245,
    }
  );

  ctx.drawInlineLabelValue(
    'Data e hora:',
    dil.dataHora,
    {
      labelBold: true,
      valueBold: true,
      xOffset: 365,
    }
  );

  ctx.advance(15);

  // ----------------------------------------------------------
  // Endereço
  // ----------------------------------------------------------

  ctx.drawUnderlinedLabelValue(
    'Endereço',
    dil.endereco
  );

  ctx.advance(15);

  // ----------------------------------------------------------
  // Observação
  // ----------------------------------------------------------

  if (dil.observacoes?.trim()) {
    ctx.drawInlineLabelValue(
      'Obs.:',
      dil.observacoes,
      {
        labelBold: true,
        valueBold: false,
      }
    );

    ctx.advance(14);
  } else {
    ctx.drawText(
      'Obs.:',
      {
        font: ctx.fontBold,
        size: BODY_SIZE,
      }
    );

    ctx.advance(14);
  }

  // ----------------------------------------------------------
  // Separador da diligência
  // ----------------------------------------------------------

  ctx.advance(4);

  ctx.drawHorizontalRule();

  ctx.advance(13);
}

// ============================================================
// Cursor / paginação
// ============================================================

class PdfCursor {
  private page!: PDFPage;

  private y = 0;

  private pageNumber = 0;

  readonly fontRegular: PDFFont;
  readonly fontBold: PDFFont;

  constructor(
    private pdfDoc: PDFDocument,
    fontRegular: PDFFont,
    fontBold: PDFFont,
    private data: RelatorioIntimacaoData
  ) {
    this.fontRegular = fontRegular;
    this.fontBold = fontBold;
  }

  // ----------------------------------------------------------
  // Página
  // ----------------------------------------------------------

  newPage(): void {
    this.page = this.pdfDoc.addPage([
      PAGE_WIDTH,
      PAGE_HEIGHT,
    ]);

    this.pageNumber++;

    this.y = PAGE_HEIGHT - MARGIN_TOP;
  }

  // ----------------------------------------------------------
  // Cabeçalho
  // ----------------------------------------------------------

  drawHeader(): void {
    this.ensureSpace(35);

    const title = 'Relatório de intimação e diligências';

    const width =
      this.fontBold.widthOfTextAtSize(
        title,
        HEADER_TITLE_SIZE
      );

    const x =
      (PAGE_WIDTH - width) / 2;

    this.page.drawText(title, {
      x,
      y: this.y,
      size: HEADER_TITLE_SIZE,
      font: this.fontBold,
      color: COLOR_TEXT,
    });

    // Sublinhado do título
    this.page.drawLine({
      start: {
        x,
        y: this.y - 2,
      },
      end: {
        x: x + width,
        y: this.y - 2,
      },
      thickness: 0.7,
      color: COLOR_TEXT,
    });

    this.advance(27);
  }

  // ----------------------------------------------------------
  // Espaço
  // ----------------------------------------------------------

  ensureSpace(
    height: number,
    repeatHeader = true
  ): void {
    const minimumY =
      MARGIN_BOTTOM + 25;

    if (this.y - height < minimumY) {
      this.newPage();

      if (repeatHeader) {
        this.drawHeader();
      }
    }
  }

  // ----------------------------------------------------------
  // Cursor
  // ----------------------------------------------------------

  advance(dy: number): void {
    this.y -= dy;
  }

  // ----------------------------------------------------------
  // Texto simples
  // ----------------------------------------------------------

  drawText(
    text: string,
    options: {
      font: PDFFont;
      size: number;
      color?: ReturnType<typeof rgb>;
      x?: number;
    }
  ): void {
    this.ensureSpace(
      options.size + 4,
      false
    );

    this.page.drawText(text, {
      x: options.x ?? MARGIN_LEFT,
      y: this.y,
      size: options.size,
      font: options.font,
      color:
        options.color ?? COLOR_TEXT,
    });
  }

  // ----------------------------------------------------------
  // Texto sublinhado
  // ----------------------------------------------------------

  drawUnderlinedText(
    text: string,
    options: {
      font: PDFFont;
      size: number;
      x?: number;
    }
  ): void {
    const x =
      options.x ?? MARGIN_LEFT;

    const width =
      options.font.widthOfTextAtSize(
        text,
        options.size
      );

    this.page.drawText(text, {
      x,
      y: this.y,
      size: options.size,
      font: options.font,
      color: COLOR_TEXT,
    });

    this.page.drawLine({
      start: {
        x,
        y: this.y - 1.5,
      },
      end: {
        x: x + width,
        y: this.y - 1.5,
      },
      thickness: 0.6,
      color: COLOR_TEXT,
    });
  }

  // ----------------------------------------------------------
  // Label + valor na mesma linha
  // ----------------------------------------------------------

  drawInlineLabelValue(
    label: string,
    value: string,
    options: {
      xOffset?: number;
      labelBold?: boolean;
      valueBold?: boolean;
    } = {}
  ): void {
    const x =
      MARGIN_LEFT +
      (options.xOffset ?? 0);

    const labelBold =
      options.labelBold ?? true;

    const valueBold =
      options.valueBold ?? false;

    const labelFont =
      labelBold
        ? this.fontBold
        : this.fontRegular;

    const valueFont =
      valueBold
        ? this.fontBold
        : this.fontRegular;

    const labelText = `${label} `;

    const labelWidth =
      labelFont.widthOfTextAtSize(
        labelText,
        BODY_SIZE
      );

    const availableWidth =
      PAGE_WIDTH -
      MARGIN_RIGHT -
      x -
      labelWidth;

    const lines = wrapText(
      value,
      valueFont,
      BODY_SIZE,
      Math.max(availableWidth, 50)
    );

    this.ensureSpace(
      lines.length * LINE_HEIGHT,
      false
    );

    this.page.drawText(labelText, {
      x,
      y: this.y,
      size: BODY_SIZE,
      font: labelFont,
      color: COLOR_TEXT,
    });

    lines.forEach((line, index) => {
      this.page.drawText(line, {
        x:
          x +
          labelWidth,
        y:
          this.y -
          index * LINE_HEIGHT,
        size: BODY_SIZE,
        font: valueFont,
        color: COLOR_TEXT,
      });
    });

    this.advance(
      lines.length * LINE_HEIGHT
    );
  }

  // ----------------------------------------------------------
  // Label + valor sublinhados
  // ----------------------------------------------------------

  drawUnderlinedLabelValue(
    label: string,
    value: string
  ): void {
    const labelText = `${label}: `;

    const labelWidth =
      this.fontBold.widthOfTextAtSize(
        labelText,
        BODY_SIZE
      );

    const availableWidth =
      CONTENT_WIDTH -
      labelWidth;

    const lines = wrapText(
      value,
      this.fontBold,
      BODY_SIZE,
      availableWidth
    );

    this.ensureSpace(
      lines.length * LINE_HEIGHT,
      false
    );

    this.page.drawText(
      labelText,
      {
        x: MARGIN_LEFT,
        y: this.y,
        size: BODY_SIZE,
        font: this.fontBold,
        color: COLOR_TEXT,
      }
    );

    // Sublinha o label
    this.page.drawLine({
      start: {
        x: MARGIN_LEFT,
        y: this.y - 1.5,
      },
      end: {
        x:
          MARGIN_LEFT +
          labelWidth,
        y: this.y - 1.5,
      },
      thickness: 0.5,
      color: COLOR_TEXT,
    });

    lines.forEach((line, index) => {
      const lineX =
        MARGIN_LEFT +
        labelWidth;

      this.page.drawText(
        line,
        {
          x: lineX,
          y:
            this.y -
            index * LINE_HEIGHT,
          size: BODY_SIZE,
          font: this.fontBold,
          color: COLOR_TEXT,
        }
      );

      const lineWidth =
        this.fontBold.widthOfTextAtSize(
          line,
          BODY_SIZE
        );

      this.page.drawLine({
        start: {
          x: lineX,
          y:
            this.y -
            index * LINE_HEIGHT -
            1.5,
        },
        end: {
          x:
            lineX +
            lineWidth,
          y:
            this.y -
            index * LINE_HEIGHT -
            1.5,
        },
        thickness: 0.5,
        color: COLOR_TEXT,
      });
    });

    this.advance(
      lines.length * LINE_HEIGHT
    );
  }

  // ----------------------------------------------------------
  // Bullet
  // ----------------------------------------------------------

  drawBullet(text: string): void {
    const availableWidth =
      CONTENT_WIDTH -
      BULLET_INDENT;

    const lines = wrapText(
      text,
      this.fontRegular,
      BODY_SIZE,
      availableWidth
    );

    this.ensureSpace(
      lines.length * LINE_HEIGHT,
      false
    );

    lines.forEach((line, index) => {
      this.page.drawText(
        index === 0
          ? `• ${line}`
          : `  ${line}`,
        {
          x: MARGIN_LEFT + 4,
          y:
            this.y -
            index * LINE_HEIGHT,
          size: BODY_SIZE,
          font: this.fontRegular,
          color: COLOR_TEXT,
        }
      );
    });

    this.advance(
      lines.length * LINE_HEIGHT
    );
  }

  // ----------------------------------------------------------
  // Linha horizontal
  // ----------------------------------------------------------

  drawHorizontalRule(): void {
    this.ensureSpace(
      4,
      false
    );

    this.page.drawLine({
      start: {
        x: MARGIN_LEFT,
        y: this.y,
      },
      end: {
        x:
          PAGE_WIDTH -
          MARGIN_RIGHT,
        y: this.y,
      },
      thickness: 0.65,
      color: COLOR_LINE,
    });
  }

  // ----------------------------------------------------------
  // Rodapé
  // ----------------------------------------------------------

  finalizeFooters(
    impressoEmTexto: string
  ): void {
    const pages =
      this.pdfDoc.getPages();

    const total =
      pages.length;

    pages.forEach(
      (page, index) => {
        const footerY =
          MARGIN_BOTTOM - 12;

        // Linha acima do rodapé
        page.drawLine({
          start: {
            x: MARGIN_LEFT,
            y: footerY + 8,
          },
          end: {
            x:
              PAGE_WIDTH -
              MARGIN_RIGHT,
            y: footerY + 8,
          },
          thickness: 0.4,
          color: COLOR_LINE,
        });

        // Data
        page.drawText(
          `Impresso em ${impressoEmTexto}`,
          {
            x: MARGIN_LEFT,
            y: footerY,
            size: SMALL_SIZE,
            font: this.fontRegular,
            color: COLOR_MUTED,
          }
        );

        // Página
        const pageLabel =
          `Página ${index + 1} de ${total}`;

        const pageLabelWidth =
          this.fontRegular.widthOfTextAtSize(
            pageLabel,
            SMALL_SIZE
          );

        page.drawText(
          pageLabel,
          {
            x:
              PAGE_WIDTH -
              MARGIN_RIGHT -
              pageLabelWidth,
            y: footerY,
            size: SMALL_SIZE,
            font: this.fontRegular,
            color: COLOR_MUTED,
          }
        );
      }
    );
  }
}

// ============================================================
// Helpers
// ============================================================

function wrapText(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number
): string[] {
  if (!text) {
    return [''];
  }

  const words =
    text.trim().split(/\s+/);

  const lines: string[] = [];

  let current = '';

  for (const word of words) {
    const test =
      current.length > 0
        ? `${current} ${word}`
        : word;

    if (
      font.widthOfTextAtSize(
        test,
        size
      ) > maxWidth &&
      current
    ) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines.length
    ? lines
    : [''];
}

function formatarDataHora(
  date: Date
): string {
  const pad = (n: number) =>
    n.toString().padStart(2, '0');

  return `${pad(date.getDate())}/${pad(
    date.getMonth() + 1
  )}/${date.getFullYear()} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}`;
}

// ============================================================
// Download
// ============================================================

export async function baixarRelatorio(
  input: RelatorioIntimacaoData
) {
  const bytes =
    await gerarRelatorioIntimacaoPdf(
      input
    );

  const blob = new Blob(
    [bytes as BlobPart],
    {
      type: 'application/pdf',
    }
  );

  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement('a');

  a.href = url;
  a.download =
    input.nomeIntimado + '.pdf';

  a.click();

  URL.revokeObjectURL(url);
}