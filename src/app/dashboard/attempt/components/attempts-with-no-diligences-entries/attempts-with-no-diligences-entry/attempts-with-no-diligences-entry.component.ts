import { Component, input, Input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';


@Component({
    selector: 'app-attempts-with-no-diligences-entry',
    standalone: true,
    imports: [MatIconModule],
    templateUrl: './attempts-with-no-diligences-entry.component.html',
})
export class AttemptsWithNoDiligencesEntry {
    @Input() name!: string;
    @Input() id!: string;
    @Input() cpfCnpj!: string;
    @Input() visitNumber!: number;
    @Input() protocol!: string;
    cancelAttempt = output<string>()
    loadingCancel = input.required<string|undefined>()
    constructor(private router: Router) { }

    getDateFormatted(date: Date): string {
        const d = new Date(date);
        return d.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour:'2-digit',
            minute:'2-digit'
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
    goToDiligence(id: string): void {
        this.router.navigate(['/dashboard/tentativas', id]);
    }
    onCancelAttempt(attemptId:string) {
        this.cancelAttempt.emit(attemptId)
    }
}
