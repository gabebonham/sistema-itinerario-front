import { Component, computed, effect, EventEmitter, inject, Input, input, model, OnInit, Output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../models/user';
import { NotificatorEntryComponent } from './notificator-entry/notificator-entry.component';

@Component({
    selector: 'app-notificators-section',
    standalone: true,
    imports: [MatIconModule, NotificatorEntryComponent],
    templateUrl: './notificators-section.component.html',
})
export class NotificatorsSection {
    isLoading = input.required<boolean>();

    notificators = input.required<User[]>();
    notificatorEntries = signal<User[]>([])
    pageSize = 4;
    currentPage = 1;

    @Output() nextPage = new EventEmitter<number>();
    @Output() previousPage = new EventEmitter<number>();

    totalPages = computed(() =>
        Math.max(1, Math.ceil(this.notificators().length / this.pageSize))
    );

    paginatedDiligences = computed(() => {
        const start = (this.currentPage - 1) * this.pageSize;
        return this.notificators().slice(start, start + this.pageSize);
    });

    @Input() hasMorePages!: boolean;
    @Input() hasPreviousPages!: boolean;

    constructor() {
        effect(()=>{
            this.notificatorEntries.set(this.notificators())
        })
    }
    onNextPage(): void {
        if (this.hasMorePages) {
            this.nextPage.emit(this.currentPage + 1);
            this.currentPage = this.currentPage + 1
        }
    }
    onPreviousPage(): void {
        if (this.hasPreviousPages) {
            this.previousPage.emit(this.currentPage - 1);
            this.currentPage = this.currentPage - 1
        }
    }
    deleteNotificator(id: string) {
        this.notificatorEntries.set(this.notificatorEntries().filter(notificator => notificator.id != id))
    }
}