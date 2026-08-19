import { Component, computed, inject, input, OnInit, output, Output, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';

import { CommonModule } from '@angular/common';
import { AttemptService } from '../../services/attempt.service';
import { DashboardStateService } from '../../services/dashboard-state.service';
import { dashboardSections } from '../constants/constants';
import { AttemptEntryComponent } from './attempt-entry/attempt-entry.component';
import { Attempt } from '../../models/attempt';


@Component({
    selector: 'app-history',
    imports: [CommonModule, MatSidenavModule, MatIconModule, AttemptEntryComponent],
    templateUrl: './history.component.html',
})
export class HistoryComponent implements OnInit {
    attemptService: AttemptService = inject(AttemptService)
    dashboardState: DashboardStateService = inject(DashboardStateService)
    attemptList = signal<Attempt[]>([])
    breadCrumbs: string = ''

    ngOnInit(): void {
        this.dashboardState.setActiveSection(dashboardSections.find(section => section.name == 'Histórico')!);
        this.dashboardState.setBreadCrumbs(this.dashboardState.activeSection().name);
        this.breadCrumbs = this.dashboardState.activeSection.name
        this.attemptService.getAllPaginated(this.currentPage, this.pageSize).then((result) => {
            this.attemptList.set(result.data)
            this.hasMorePages = result.hasNext;
            this.hasPreviousPages = result.hasPrevious;
            this.currentPage = result.page;
        });
    }
    isLoading = input.required<boolean>();

    pageSize = 5;
    currentPage = 1;
    totalPages = computed(() =>
        Math.max(1, Math.ceil(this.attemptList().length / this.pageSize))
    );

    paginatedDiligences = computed(() => {
        const start = (this.currentPage - 1) * this.pageSize;
        return this.attemptList().slice(start, start + this.pageSize);
    });

    hasMorePages?: boolean;
    hasPreviousPages?: boolean;
    onNextPage(): void {
        if (this.hasMorePages) {
            this.currentPage = this.currentPage + 1
            this.fetchAttemptPage()
        }
    }
    onPreviousPage(): void {
        if (this.hasPreviousPages) {
            this.currentPage = this.currentPage - 1
            this.fetchAttemptPage()
        }
    }
    fetchAttemptPage(): void {
        this.attemptService.getAllPaginated(this.currentPage, this.pageSize).then((result) => {
            this.attemptList.set(result.data)
            this.hasMorePages = result.hasNext;
            this.hasPreviousPages = result.hasPrevious;
            this.currentPage = result.page;
        });
    }
}
