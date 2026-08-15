import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
@Component({
    selector: 'app-addresses-entry',
    imports: [MatIconModule],
    templateUrl: './addresses-entry.component.html',
})
export class AddressesEntryComponent {
    @Input() id!: string;
    @Input() city!: string;
    @Input() neighborhood!: string;
    @Input() street!: string;
    @Input() number!: string;
    @Input() complement!: string;
    @Input() zipCode!: string;
    @Input() state!: string;
    @Input() country!: string;
    @Input() order!: number;
    getFormatedDate(date: Date): string {
        const d = new Date(date);
        return d.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    }
    getFormatedPlace(): string {
        return `${this.street}, ${this.number} - ${this.neighborhood}, ${this.city} - ${this.state}, ${this.zipCode}`;
    }
}
