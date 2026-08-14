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
    @Input() status!: string;
    @Input() window!: string;
    @Input() agent!: string;
    @Input() date!: Date;
    @Input() visitNumber!: number;
    @Input() attempt!: string;
    @Input() installmentsNumber!: number;
    @Input() contractId!: string;
    constructor(private router: Router) { }


    getDateFormatted(date: Date): string {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
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
        this.router.navigate(['/dashboard/planejamento', id]);
    }
}
