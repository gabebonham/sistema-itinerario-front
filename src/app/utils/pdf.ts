import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from 'pdf-lib';

// ---------- Tipos de entrada ----------

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

// ---------- Constantes de layout (A4) ----------

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 40;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const FONT_SIZE_TITLE = 14;
const FONT_SIZE_NAME = 12;
const FONT_SIZE_LABEL = 9;
const FONT_SIZE_BODY = 10;
const LINE_HEIGHT = 13;

const COLOR_TEXT = rgb(0.13, 0.13, 0.13);
const COLOR_MUTED = rgb(0.4, 0.4, 0.4);
const COLOR_LINE = rgb(0.75, 0.75, 0.75);
const COLOR_BOX_BG = rgb(0.96, 0.96, 0.96);

// ---------- Função principal ----------

export async function gerarRelatorioIntimacaoPdf(
  data: RelatorioIntimacaoData
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const ctx = new PdfCursor(pdfDoc, fontRegular, fontBold);

  ctx.newPage();

  // Cabeçalho
  ctx.drawText('Relatório de intimação e diligências', {
    font: fontBold,
    size: FONT_SIZE_TITLE,
  });
  ctx.advance(FONT_SIZE_TITLE + 8);

  ctx.drawText(data.nomeIntimado.toUpperCase(), {
    font: fontBold,
    size: FONT_SIZE_NAME,
  });
  ctx.advance(FONT_SIZE_NAME + 6);

  const rgParte = data.rg ? `  Rg: ${data.rg}` : '';
  ctx.drawText(`Cpf/Cnpj: ${data.cpfCnpj}${rgParte}  Protocolo: ${data.protocolo}`, {
    font: fontRegular,
    size: FONT_SIZE_BODY,
    color: COLOR_MUTED,
  });
  ctx.advance(FONT_SIZE_BODY + 8);
  ctx.drawHorizontalRule();
  ctx.advance(10);

  // Diligências
  data.diligencias.forEach((dil, index) => {
    ctx.ensureSpace(90); // reserva espaço mínimo antes de iniciar um novo bloco
    drawDiligencia(ctx, dil, index + 1);
    ctx.advance(14);
  });

  // Rodapé (numeração + data de impressão em todas as páginas)
  const impressoEm = data.impressoEm ?? new Date();
  ctx.finalizeFooters(formatarDataHora(impressoEm));

  return pdfDoc.save();
}

// ---------- Renderização de uma diligência ----------

function drawDiligencia(ctx: PdfCursor, dil: Diligencia, numero: number): void {
  const resultado = dil.positiva ? 'Sim' : 'Não';

  ctx.drawText(`${numero}. ${resultado}`, {
    font: ctx.fontBold,
    size: FONT_SIZE_BODY,
  });
  ctx.advance(LINE_HEIGHT);

  ctx.drawLabelValue('Notificação', dil.tipoNotificacao);
  ctx.advance(4);

  ctx.drawText('Síntese dos Fatos:', { font: ctx.fontBold, size: FONT_SIZE_BODY });
  ctx.advance(LINE_HEIGHT);
  dil.sinteseDosFatos.forEach((linha) => ctx.drawBullet(linha));

  if (dil.observacoesImovel && dil.observacoesImovel.length > 0) {
    ctx.advance(2);
    ctx.drawText('Observações do imóvel:', { font: ctx.fontBold, size: FONT_SIZE_BODY });
    ctx.advance(LINE_HEIGHT);
    dil.observacoesImovel.forEach((linha) => ctx.drawBullet(linha));
  }

  ctx.advance(6);

  // Bloco de campos (endereço em linha cheia + demais campos em duas colunas)
  ctx.drawFieldsBox(
    ['Endereço', dil.endereco],
    [
      ['Forma', dil.forma],
      ['Data e hora', dil.dataHora],
      ['Foi intimado por hora certa', dil.porHoraCerta ? 'Sim' : 'Não'],
      ['Obs.', dil.observacoes ?? '-'],
    ]
  );

  ctx.advance(10);
  ctx.drawHorizontalRule();
}

// ---------- Utilitário de cursor / paginação ----------

class PdfCursor {
  private page!: PDFPage;
  private y = 0;
  private pageNumber = 0;
  readonly fontRegular: PDFFont;
  readonly fontBold: PDFFont;

  constructor(private pdfDoc: PDFDocument, fontRegular: PDFFont, fontBold: PDFFont) {
    this.fontRegular = fontRegular;
    this.fontBold = fontBold;
  }

  newPage(): void {
    this.page = this.pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.pageNumber += 1;
    this.y = PAGE_HEIGHT - MARGIN;
  }

  /** Garante que há espaço suficiente na página atual; senão, cria uma nova. */
  ensureSpace(height: number): void {
    if (this.y - height < MARGIN + 30) {
      this.newPage();
    }
  }

  advance(dy: number): void {
    this.y -= dy;
  }

  drawText(
    text: string,
    opts: { font: PDFFont; size: number; color?: ReturnType<typeof rgb>; x?: number }
  ): void {
    this.ensureSpace(LINE_HEIGHT);
    this.page.drawText(text, {
      x: opts.x ?? MARGIN,
      y: this.y,
      size: opts.size,
      font: opts.font,
      color: opts.color ?? COLOR_TEXT,
    });
  }

