import { Component, inject } from '@angular/core';
import { DashboardSection } from '../../models/dashboard-section';
import { DashboardStateService } from '../../services/dashboard-state.service';
import { dashboardSections } from '../constants/constants';

@Component({
    selector: 'app-notificators',
    imports: [],
    templateUrl: './notificators.component.html',
})
export class NotificatorsComponent {
    private dashboardState = inject(DashboardStateService);
    activeSection: DashboardSection = dashboardSections.find(section => section.name == 'Notificadores')!;
    constructor() {
        this.dashboardState.setActiveSection(dashboardSections.find(section => section.name == 'Notificadores')!);
        this.dashboardState.setBreadCrumbs(this.dashboardState.activeSection().name);
    }
}