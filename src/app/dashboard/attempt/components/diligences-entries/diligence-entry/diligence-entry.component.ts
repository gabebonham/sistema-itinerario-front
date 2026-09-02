import { NgClass } from '@angular/common';
import { Component, inject, input, Input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


@Component({
    selector: 'app-diligence-entry',
    standalone: true,
    imports: [NgClass, MatIconModule, MatSnackBarModule],
    templateUrl: './diligence-entry.component.html',
})
export class DiligenceEntryComponent {
    private snackBar = inject(MatSnackBar);
    @Input() name!: string;
    @Input() id!: string;
    @Input() attemptId!: string;
    @Input() window!: string;
    @Input() notificatorName!: string;
    @Input() start!: Date;
    @Input() finish!: Date;
    @Input() visitNumber!: number;
    @Input() diligenceOrdinal!: string;
    @Input() protocol!: string;
    cancelAttempt = output<string>()
    loadingCancel = input.required<string | undefined>()
    visited = input.required<boolean>()
    constructor(private router: Router) { }

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
    getWindowIcon(window: string): string {
        switch (window) {
            case 'Manhã':
                return 'wb_sunny';
            case 'Tarde':
                return 'nights_stay';
            case 'Sabado':
                return 'schedule';
            default:
                return 'help_outline';
        }
    }
    goToAttempt(id: string): void {
        if (this.visited()) {
            this.router.navigate(['/dashboard/tentativas', id]);

        } else {
            this.showToast("Só é possível retomar uma tentativa cuja última diligência tenha sido concluída.")
        }
    }
    onCancelAttempt(attemptId: string) {
        this.cancelAttempt.emit(attemptId)
    }
    showToast(text: string) {
        this.snackBar.open(text, 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
        });
    }
}
