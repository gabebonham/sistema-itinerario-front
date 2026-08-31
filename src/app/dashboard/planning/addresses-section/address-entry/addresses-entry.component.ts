import { DragDropModule } from '@angular/cdk/drag-drop';
import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-addresses-entry',
    imports: [MatIconModule, DragDropModule],
    templateUrl: './addresses-entry.component.html',
})
export class AddressesEntryComponent {

    name = input.required<string>();

    street = input<string | null>(null);
    number = input<string | null>(null);
    neighborhood = input<string | null>(null);
    city = input<string | null>(null);
    state = input<string | null>(null);
    zipCode = input<string | null>(null);
    complement = input<string | null>(null);
    country = input<string | null>(null);

    order = input.required<number>();
    isNew = input.required<boolean>();

    delete = output();

    onDelete(): void {
        this.delete.emit();
    }

    getFormatedAddress(): string {
        const parts: string[] = [];

        if (this.street()) {
            let street = this.street()!;

            if (this.number()) {
                street += `, ${this.number()}`;
            }

            if (this.complement()) {
                street += ` - ${this.complement()}`;
            }

            parts.push(street);
        }

        if (this.neighborhood()) {
            parts.push(this.neighborhood()!);
        }

        const cityState = [
            this.city(),
            this.state()
        ].filter(Boolean).join(' - ');

        if (cityState) {
            parts.push(cityState);
        }

        if (this.zipCode()) {
            parts.push(`CEP: ${this.zipCode()}`);
        }

        return parts.join(', ');
    }
}