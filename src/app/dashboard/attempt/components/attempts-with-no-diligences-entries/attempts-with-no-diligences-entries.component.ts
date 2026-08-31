import { Component, computed, effect, EventEmitter, inject, Input, input, OnInit, Output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AttemptService } from '../../../../services/attempt.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Attempt } from '../../../../models/attempt';
import { AttemptsWithNoDiligencesEntry } from './attempts-with-no-diligences-entry/attempts-with-no-diligences-entry.component';

@Component({
    selector: 'app-attempts-with-no-diligences-entries',
    standalone: true,
    imports: [
        MatIconModule,
        MatSnackBarModule,
        AttemptsWithNoDiligencesEntry
    ],
    templateUrl: './attempts-with-no-diligences-entries.component.html',
})
export class AttemptsWithNoDiligencesEntries implements OnInit {
    private snackBar = inject(MatSnackBar);
    private attemptService = inject(AttemptService);
    isLoading = input.required<boolean>();
    loadingCancel = signal<string | undefined>(undefined)
    attempts = input.required<Attempt[]>();
    localAttempts = signal<Attempt[]>([])

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
            this.localAttempts.set(this.attempts())
        }
        )
    }

    totalPages = computed(() =>
        Math.max(1, Math.ceil(this.localAttempts().length / this.pageSize))
    );

    paginatedDiligences = computed(() => {
        const start = (this.currentPage - 1) * this.pageSize;
        return this.localAttempts().slice(start, start + this.pageSize);
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
                this.localAttempts.set(this.localAttempts().filter(attempt => attempt.id != id))
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