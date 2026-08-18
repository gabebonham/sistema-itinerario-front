import { Component, computed, inject, input, OnInit, output, Output, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';

import { CommonModule } from '@angular/common';
import { ItineraryService } from '../../services/itinerary.service';
import { Itinerary } from '../../models/itinerary';
import { ItineraryEntryComponent } from './itinerary-entry/itinerary-entry.component';
import { DashboardStateService } from '../../services/dashboard-state.service';
import { dashboardSections } from '../constants/constants';


@Component({
    selector: 'app-history',
    imports: [CommonModule, MatSidenavModule, MatIconModule, ItineraryEntryComponent],
    templateUrl: './history.component.html',
})
export class HistoryComponent implements OnInit {
    itineraryService: ItineraryService = inject(ItineraryService)
    dashboardState: DashboardStateService = inject(DashboardStateService)
    itineraryList = signal<Itinerary[]>([])
    breadCrumbs: string = ''

    ngOnInit(): void {
        this.dashboardState.setActiveSection(dashboardSections.find(section => section.name == 'Histórico')!);
        this.dashboardState.setBreadCrumbs(this.dashboardState.activeSection().name);
        this.breadCrumbs = this.dashboardState.activeSection.name
        this.itineraryService.getAllPaginated(this.currentPage, this.pageSize).then((result) => {
            this.itineraryList.set(result.data)
            this.hasMorePages = result.hasNext;
            this.hasPreviousPages = result.hasPrevious;
            this.currentPage = result.page;
        });
    }
    isLoading = input.required<boolean>();

    pageSize = 5;
    currentPage = 1;
    totalPages = computed(() =>
        Math.max(1, Math.ceil(this.itineraryList().length / this.pageSize))
    );

    paginatedAttempts = computed(() => {
        const start = (this.currentPage - 1) * this.pageSize;
        return this.itineraryList().slice(start, start + this.pageSize);
    });

    hasMorePages?: boolean;
    hasPreviousPages?: boolean;
    onNextPage(): void {
        if (this.hasMorePages) {
            this.currentPage = this.currentPage + 1
            this.fetchItineraryPage()
        }
    }
    onPreviousPage(): void {
        if (this.hasPreviousPages) {
            this.currentPage = this.currentPage - 1
            this.fetchItineraryPage()
        }
    }
    fetchItineraryPage(): void {
        this.itineraryService.getAllPaginated(this.currentPage, this.pageSize).then((result) => {
            this.itineraryList.set(result.data)
            this.hasMorePages = result.hasNext;
            this.hasPreviousPages = result.hasPrevious;
            this.currentPage = result.page;
        });
    }
}
