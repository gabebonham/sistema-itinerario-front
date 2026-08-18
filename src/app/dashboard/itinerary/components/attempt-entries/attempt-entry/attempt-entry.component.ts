import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';


@Component({
    selector: 'app-attempt-entry',
    standalone: true,
    imports: [MatIconModule],
    templateUrl: './attempt-entry.component.html',
})
export class AttemptEntryComponent {
    @Input() name!: string;
    @Input() id!: string;
    @Input() itineraryId!: string;
    @Input() status!: string;
    @Input() window!: string;
    @Input() agentName!: string;
    @Input() start!: Date;
    @Input() finish!: Date;
    @Input() visitNumber!: number;
    @Input() attemptOrdinal!: string;
    @Input() installmentsNumber!: number;
    @Input() protocol!: string;
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
    goToAttempt(id: string): void {
        this.router.navigate(['/dashboard/itinerario', id]);
    }
}
