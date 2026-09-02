import { Component, computed, effect, EventEmitter, inject, Input, input, OnInit, output, Output, signal } from '@angular/core';
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
export class AttemptsWithNoDiligencesEntries  {
    private snackBar = inject(MatSnackBar);
    private attemptService = inject(AttemptService);
    isLoading = input.required<boolean>();
    loadingCancel = signal<string | undefined>(undefined)
    attempts = input.required<Attempt[]>();
    localAttempts = signal<Attempt[]>([])

    pageSize = input(5);
    currentPage = input(1);
    totalPages = input.required();
    updateCurrentPage = output<number>();

    @Output() nextPage = new EventEmitter<number>();
    @Output() previousPage = new EventEmitter<number>();

    constructor() {
        effect(() => {
            this.localAttempts.set(this.attempts())
        }
        )
    }


    handleUpdateCurrentPage(page: number) {
        this.updateCurrentPage.emit(page);
    }
    @Input() hasMorePages!: boolean;
    @Input() hasPreviousPages!: boolean;

    onNextPage(): void {
        if (this.hasMorePages) {
            this.nextPage.emit(this.currentPage() + 1);
        }
    }
    onPreviousPage(): void {
        if (this.hasPreviousPages) {
            this.previousPage.emit(this.currentPage() - 1);
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
                this.localAttempts.update(attempts=>attempts.filter(attempt => attempt.id != id))
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