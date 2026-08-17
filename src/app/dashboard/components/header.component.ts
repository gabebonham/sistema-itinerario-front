import { Component, Input, output } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { DashboardSection } from '../../models/dashboard-section';

@Component({
    selector: 'app-dashboard-header',
    templateUrl: './header.component.html',
    standalone: true,
    imports: [MatIcon],

})
export class DashboardHeaderComponent {
    @Input() activeSection: DashboardSection = { name: '', icon: '', path: '' };
    toggleSidenav = output<void>();

}
