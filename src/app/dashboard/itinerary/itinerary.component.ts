import { Component, inject, Input, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AttemptsFilteredSearchComponent } from "./components/filtered-search/attempts-filtered-search.component";
import { AttemptsEntriesComponent } from "./components/attempt-entries/attempts-entries.component";
import { Attempt } from '../../models/attempt';
import { DashboardSection } from '../../models/dashboard-section';
import { DashboardStateService } from '../../services/dashboard-state.service';
import { MatDialog } from '@angular/material/dialog';
import { NewItineraryModal } from './components/new-itinerary-modal/new-itinerary-modal.component';
import { ItineraryService } from '../../services/itinerary.service';
import { dashboardSections } from '../constants/constants';


@Component({
    selector: 'app-itinerary',
    imports: [
        MatSidenavModule,
        AttemptsFilteredSearchComponent,
        AttemptsEntriesComponent,
        AttemptsEntriesComponent,
    ],
    templateUrl: './itinerary.component.html',
})
export class ItineraryComponent implements OnInit {
    private itineraryService = inject(ItineraryService);
    attempts: Attempt[] = [];
    activeSection: DashboardSection = dashboardSections.find(section => section.name == 'Itinerário')!;
    hasMoreEntriesPages = false;
    hasPreviousEntriesPages = false;
    currentEntriesPage = 1;
    dashboardState = inject(DashboardStateService);
    isAttemptsLoading = true
    constructor(private dialog: MatDialog) {
        this.dashboardState.setActiveSection(dashboardSections.find(section => section.name == 'Itinerário')!);
        this.dashboardState.setBreadCrumbs(this.dashboardState.activeSection().name);
    }

    openModal() {
        const ref = this.dialog.open(NewItineraryModal, {
            width: '1200px',
            height: '500px',
            data: { titulo: 'Confirmação' }
        });
        ref.afterClosed().subscribe(result => console.log(result));
    }
    ngOnInit(): void {
        this.itineraryService.getLastAttempts(this.currentEntriesPage, 5).then((result) => {
            this.attempts = result.data;
            this.hasMoreEntriesPages = result.hasNext;
            this.hasPreviousEntriesPages = result.hasPrevious;
            this.currentEntriesPage = result.page;
        });
        this.isAttemptsLoading = false
    }
    fetchAttemptsPage(page: number): void {
        this.itineraryService.getLastAttempts(page, 5).then((result) => {
            this.attempts = result.data;
            this.hasMoreEntriesPages = result.hasNext;
            this.hasPreviousEntriesPages = result.hasPrevious;
            this.currentEntriesPage = result.page;
        });
    }
}
