import { Component, input, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { DiligenceOrdinal } from '../../../../models/diligence';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-notification-entry',
    standalone: true,
    imports: [CommonModule,MatIconModule],
    templateUrl: './notification-entry.component.html',
})
export class NotificationEntryComponent {
    id = input.required<string>();
    notificatorName = input.required<string>();
    diligenceOrdinal = input.required<DiligenceOrdinal>();
    diligenceWindow = input.required<string>();
    diligenceStart = input.required<Date>();
    diligenceFinish = input.required<Date>();
    address = input.required<string>();
    debtorName = input.required<string>();
    protocol = input.required<string>();
    createdAt = input.required<Date>();

    constructor(private router: Router) { }
    isOld(start: Date, window: string): boolean {
        const startDate = new Date(start);
        const now = new Date();

        const isDifferentDay =
            startDate.getFullYear() !== now.getFullYear() ||
            startDate.getMonth() !== now.getMonth() ||
            startDate.getDate() !== now.getDate();

        if (isDifferentDay) {
            return true;
        }

        const currentWindow = now.getHours() < 12
            ? 'Manhã'
            : 'Tarde';

        return window !== currentWindow;
    }
    getDateFormatted(date: Date): string {
        const d = new Date(date);
        return d.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    getHourFormatted(date?: Date): string {
        if (!date) return '';

        const d = new Date(date);
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');

        return `${hours}:${minutes}`;
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
    goToNotification(id: string): void {
        this.router.navigate(['/dashboard/notificacoes', id]);
    }
}
