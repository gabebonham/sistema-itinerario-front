import { Component, inject, input, Input, OnInit, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { DiligencesService } from '../../../../services/diligences.service';
import { Diligence } from '../../../../models/diligence';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
    selector: 'app-notificator-entry',
    standalone: true,
    imports: [MatIconModule, MatSnackBarModule],
    templateUrl: './notificator-entry.component.html',
})
export class NotificatorEntryComponent implements OnInit {
    private snackBar = inject(MatSnackBar);
    id = input.required<string>();
    name = input.required<string>();
    email = input.required<string>();
    createdAt = input.required<Date>();

    delete = output<string>()
    diligences = signal<Diligence[]>([])
    doneCount = signal<number|undefined>(undefined)
    loadingProgress = signal<boolean>(true)

    diligenceService = inject(DiligencesService)
    constructor(private router: Router) { }

    ngOnInit(): void {
        this.fetchNotificatorProgress()
    }

    getDateFormatted(date: Date): string {
        const d = new Date(date);
        return d.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    onDelete() {
        this.delete.emit(this.id())
    }

    fetchNotificatorProgress() {
        this.diligenceService.getProgressByNotificatorId(this.id()).then((result) => {
            if (result.success) {
                const progress = result.data;
                this.diligences.set(progress.ongoingDiligences ?? []);
                this.doneCount.set(progress.doneDiligencesCount)
            } else {
                this.showToast(result.error);
            }
            this.loadingProgress.set(false)
        })
    }
    getDateTimeFormatted(date?: Date | string): string {
        if (!date) return '';

        const d = new Date(date);

        return d.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    showToast(text: string) {
        this.snackBar.open(text, 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
        });
    }
}
