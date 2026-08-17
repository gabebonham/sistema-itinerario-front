import { Component, input, Input, output } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { DashboardSection } from '../../models/dashboard-section';

@Component({
    selector: 'app-dashboard-header',
    templateUrl: './header.component.html',
    standalone: true,
    imports: [MatIcon],

})
export class DashboardHeaderComponent {
    breadCrumbs = input.required<string>();
    toggleSidenav = output<void>();
}