  drawLabelValue(label: string, value: string): void {
    const wrapped = wrapText(value, this.fontRegular, FONT_SIZE_BODY, CONTENT_WIDTH - 90);
    this.ensureSpace(LINE_HEIGHT * wrapped.length);
    this.page.drawText(`${label}:`, {
      x: MARGIN,
      y: this.y,
      size: FONT_SIZE_BODY,
      font: this.fontBold,
      color: COLOR_TEXT,
    });
    wrapped.forEach((line, i) => {
      this.page.drawText(line, {
        x: MARGIN + 90,
        y: this.y - i * LINE_HEIGHT,
        size: FONT_SIZE_BODY,
        font: this.fontRegular,
        color: COLOR_TEXT,
      });
    });
    this.y -= LINE_HEIGHT * wrapped.length;
  }

  drawBullet(text: string): void {
    const wrapped = wrapText(text, this.fontRegular, FONT_SIZE_BODY, CONTENT_WIDTH - 16);
    this.ensureSpace(LINE_HEIGHT * wrapped.length);
    wrapped.forEach((line, i) => {
      this.page.drawText(i === 0 ? `•  ${line}` : `   ${line}`, {
        x: MARGIN + 4,
        y: this.y - i * LINE_HEIGHT,
        size: FONT_SIZE_BODY,
        font: this.fontRegular,
        color: COLOR_TEXT,
      });
    });
    this.y -= LINE_HEIGHT * wrapped.length;
  }

  drawHorizontalRule(): void {
    this.ensureSpace(4);
    this.page.drawLine({
      start: { x: MARGIN, y: this.y },
      end: { x: PAGE_WIDTH - MARGIN, y: this.y },
      thickness: 0.75,
      color: COLOR_LINE,
    });
  }

  /**
   * Caixa cinza com: 1) um campo de linha cheia (ex.: Endereço, que pode quebrar
   * em várias linhas) e 2) demais campos dispostos em duas colunas.
   */
  drawFieldsBox(
    fullWidthField: [string, string],
    columnFields: Array<[string, string]>
  ): void {
    const colWidth = CONTENT_WIDTH / 2;
    const padding = 8;

    const [fwLabel, fwValue] = fullWidthField;
    const fwPrefix = `${fwLabel}: `;
    const fwPrefixWidth = this.fontBold.widthOfTextAtSize(fwPrefix, FONT_SIZE_LABEL);
    const fwLines = wrapText(fwValue, this.fontRegular, FONT_SIZE_LABEL, CONTENT_WIDTH - padding * 2 - fwPrefixWidth);

    const columnRows = Math.ceil(columnFields.length / 2);
    const boxHeight = (fwLines.length + columnRows) * LINE_HEIGHT + padding * 2;

    this.ensureSpace(boxHeight);

    this.page.drawRectangle({
      x: MARGIN,
      y: this.y - boxHeight + LINE_HEIGHT,
      width: CONTENT_WIDTH,
      height: boxHeight,
      color: COLOR_BOX_BG,
    });

    let rowY = this.y - padding + LINE_HEIGHT - LINE_HEIGHT;

    // Campo de linha cheia (endereço)
    this.page.drawText(fwPrefix, {
      x: MARGIN + padding,
      y: rowY,
      size: FONT_SIZE_LABEL,
      font: this.fontBold,
      color: COLOR_MUTED,
    });
    fwLines.forEach((line, i) => {
      this.page.drawText(line, {
        x: MARGIN + padding + (i === 0 ? fwPrefixWidth : 0),
        y: rowY - i * LINE_HEIGHT,
        size: FONT_SIZE_LABEL,
        font: this.fontRegular,
        color: COLOR_TEXT,
      });
    });
    rowY -= fwLines.length * LINE_HEIGHT;

    // Demais campos em duas colunas
    for (let i = 0; i < columnFields.length; i += 2) {
      const [label1, value1] = columnFields[i];
      this.drawFieldCell(label1, value1, MARGIN + padding, rowY);

      if (columnFields[i + 1]) {
        const [label2, value2] = columnFields[i + 1];
        this.drawFieldCell(label2, value2, MARGIN + colWidth + padding, rowY);
      }
      rowY -= LINE_HEIGHT;
    }

    this.y -= boxHeight;
  }

  private drawFieldCell(label: string, value: string, x: number, y: number): void {
    this.page.drawText(`${label}: `, {
      x,
      y,
      size: FONT_SIZE_LABEL,
      font: this.fontBold,
      color: COLOR_MUTED,
    });
    const labelWidth = this.fontBold.widthOfTextAtSize(`${label}: `, FONT_SIZE_LABEL);
    this.page.drawText(value, {
      x: x + labelWidth,
      y,
      size: FONT_SIZE_LABEL,
      font: this.fontRegular,
      color: COLOR_TEXT,
    });
  }

  /** Escreve "Página X de Y" em todas as páginas já criadas, mais a data de impressão. */
  finalizeFooters(impressoEmTexto: string): void {
    const pages = this.pdfDoc.getPages();
    const total = pages.length;
    pages.forEach((page:any, i:any) => {
      page.drawText(`Impresso em ${impressoEmTexto}`, {
        x: MARGIN,
        y: MARGIN - 20,
        size: 8,
        font: this.fontRegular,
        color: COLOR_MUTED,
      });
      const label = `Página ${i + 1} de ${total}`;
      const width = this.fontRegular.widthOfTextAtSize(label, 8);
      page.drawText(label, {
        x: PAGE_WIDTH - MARGIN - width,
        y: MARGIN - 20,
        size: 8,
        font: this.fontRegular,
        color: COLOR_MUTED,
      });
    });
  }
}

// ---------- Helpers ----------

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(test, size) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines.length > 0 ? lines : [''];
}

function formatarDataHora(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
export async function baixarRelatorio(input:RelatorioIntimacaoData) {
  const bytes = await gerarRelatorioIntimacaoPdf(input);

  const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'relatorio-intimacao.pdf';
  a.click();

  URL.revokeObjectURL(url);
}