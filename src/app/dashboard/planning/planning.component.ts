import { Component, inject, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DashboardHeaderComponent } from '../components/header.component';
import { ActivatedRoute } from '@angular/router';
import { Attempt } from '../../models/attempt';
import { AttemptsService } from '../../services/attempts.service';
interface DashboardSection {
    name: string;
    icon: string;
}
@Component({
    selector: 'app-planning',
    imports: [MatSidenavModule, DashboardHeaderComponent],
    templateUrl: './planning.component.html',
})
export class PlanningComponent implements OnInit {
    activeSection: DashboardSection = { name: 'Planejamento', icon: 'tune' };
    attempt?:Attempt;
    attemptsService:AttemptsService = inject(AttemptsService);
    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id') ?? '';
        if (id) {
            this.attemptsService.getAttemptById(id).then(attempt => {
                this.attempt = attempt;
            });
            this.getAndBuildAddresses(id);
            this.getAndBuildInstallments(id);
            this.getAndBuildDebtor(id);
            this.getAndBuildRoute(id);
        }
    }
    getAndBuildAttempt(id:string): void {
        this.attemptsService.getAttemptById(id).then(attempt => {
            this.attempt = attempt;
        });
    }
    getAndBuildAddresses(attemptId:string): void {}
    getAndBuildInstallments(attemptId:string): void {}
    getAndBuildDebtor(attemptId:string): void {}
    getAndBuildRoute(attemptId:string): void {}
}
