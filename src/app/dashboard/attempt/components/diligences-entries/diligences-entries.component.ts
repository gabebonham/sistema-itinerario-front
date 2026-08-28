import { Component, computed, effect, EventEmitter, inject, Input, input, OnInit, Output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DiligenceEntryComponent } from './diligence-entry/diligence-entry.component';
import { AttemptsFilterService } from '../../../../services/attempts-filter.service';
import { Diligence } from '../../../../models/diligence';
import { AttemptService } from '../../../../services/attempt.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
    selector: 'app-diligences-entries',
    standalone: true,
    imports: [
        MatIconModule,
        MatSnackBarModule,
        DiligenceEntryComponent
    ],
    templateUrl: './diligences-entries.component.html',
})
export class DiligencesEntriesComponent implements OnInit {
    private snackBar = inject(MatSnackBar);
    private filterService = inject(AttemptsFilterService);
    private attemptService = inject(AttemptService);
    // private router = inject(Router);
    // private route = inject(ActivatedRoute);
    isLoading = input.required<boolean>();
    loadingCancel = signal<string | undefined>(undefined)
    diligences = input.required<Diligence[]>();
    localDiligences = signal<Diligence[]>([])
    pageSize = 5;
    currentPage = 1;

    @Output() nextPage = new EventEmitter<number>();
    @Output() previousPage = new EventEmitter<number>();
    ngOnInit(): void {
        // const page = Number(this.route.snapshot.queryParamMap.get('page')) || 1;
        // this.currentPage = page;
        // this.onPageChange()

    }
    constructor() {
        effect(() => {

            this.localDiligences.set(this.diligences())
        }
        )
    }
    filteredDiligences = computed(() => {
        const filter = this.filterService.filter();

        return this.diligences().filter(diligence => {

            const matchesDebtor =
                !filter.debtorName ||
                diligence.debtorName
                    .toLowerCase()
                    .includes(filter.debtorName.toLowerCase());

            const matchesProtocol =
                !filter.protocol ||
                diligence.protocol
                    .toLowerCase()
                    .includes(filter.protocol.toLowerCase());
            const matchesDate = this.isWithinDateRange(
                diligence.createdAt,
                filter.from,
                filter.to
            );

            return matchesDebtor && matchesProtocol && matchesDate;
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
    handleCancelAttempt(id: string) {
        this.loadingCancel.set(id)
        this.attemptService.cancelAttempt(id).then(result => {
            if (result.success) {
                this.localDiligences.set(this.localDiligences().filter(diligence => diligence.attemptId != id))
                this.loadingCancel.set(undefined)
            } else {
                this.showToast("Erro ao cancelar tentativa.")
            }
        })
    }
    showToast(text: string) {
        this.snackBar.open(text, 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
        });
    }
}