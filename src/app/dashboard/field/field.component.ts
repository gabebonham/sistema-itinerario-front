import { Component, inject, Input } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DashboardSection } from '../../models/dashboard-section';
import { DashboardStateService } from '../../services/dashboard-state.service';
import { dashboardSections } from '../constants/constants';


@Component({
    selector: 'app-field',
    imports: [MatSidenavModule],
    templateUrl: './field.component.html',
})
export class FieldComponent {
    dashboardState = inject(DashboardStateService);
    constructor() {
        this.dashboardState.setActiveSection(dashboardSections.find(section => section.name == 'Campo')!);
        this.dashboardState.setBreadCrumbs(this.dashboardState.activeSection().name);
    }
}
