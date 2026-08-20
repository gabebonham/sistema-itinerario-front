import { Component, computed, EventEmitter, inject, Input, input, OnInit, Output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DiligenceEntryComponent } from './diligence-entry/diligence-entry.component';
import { DiligencesFilterService } from '../../../../services/diligences-filter.service';
import { Diligence } from '../../../../models/diligence';

@Component({
    selector: 'app-diligences-entries',
    standalone: true,
    imports: [MatIconModule, DiligenceEntryComponent],
    templateUrl: './diligences-entries.component.html',
})
export class DiligencesEntriesComponent implements OnInit {
    private filterService = inject(DiligencesFilterService);
    // private router = inject(Router);
    // private route = inject(ActivatedRoute);
    isLoading = input.required<boolean>();

    diligences = input.required<Diligence[]>();

    pageSize = 5;
    currentPage = 1;

    @Output() nextPage = new EventEmitter<number>();
    @Output() previousPage = new EventEmitter<number>();
    ngOnInit(): void {
        // const page = Number(this.route.snapshot.queryParamMap.get('page')) || 1;
        // this.currentPage = page;
        // this.onPageChange()

    }
    filteredDiligences = computed(() => {
        const f = this.filterService.filter();
        return this.diligences().filter(entry => {
            const matchesSearch = !f.search || entry.debtorName.toLowerCase().includes(f.search.toLowerCase());
            const matchesWindow = !f.window || entry.window === f.window;
            const matchesDiligence = !f.diligence || entry.diligenceOrdinal === f.diligence;
            const matchesDate = this.isWithinDateRange(entry.start, f.fromDate, f.toDate);
            return matchesSearch && matchesWindow && matchesDiligence && matchesDate;
        });
    });

    totalPages = computed(() =>
        Math.max(1, Math.ceil(this.filteredDiligences().length / this.pageSize))
    );

    paginatedDiligences = computed(() => {
        const start = (this.currentPage - 1) * this.pageSize;
        return this.filteredDiligences().slice(start, start + this.pageSize);
    });

    @Input() hasMorePages!: boolean;
    @Input() hasPreviousPages!: boolean;
    onPageChange() {
        // this.router.navigate([], {
        //     relativeTo: this.route,
        //     queryParams: { page: this.currentPage },
        //     queryParamsHandling: 'merge',
        // });
    }
    onNextPage(): void {
        if (this.hasMorePages) {
            this.nextPage.emit(this.currentPage + 1);
            this.currentPage = this.currentPage + 1
            this.onPageChange()
        }
    }
    onPreviousPage(): void {
        if (this.hasPreviousPages) {
            this.previousPage.emit(this.currentPage - 1);
            this.currentPage = this.currentPage - 1
            this.onPageChange()
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