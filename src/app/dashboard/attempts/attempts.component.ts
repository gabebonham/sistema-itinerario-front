import { Component, inject, Input, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AttemptsFilteredSearchComponent } from "./components/filtered-search/attempts-filtered-search.component";
import { AttemptsEntriesComponent } from "./components/attempt-entries/attempts-entries.component";
import { AttemptsService } from '../../services/attempts.service';
import { Attempt } from '../../models/attempt';
import { DashboardSection } from '../../models/dashboard-section';
import { DashboardStateService } from '../../services/dashboard-state.service';
import { MatDialog } from '@angular/material/dialog';
import { NewAttemptModal } from './components/new-attempt-modal/new-attempt-modal.component';


@Component({
    selector: 'app-attempts',
    imports: [
        MatSidenavModule,
        AttemptsFilteredSearchComponent,
        AttemptsEntriesComponent,
        AttemptsEntriesComponent,
    ],
    templateUrl: './attempts.component.html',
})
export class AttemptsComponent implements OnInit {
    private attemptsService = inject(AttemptsService);
    attempts: Attempt[] = [];
    activeSection: DashboardSection = { name: 'Tentativas', icon: 'checklist', path: '/tentativas' };
    hasMoreEntriesPages = false;
    hasPreviousEntriesPages = false;
    currentEntriesPage = 1;
    dashboardState = inject(DashboardStateService);
    isAttemptsLoading = true
    constructor(private dialog: MatDialog) {
        this.dashboardState.setActiveSection({
            name: 'Tentativas',
            icon: 'checklist',
            path: '/tentativas'
        });
    }

    openModal() {
        const ref = this.dialog.open(NewAttemptModal, {
            width: '1200px',
            height:'500px',
            data: { titulo: 'Confirmação' }
        });
        ref.afterClosed().subscribe(result => console.log(result));
    }
    ngOnInit(): void {
        this.attemptsService.getAttempts(this.currentEntriesPage, 5).then((attempts) => {
            this.attempts = attempts.data;
            this.hasMoreEntriesPages = attempts.hasNext;
            this.hasPreviousEntriesPages = attempts.hasPrevious;
            this.currentEntriesPage = attempts.page;
        });
        this.isAttemptsLoading = false
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
