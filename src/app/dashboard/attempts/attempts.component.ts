import { Component, inject, Input, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DashboardHeaderComponent } from '../components/header.component';
import { AttemptsFilteredSearchComponent } from "./components/filtered-search/attempts-filtered-search.component";
import { AttemptsEntriesComponent } from "./components/attempt-entries/attempts-entries.component";
import { AttemptsService } from './services/attempts.service';
import { Attempt } from '../../models/attempt';

interface DashboardSection {
    name: string;
    icon: string;
}
@Component({
  selector: 'app-attempts',
  imports: [
    MatSidenavModule,
    DashboardHeaderComponent,
    AttemptsFilteredSearchComponent,
    AttemptsEntriesComponent,
    AttemptsEntriesComponent
],
  templateUrl: './attempts.component.html',
})
export class AttemptsComponent implements OnInit{
    private attemptsService = inject(AttemptsService);
    attempts: Attempt[] = [];
    activeSection: DashboardSection = { name: 'Tentativas', icon: 'checklist' };
    hasMoreEntriesPages = false;
    hasPreviousEntriesPages = false;
    currentEntriesPage = 1;
    constructor() {}
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
