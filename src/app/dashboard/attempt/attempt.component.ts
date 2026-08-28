import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DashboardSection } from '../../models/dashboard-section';
import { DashboardStateService } from '../../services/dashboard-state.service';
import { MatDialog } from '@angular/material/dialog';
import { AttemptService } from '../../services/attempt.service';
import { dashboardSections } from '../constants/constants';
import { DiligencesFilteredSearchComponent } from './components/filtered-search/diligences-filtered-search.component';
import { DiligencesEntriesComponent } from './components/diligences-entries/diligences-entries.component';
import { Diligence } from '../../models/diligence';
import { NewAttemptModal } from './components/new-attempt-modal/new-attempt-modal.component';


@Component({
    selector: 'app-attempt',
    imports: [
        MatSidenavModule,
        DiligencesFilteredSearchComponent,
        DiligencesEntriesComponent,
    ],
    templateUrl: './attempt.component.html',
})
export class AttemptComponent implements OnInit {
    private attemptService = inject(AttemptService);
    diligences = signal<Diligence[]>([]);
    activeSection: DashboardSection = dashboardSections.find(section => section.name == 'Tentativas')!;
    hasMoreEntriesPages = false;
    hasPreviousEntriesPages = false;
    currentEntriesPage = 1;
    dashboardState = inject(DashboardStateService);
    isDiligencesLoading = signal(true)
    constructor(private dialog: MatDialog) {
        this.dashboardState.setActiveSection(dashboardSections.find(section => section.name == 'Tentativas')!);
        this.dashboardState.setBreadCrumbs(this.dashboardState.activeSection().name);
    }

    openModal() {
        const ref = this.dialog.open(NewAttemptModal, {
            width: '1200px',
            height: '500px',
        });
        ref.afterClosed().subscribe();
    }
    ngOnInit(): void {
        this.attemptService.getAllPaginated(this.currentEntriesPage, 5).then((result) => {
            const diligences = result.data.data
                .map(attempt => attempt.lastDiligence)
                .filter((diligence): diligence is Diligence => diligence !== undefined);

            this.diligences.set(diligences);
            this.hasMoreEntriesPages = result.data.hasNext;
            this.hasPreviousEntriesPages = result.data.hasPrevious;
            this.currentEntriesPage = result.data.page;
            this.isDiligencesLoading.set(false)
        });
    }
    fetchDiligencesPage(page: number): void {
        this.isDiligencesLoading.set(true)
        this.attemptService.getAllPaginated(page, 5).then((result) => {
            const diligences = result.data.data
                .map(attempt => attempt.lastDiligence)
                .filter((diligence): diligence is Diligence => diligence !== undefined);
            this.diligences.set(diligences);
            this.hasMoreEntriesPages = result.data.hasNext;
            this.hasPreviousEntriesPages = result.data.hasPrevious;
            this.currentEntriesPage = result.data.page;
            this.isDiligencesLoading.set(false)
        });
    }
}
