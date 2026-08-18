import { DragDropModule } from '@angular/cdk/drag-drop';
import { Component, Input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
@Component({
    selector: 'app-addresses-entry',
    imports: [MatIconModule, DragDropModule],
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
    @Input() isNew!: boolean;
    delete = output<string>();
    onDelete(): void {
        this.delete.emit(this.id);
    }
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
