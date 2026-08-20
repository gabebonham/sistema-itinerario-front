import { Component, inject, input, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { Attempt, AttemptStatus } from '../../../models/attempt';
import { Diligence } from '../../../models/diligence';
import { baixarRelatorio, Diligencia, RelatorioIntimacaoData } from '../../../utils/pdf';
import { DebtorService } from '../../../services/debtor.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ExportPdfModal } from './export-pdf-modal/export-pdf-modal.component';


@Component({
    selector: 'app-attempt-entry',
    imports: [CommonModule,
        MatSnackBarModule,
        MatSidenavModule, MatIconModule, MatExpansionModule],
    templateUrl: './attempt-entry.component.html',
})
export class AttemptEntryComponent implements OnInit {
    private snackBar = inject(MatSnackBar);
    attempt = input.required<Attempt>()
    lastDiligence?: Diligence
    debtorService = inject(DebtorService)
    constructor(private dialog: MatDialog) {
    }

    openModal() {
        const ref = this.dialog.open(ExportPdfModal, {
            width: '1200px',
            height: '500px',
        });
        ref.afterClosed().subscribe(result => this.exportPdf(result.observation));
    }
    ngOnInit(): void {
        if (this.attempt().diligences) {
            this.lastDiligence = this.getDiligencesInAscOrder(this.attempt().diligences!).at(-1);
        }
    }

    getDiligencesInAscOrder(diligences: Diligence[]) {
        return [...diligences].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }
    exportPdf(observations: string) {
        this.debtorService.getById(this.attempt().debtorId).then(result => {
            if (result.success) {
                const diligencesInput: Diligencia[] = (this.attempt().diligences ?? []).map(diligence => ({
                    dataHora: this.formatarDataHoraDiligencia(diligence.start),
                    forma: 'Pessoal',
                    porHoraCerta: diligence.porHoraCerta,
                    positiva: this.attempt().status == 'Entregue',
                    tipoNotificacao: diligence.id == this.attempt().lastDiligenceId ? diligence.diligenceOrdinal + "positiva" : diligence.diligenceOrdinal + "negativa",
                    sinteseDosFatos: diligence.factsObservations,
                    observacoesImovel: diligence.propertyObservations,
                    endereco: diligence.address?.name!,
                    observacoes: observations
                }))
                const report: RelatorioIntimacaoData = {
                    nomeIntimado: result.data.name,
                    cpfCnpj: result.data.cpfCnpj,
                    rg: result.data.rg,
                    diligencias: diligencesInput,
                    protocolo: this.attempt().protocol,
                    impressoEm: new Date(),
                }
                baixarRelatorio(report)
            } else {
                this.showToast("Erro ao buscar devedor.")
            }
        })

    }
    formatarDataHoraDiligencia(date: Date): string {
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(
            date.getHours()
        )}:${pad(date.getMinutes())}`;
    }
    showToast(text: string) {
        this.snackBar.open(text, 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
        });
    }
}
