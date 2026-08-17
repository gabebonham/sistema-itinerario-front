import { Component, inject, Input } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DashboardSection } from '../../models/dashboard-section';
import { DashboardStateService } from '../../services/dashboard-state.service';


@Component({
  selector: 'app-field',
  imports: [MatSidenavModule],
  templateUrl: './field.component.html',
})
export class FieldComponent {
    dashboardState = inject(DashboardStateService);
    constructor() {
        this.dashboardState.setActiveSection({
            name: 'Campo',
            icon: 'location_on',
            path: '/campo'
        });
    }
}
