import { Component, inject, Input, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AttemptsFilteredSearchComponent } from "./components/filtered-search/attempts-filtered-search.component";
import { AttemptsEntriesComponent } from "./components/attempt-entries/attempts-entries.component";
import { AttemptsService } from '../../services/attempts.service';
import { Attempt } from '../../models/attempt';
import { DashboardSection } from '../../models/dashboard-section';
import { DashboardStateService } from '../../services/dashboard-state.service';


@Component({
  selector: 'app-attempts',
  imports: [
    MatSidenavModule,
    AttemptsFilteredSearchComponent,
    AttemptsEntriesComponent,
    AttemptsEntriesComponent
],
  templateUrl: './attempts.component.html',
})
export class AttemptsComponent implements OnInit{
    private attemptsService = inject(AttemptsService);
    attempts: Attempt[] = [];
    activeSection: DashboardSection = { name: 'Tentativas', icon: 'checklist', path: '/tentativas' };
    hasMoreEntriesPages = false;
    hasPreviousEntriesPages = false;
    currentEntriesPage = 1;
    dashboardState = inject(DashboardStateService);
    constructor() {
        this.dashboardState.setActiveSection({
            name: 'Tentativas',
            icon: 'checklist',
            path: '/tentativas'
        });
    }
    ngOnInit(): void {
        this.attemptsService.getAttempts(this.currentEntriesPage, 5).then((attempts) => {
            this.attempts = attempts.data;
            this.hasMoreEntriesPages = attempts.hasNext;
            this.hasPreviousEntriesPages = attempts.hasPrevious;
            this.currentEntriesPage = attempts.page;
        });
    }
    fetchAttemptsPage(page: number): void {
        this.attemptsService.getAttempts(page, 5).then((attempts) => {
            this.attempts = attempts.data;
            this.hasMoreEntriesPages = attempts.hasNext;
            this.hasPreviousEntriesPages = attempts.hasPrevious;
            this.currentEntriesPage = attempts.page;
        });
    }
}
