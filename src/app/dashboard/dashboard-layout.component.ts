import { Component, inject, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { environment } from '../../environtments/environment.dev';
import { dashboardSections } from './constants/constants';
import { DashboardHeaderComponent } from './components/header.component';
import { DashboardSection } from '../models/dashboard-section';
import { DashboardStateService } from '../services/dashboard-state.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-dashboard-layout',
    imports: [CommonModule,MatSidenavModule, MatIconModule, RouterOutlet, DashboardHeaderComponent],
    templateUrl: './dashboard-layout.component.html',
})
export class DashboardLayoutComponent implements OnInit {
    sections: DashboardSection[] = dashboardSections;
    appName = environment.appName;
    sidenavOpened = true;
    dashboardState = inject(DashboardStateService);
    authService = inject(AuthService);
    currentUser = this.authService.currentUser;

    constructor(private router: Router) { }
    ngOnInit(): void {
        this.authService.checkSession().subscribe();

    }
    toggleSidenav(): void {
        this.sidenavOpened = !this.sidenavOpened;
    }
    changeSection(section: DashboardSection): void {
        this.router.navigate([`/dashboard/${section.path}`]);
    }
}
