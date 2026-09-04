import { Component, inject, input, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { Attempt } from '../../../models/attempt';
import { Diligence } from '../../../models/diligence';
import { baixarRelatorio, Diligencia, RelatorioIntimacaoData } from '../../../utils/pdf';
import { DebtorService } from '../../../services/debtor.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ShowObservationsModal } from './show-observations-modal/show-observations-modal.component';


@Component({
    selector: 'app-attempt-entry',
    imports: [
        CommonModule,
        MatSnackBarModule,
        MatSidenavModule,
        MatIconModule,
        MatExpansionModule
    ],
    templateUrl: './attempt-entry.component.html',
})
export class AttemptEntryComponent implements OnInit {
    private snackBar = inject(MatSnackBar);
    attempt = input.required<Attempt>()
    lastDiligence?: Diligence
    debtorService = inject(DebtorService)
    constructor(private dialog: MatDialog) {
    }

    openObservationsModal(diligence: Diligence) {
        const ref = this.dialog.open(ShowObservationsModal, {
            width: '650px',
            minWidth: '650px',
            height: '700px',
            data: {
                diligenceId: diligence.id,
                generalObservations: diligence.generalObservations,
                factsObservations: diligence.factsObservations,
                propertyObservations: diligence.propertyObservations,
                plannerObservations: diligence.plannerObservations,
                imageUrls: diligence.imageUrls,
                audioUrl: diligence.audioUrl
            }
        });
        ref.afterClosed().subscribe();
    }
    ngOnInit(): void {
        if (this.attempt().diligences) {
            this.lastDiligence = this.getDiligencesInAscOrder(this.attempt().diligences!).at(-1);
        }
    }

    getDiligencesInAscOrder(diligences: Diligence[]) {
        return [...diligences].sort(
            (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
        );
    }

    exportPdf() {
        this.debtorService.getById(this.attempt().debtorId).then(result => {
            if (result.success) {
                const diligencesInput: Diligencia[] = (this.attempt().diligences ?? []).map(diligence => ({
                    dataHora: this.formatarDataHoraDiligencia(diligence.start),
                    forma: 'Pessoal',
                    porHoraCerta: diligence.porHoraCerta,
                    positiva: this.attempt().status == 'Entregue',
                    tipoNotificacao: diligence.id == this.attempt().lastDiligenceId ? diligence.diligenceOrdinal + " positiva" : diligence.diligenceOrdinal + "negativa",
                    sinteseDosFatos: diligence.factsObservations,
                    observacoesImovel: diligence.propertyObservations,
                    endereco: diligence.address?.name!,
                    observacoes: diligence.generalObservations.join(' | ')
                }))
                console.log('result.data: ', result.data);
                console.log('this.attempt(): ', this.attempt());
                const report: RelatorioIntimacaoData = {
                    nomeIntimado: result.data.name,
                    cpfCnpj: result.data.cpfCnpj,
                    rg: '',
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
    getFormattedDate(date: Date | string | undefined): string {
        if (!date) {
            return '';
        }

        const parsedDate = date instanceof Date
            ? date
            : new Date(date);

        return parsedDate.toLocaleDateString('pt-BR');
    }
    formatarDataHoraDiligencia(date: Date | string | undefined): string {
        if (!date) {
            return '';
        }

        const parsedDate = date instanceof Date
            ? date
            : new Date(date);

        if (isNaN(parsedDate.getTime())) {
            return '';
        }

        const pad = (n: number) => n.toString().padStart(2, '0');

        return `${pad(parsedDate.getDate())}/${pad(parsedDate.getMonth() + 1)}/${parsedDate.getFullYear()} ${pad(
            parsedDate.getHours()
        )}:${pad(parsedDate.getMinutes())}`;
    }
    showToast(text: string) {
        this.snackBar.open(text, 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
        });
    }
    getInitials(name?: string): string {
        if (!name) return '';
        const parts = name.trim().split(/\s+/);
        const first = parts[0]?.[0] ?? '';
        const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
        return (first + last).toUpperCase();
    }
}
