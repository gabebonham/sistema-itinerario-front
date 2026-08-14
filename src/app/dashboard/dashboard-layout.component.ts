import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { environment } from '../../environtments/environment.dev';
import { DashboardSection, dashboardSections } from './constants/constants';


@Component({
    selector: 'app-dashboard-layout',
    imports: [MatSidenavModule, MatIconModule, RouterOutlet],
    templateUrl: './dashboard-layout.component.html',
})
export class DashboardLayoutComponent {
    activeSection: DashboardSection = dashboardSections[0];
    sections: DashboardSection[] = dashboardSections;
    appName = environment.appName;

    constructor(private router: Router) { }

    changeSection(section: DashboardSection): void {
        this.router.navigate([`/dashboard/${section.name.toLowerCase()}`]);
        this.activeSection = section;
    }
}
