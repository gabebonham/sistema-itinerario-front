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

// Indentação do bloco "Síntese dos Fatos" / "Observações do imóvel"
// em relação à margem esquerda (igual ao PDF de referência).
const SINTESE_INDENT = 30;

// Offsets (a partir de MARGIN_LEFT) das colunas das linhas de campos
// "lado a lado", calibrados para bater com o PDF de referência.
const OFFSET_RG = 185;
const OFFSET_PROTOCOLO_COM_RG = 400;
const OFFSET_PROTOCOLO_SEM_RG = 300;

const OFFSET_POR_HORA_CERTA = 85;
const OFFSET_FORMA = 215;
const OFFSET_DATA_HORA = 400;

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

  ctx.advance(20);

  // Cpf/Cnpj, Rg e Protocolo — sempre na MESMA linha (a linha só avança
  // uma vez, depois de todos os campos terem sido desenhados na mesma y).
  const protocoloOffset = data.rg
    ? OFFSET_PROTOCOLO_COM_RG
    : OFFSET_PROTOCOLO_SEM_RG;

  const camposIdentificacao = [
    { label: 'Cpf/Cnpj:', value: data.cpfCnpj, xOffset: 0 },
  ];

  if (data.rg) {
    camposIdentificacao.push({
      label: 'Rg:',
      value: data.rg,
      xOffset: OFFSET_RG,
    });
  }

  camposIdentificacao.push({
    label: 'Protocolo:',
    value: data.protocolo,
    xOffset: protocoloOffset,
  });

  ctx.drawUnderlinedLabelValueRow(camposIdentificacao);

  ctx.advance(18);
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
   * Layout idêntico ao PDF de referência: cada diligência é um bloco
   * textual separado por uma linha horizontal, sem cards/caixas.
   *
   * Ordem:
   *   1) Foi intimado / Por hora certa / Forma / Data e hora (1 linha)
   *   2) Endereço (1 linha, sem quebra)
   *   3) Obs.: Notificação: <tipoNotificacao>  (+ observações livres, se houver)
   *   4) Bloco indentado: "Síntese dos Fatos:" + itens
   *   5) Bloco indentado: "Observações do imóvel:" + itens (se houver)
   *   6) Linha separadora
   */

  ctx.ensureSpace(110);

  // ----------------------------------------------------------
  // Foi intimado / Por hora certa / Forma / Data e hora
  // ----------------------------------------------------------

  ctx.drawUnderlinedLabelValueRow([
    {
      label: 'Foi intimado:',
      value: dil.positiva ? 'Sim' : 'Não',
      xOffset: 0,
    },
    {
      label: 'Por hora certa:',
      value: dil.porHoraCerta ? 'Sim' : 'Não',
      xOffset: OFFSET_POR_HORA_CERTA,
    },
    {
      label: 'Forma:',
      value: dil.forma,
      xOffset: OFFSET_FORMA,
    },
    {
      label: 'Data e hora:',
      value: dil.dataHora,
      xOffset: OFFSET_DATA_HORA,
    },
  ]);

  ctx.advance(15);

  // ----------------------------------------------------------
  // Endereço (linha única, sem quebra — igual à referência)
  // ----------------------------------------------------------

  ctx.drawUnderlinedLabelValueNoWrap(
    'Endereço',
    dil.endereco
  );

  ctx.advance(15);

  // ----------------------------------------------------------
  // Obs.: Notificação: <tipo>  (+ observações livres opcionais)
  // ----------------------------------------------------------

  const valorObs = dil.observacoes?.trim()
    ? `Notificação: ${dil.tipoNotificacao}  —  ${dil.observacoes.trim()}`
    : `Notificação: ${dil.tipoNotificacao}`;

  ctx.drawUnderlinedLabelValueNoWrap(
    'Obs.:',
    valorObs
  );

  ctx.advance(15);

  // ----------------------------------------------------------
  // Síntese dos fatos (bloco indentado)
  // ----------------------------------------------------------

  ctx.drawText(
    'Síntese dos Fatos:',
    {
      font: ctx.fontBold,
      size: BODY_SIZE,
      x: MARGIN_LEFT + SINTESE_INDENT,
    }
  );

  ctx.advance(13);

  for (const fato of dil.sinteseDosFatos) {
    ctx.drawBullet(fato, SINTESE_INDENT);
  }

  // ----------------------------------------------------------
  // Observações do imóvel (bloco indentado, opcional)
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
        x: MARGIN_LEFT + SINTESE_INDENT,
      }
    );

    ctx.advance(13);

    for (const observacao of dil.observacoesImovel) {
      ctx.drawBullet(observacao, SINTESE_INDENT);
    }
  }

  ctx.advance(8);

  // ----------------------------------------------------------
  // Separador da diligência
  // ----------------------------------------------------------

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

    // Título centralizado em negrito, SEM sublinhado no texto
    // (a referência sublinha apenas visualmente por causa da linha
    // de largura total logo abaixo, não do próprio texto).
    this.page.drawText(title, {
      x,
      y: this.y,
      size: HEADER_TITLE_SIZE,
      font: this.fontBold,
      color: COLOR_TEXT,
    });

    // Linha horizontal de largura total, abaixo do título
    // (igual ao PDF de referência).
    this.page.drawLine({
      start: {
        x: MARGIN_LEFT,
        y: this.y - 10,
      },
      end: {
        x: PAGE_WIDTH - MARGIN_RIGHT,
        y: this.y - 10,
      },
      thickness: 0.7,
      color: COLOR_TEXT,
    });

    this.advance(30);
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
  // Linha com um ou mais pares "label sublinhado + valor em negrito",
  // todos desenhados na MESMA altura (y) e com um único advance() no
  // final — é isso que evita o efeito "escada" quando há vários campos
  // lado a lado na mesma linha.
  // ----------------------------------------------------------

  drawUnderlinedLabelValueRow(
    campos: Array<{
      label: string;
      value: string;
      xOffset: number;
    }>
  ): void {
    this.ensureSpace(LINE_HEIGHT, false);

    const y = this.y;

    for (const campo of campos) {
      const x = MARGIN_LEFT + campo.xOffset;

      const labelText = `${campo.label} `;

      const labelWidth =
        this.fontBold.widthOfTextAtSize(
          labelText,
          BODY_SIZE
        );

      // Label em negrito + sublinhado
      this.page.drawText(labelText, {
        x,
        y,
        size: BODY_SIZE,
        font: this.fontBold,
        color: COLOR_TEXT,
      });

      this.page.drawLine({
        start: { x, y: y - 1.5 },
        end: { x: x + labelWidth, y: y - 1.5 },
        thickness: 0.5,
        color: COLOR_TEXT,
      });

      // Valor em negrito, sem sublinhado
      this.page.drawText(campo.value, {
        x: x + labelWidth,
        y,
        size: BODY_SIZE,
        font: this.fontBold,
        color: COLOR_TEXT,
      });
    }

    this.advance(LINE_HEIGHT);
  }

  // ----------------------------------------------------------
  // Label sublinhado + valor em negrito, em linha ÚNICA (sem quebra
  // de texto) — usado em "Endereço" e "Obs.:", igual à referência.
  // ----------------------------------------------------------

  drawUnderlinedLabelValueNoWrap(
    label: string,
    value: string
  ): void {
    this.ensureSpace(LINE_HEIGHT, false);

    const x = MARGIN_LEFT;

    const labelText = `${label} `;

    const labelWidth =
      this.fontBold.widthOfTextAtSize(
        labelText,
        BODY_SIZE
      );

    this.page.drawText(labelText, {
      x,
      y: this.y,
      size: BODY_SIZE,
      font: this.fontBold,
      color: COLOR_TEXT,
    });

    this.page.drawLine({
      start: { x, y: this.y - 1.5 },
      end: { x: x + labelWidth, y: this.y - 1.5 },
      thickness: 0.5,
      color: COLOR_TEXT,
    });

    this.page.drawText(value, {
      x: x + labelWidth,
      y: this.y,
      size: BODY_SIZE,
      font: this.fontBold,
      color: COLOR_TEXT,
    });

    this.advance(LINE_HEIGHT);
  }

  // ----------------------------------------------------------
  // Bullet
  // ----------------------------------------------------------

  drawBullet(text: string, extraIndent = 0): void {
    const indent = BULLET_INDENT + extraIndent;

    const availableWidth =
      CONTENT_WIDTH - indent;

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
          x: MARGIN_LEFT + extraIndent,
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