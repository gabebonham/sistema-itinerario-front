import { Component, computed, effect, EventEmitter, inject, Input, input, OnInit, output, Output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DiligenceEntryComponent } from './diligence-entry/diligence-entry.component';
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
export class DiligencesEntriesComponent  {
    private snackBar = inject(MatSnackBar);
    private attemptService = inject(AttemptService);
    isLoading = input.required<boolean>();
    loadingCancel = signal<string | undefined>(undefined)
    diligences = input.required<Diligence[]>();
    localDiligences = signal<Diligence[]>([])

    pageSize = input(5);
    currentPage = input(1);
    totalPages = input.required();
    updateCurrentPage = output<number>();
    @Output() nextPage = new EventEmitter<number>();
    @Output() previousPage = new EventEmitter<number>();

    constructor() {
        effect(() => {

            this.localDiligences.set(this.diligences())
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
            this.nextPage.emit(this.currentPage()+ 1);
        }
    }
    onPreviousPage(): void {
        if (this.hasPreviousPages) {
            this.previousPage.emit(this.currentPage() - 1);
        }
    }

    private isWithinDateRange(
        date: Date | string,
        from: string,
        to: string
    ): boolean {

        if (!from && !to) return true;

        const entryTime = new Date(date).getTime();

        const parseFilterDate = (d: string): number => {
            const [dd, mm, yyyy] = d.split('/').map(Number);

            return new Date(
                yyyy,
                mm - 1,
                dd
            ).getTime();
        };

        if (from && entryTime < parseFilterDate(from)) {
            return false;
        }

        if (to && entryTime > parseFilterDate(to)) {
            return false;
        }

        return true;
    }
    handleCancelAttempt(id: string) {
        this.loadingCancel.set(id)
        this.attemptService.cancelAttempt(id).then(result => {
            if (result.success) {
                this.localDiligences.update(diligences => diligences.filter(diligence => diligence.attemptId != id))
                this.loadingCancel.set(undefined)
            } else {
                this.showToast(result.error)
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