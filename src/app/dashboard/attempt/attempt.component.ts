import { Component, effect, inject, OnInit, signal } from '@angular/core';
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
import { Attempt } from '../../models/attempt';
import { AttemptsWithNoDiligencesEntries } from './components/attempts-with-no-diligences-entries/attempts-with-no-diligences-entries.component';
import { AttemptsFilter, AttemptsFilterService } from '../../services/attempts-filter.service';


@Component({
    selector: 'app-attempt',
    imports: [
        MatSidenavModule,
        DiligencesFilteredSearchComponent,
        DiligencesEntriesComponent,
        AttemptsWithNoDiligencesEntries,
    ],
    templateUrl: './attempt.component.html',
})
export class AttemptComponent {
    private attemptService = inject(AttemptService);
    diligences = signal<Diligence[]>([]);
    pendingAttempts = signal<Attempt[]>([]);

    activeSection: DashboardSection = dashboardSections.find(section => section.name == 'Tentativas')!;

    diligencesCurrentPage = signal(1);
    diligencesPageSize = signal(5);
    diligencesTotalPages = signal(1);
    diligencesHasNext = signal(false);
    diligencesHasPrevious = signal(false);

    pendingAttemptsCurrentPage = signal(1);
    pendingAttemptsPageSize = signal(5);
    pendingAttemptsTotalPages = signal(1);
    pendingAttemptsHasNext = signal(false);
    pendingAttemptsHasPrevious = signal(false);

    filterService = inject(AttemptsFilterService);
    dashboardState = inject(DashboardStateService);
    isDiligencesLoading = signal(true)
    isPendingAttemptsLoading = signal(true)

    constructor(private dialog: MatDialog) {
        this.dashboardState.setActiveSection(dashboardSections.find(section => section.name == 'Tentativas')!);
        this.dashboardState.setBreadCrumbs(this.dashboardState.activeSection().name);
        effect(() => {
            const filter = this.filterService.filter();
            this.fetchDiligencesPage(filter);
        });
        this.fetchPendingAttempts();
    }

    onUpdateDiligencesCurrentPage(page: number) {
        this.diligencesCurrentPage.set(page);
    }

    onUpdatePendingAttemptsCurrentPage(page: number) {
        this.pendingAttemptsCurrentPage.set(page);
    }


    openModal() {
        const ref = this.dialog.open(NewAttemptModal, {
            width: '1200px',
            height: '500px',
        });
        ref.afterClosed().subscribe();
    }

    fetchDiligencesPage(filter: AttemptsFilter): void {
        this.isDiligencesLoading.set(true)
        this.attemptService.getWithLastDiligencesPaginated(this.diligencesCurrentPage(), 5, {...filter, statuses  :['Pendente']}).then((result) => {
            const visitedDiligences = result.data.data
                .filter((attempt: Attempt) => !!attempt.lastDiligence)
                .map(attempt => attempt.lastDiligence)
                .filter((diligence): diligence is Diligence => diligence !== undefined);
            this.diligences.set(visitedDiligences);
            this.diligencesHasNext.set(result.data.hasNext);
            this.diligencesHasPrevious.set(result.data.hasPrevious);
            this.diligencesCurrentPage.set(result.data.page);
            this.isDiligencesLoading.set(false)
        });
    }

    fetchPendingAttempts(): void {
        this.isPendingAttemptsLoading.set(true)
        this.attemptService.getPendingPaginated(this.pendingAttemptsCurrentPage(), 5).then((result) => {
            const pendingAttempts = result.data.data
                .filter((attempt: Attempt) => !attempt.lastDiligence)
            this.pendingAttempts.set(pendingAttempts);
            this.pendingAttemptsHasNext.set(result.data.hasNext);
            this.pendingAttemptsHasPrevious.set(result.data.hasPrevious);
            this.pendingAttemptsCurrentPage.set(result.data.page);
            this.isPendingAttemptsLoading.set(false)
        });
    }
}
