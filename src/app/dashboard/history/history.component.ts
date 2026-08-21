import { Component, computed, inject, input, OnInit, output, Output, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';

import { CommonModule } from '@angular/common';
import { AttemptService } from '../../services/attempt.service';
import { DashboardStateService } from '../../services/dashboard-state.service';
import { dashboardSections } from '../constants/constants';
import { AttemptEntryComponent } from './attempt-entry/attempt-entry.component';
import { Attempt } from '../../models/attempt';
import { AttemptFilteredSearchComponent } from "./filtered-search/attempts-filtered-search.component";
import { AttemptsFilterService } from '../../services/attempts-filter.service';


@Component({
    selector: 'app-history',
    imports: [CommonModule, MatSidenavModule, MatIconModule, AttemptEntryComponent, AttemptFilteredSearchComponent],
    templateUrl: './history.component.html',
})
export class HistoryComponent implements OnInit {
    attemptService: AttemptService = inject(AttemptService)
    filterService: AttemptsFilterService = inject(AttemptsFilterService)
    dashboardState: DashboardStateService = inject(DashboardStateService)
    attemptList = signal<Attempt[]>([])
    breadCrumbs: string = ''

    ngOnInit(): void {
        this.dashboardState.setActiveSection(dashboardSections.find(section => section.name == 'Histórico')!);
        this.dashboardState.setBreadCrumbs(this.dashboardState.activeSection().name);
        this.breadCrumbs = this.dashboardState.activeSection.name
        this.attemptService.getConcludedPaginated(this.currentPage, this.pageSize).then((result) => {
            this.attemptList.set(result.data)
            this.hasMorePages = result.hasNext;
            this.hasPreviousPages = result.hasPrevious;
            this.currentPage = result.page;
            this.isLoading.set(false)
        });
    }

    isLoading = signal<boolean>(true);

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
        this.isLoading.set(true)
        this.attemptService.getAllPaginated(this.currentPage, this.pageSize).then((result) => {
            this.attemptList.set(result.data)
            this.hasMorePages = result.hasNext;
            this.hasPreviousPages = result.hasPrevious;
            this.currentPage = result.page;
            this.isLoading.set(false)
        });
    }
    filteredAttempts = computed(() => {
        const filter = this.filterService.filter();
        return this.attemptList().filter(attempt => {

            const matchesDebtor =
                !filter.debtor ||
                attempt.debtor?.name
                    .toLowerCase()
                    .includes(filter.debtor.toLowerCase());

            const matchesProtocol =
                !filter.protocol ||
                attempt.protocol
                    .toLowerCase()
                    .includes(filter.protocol.toLowerCase());

            return matchesDebtor && matchesProtocol;
        });
    });
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
