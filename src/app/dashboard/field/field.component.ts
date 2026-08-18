import { Component, inject, Input, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DashboardStateService } from '../../services/dashboard-state.service';
import { dashboardSections } from '../constants/constants';
import { MapSectionComponent } from './map-section/map-section.component';
import { AddressesSectionComponent } from './addresses-section/addresses-section.component';
import { AttemptsService } from '../../services/attempts.service';
import { Attempt } from '../../models/attempt';
import { ActivatedRoute } from '@angular/router';


@Component({
    selector: 'app-field',
    imports: [MatSidenavModule, MapSectionComponent, AddressesSectionComponent],
    templateUrl: './field.component.html',
})
export class FieldComponent implements OnInit {
    dashboardState = inject(DashboardStateService);
    private attemptsService = inject(AttemptsService);
    attempt?: Attempt
    constructor(private route: ActivatedRoute) {
        this.dashboardState.setActiveSection(dashboardSections.find(section => section.name == 'Campo')!);
        this.dashboardState.setBreadCrumbs(this.dashboardState.activeSection().name);
    }
    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id') ?? 'f47ac10b-58cc-4372-a567-0e02b2c3d004';
            if (id) {
                this.attemptsService.getAttemptById(id).then(result => {
                    this.attempt = result.data
                })
            }
        })
    }
}