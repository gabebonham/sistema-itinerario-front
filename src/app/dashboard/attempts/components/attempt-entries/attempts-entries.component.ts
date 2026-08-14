import { Component, computed, EventEmitter, inject, Input, input, Output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AttemptEntryComponent } from './attempt-entry/attempt-entry.component';
import { AttemptsFilterService } from '../../../../services/attempts-filter.service';
import { Attempt } from '../../../../models/attempt';

@Component({
    selector: 'app-attempts-entries',
    standalone: true,
    imports: [MatIconModule, AttemptEntryComponent],
    templateUrl: './attempts-entries.component.html',
})
export class AttemptsEntriesComponent {
    private filterService = inject(AttemptsFilterService);
    attempts = input.required<Attempt[]>();

    pageSize = 5;
    currentPage = 1;

    @Output() nextPage = new EventEmitter<number>();
    @Output() previousPage = new EventEmitter<number>();

    filteredAttempts = computed(() => {
        const f = this.filterService.filter();
        return this.attempts().filter(entry => {
            const matchesSearch = !f.search || entry.clientName.toLowerCase().includes(f.search.toLowerCase());
            const matchesStatus = !f.status || entry.status === f.status;
            const matchesWindow = !f.window || entry.window === f.window;
            const matchesAttempt = !f.attempt || entry.attempt === f.attempt;
            const matchesDate = this.isWithinDateRange(entry.date, f.fromDate, f.toDate);
            return matchesSearch && matchesStatus && matchesWindow && matchesAttempt && matchesDate;
        });
    });

    totalPages = computed(() =>
        Math.max(1, Math.ceil(this.filteredAttempts().length / this.pageSize))
    );

    paginatedAttempts = computed(() => {
        const start = (this.currentPage - 1) * this.pageSize;
        return this.filteredAttempts().slice(start, start + this.pageSize);
    });

    @Input() hasMorePages!: boolean;
    @Input() hasPreviousPages!: boolean;

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

    private isWithinDateRange(date: Date, from: string, to: string): boolean {
        if (!from && !to) return true;
        const parseFilterDate = (d: string): number => {
            const [dd, mm, yyyy] = d.split('/').map(Number);
            return new Date(yyyy, mm - 1, dd).getTime();
        };
        const entryTime = date.getTime();
        if (from && entryTime < parseFilterDate(from)) return false;
        if (to && entryTime > parseFilterDate(to)) return false;
        return true;
    }
}