import { Component, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { environment } from '../../environtments/environment.dev';
import { dashboardSections } from './constants/constants';
import { DashboardHeaderComponent } from './components/header.component';
import { DashboardSection } from '../models/dashboard-section';
import { DashboardStateService } from '../services/dashboard-state.service';


@Component({
    selector: 'app-dashboard-layout',
    imports: [MatSidenavModule, MatIconModule, RouterOutlet, DashboardHeaderComponent],
    templateUrl: './dashboard-layout.component.html',
})
export class DashboardLayoutComponent {
    sections: DashboardSection[] = dashboardSections;
    appName = environment.appName;
    sidenavOpened = true;
    dashboardState = inject(DashboardStateService);
    constructor(private router: Router) { }

    toggleSidenav(): void {
        this.sidenavOpened = !this.sidenavOpened;
    }
    changeSection(section: DashboardSection): void {
        this.router.navigate([`/dashboard/${section.path}`]);
    }
}
