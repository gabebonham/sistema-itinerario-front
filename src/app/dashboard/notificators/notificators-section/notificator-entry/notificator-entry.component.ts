import { Component, input, Input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
    selector: 'app-notificator-entry',
    standalone: true,
    imports: [MatIconModule],
    templateUrl: './notificator-entry.component.html',
})
export class NotificatorEntryComponent {
    id = input.required<string>();
    name = input.required<string>();
    email = input.required<string>();
    createdAt = input.required<Date>();

    delete = output<string>()

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
    onDelete() {
        this.delete.emit(this.id())
    }
}
