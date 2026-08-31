import { Component, inject, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';

import { environment } from '../../environtments/environment.dev';
import { dashboardSections } from './constants/constants';
import { DashboardHeaderComponent } from './components/header.component';
import { DashboardSection } from '../models/dashboard-section';
import { DashboardStateService } from '../services/dashboard-state.service';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-dashboard-layout',
    imports: [
        CommonModule,
        MatSidenavModule,
        MatIconModule,
        RouterOutlet,
        DashboardHeaderComponent
    ],
    templateUrl: './dashboard-layout.component.html',
})
export class DashboardLayoutComponent implements OnInit {

    sections: DashboardSection[] = [];

    appName = environment.appName;
    sidenavOpened = true;
    isMobile = false;

    dashboardState = inject(DashboardStateService);
    authService = inject(AuthService);

    private router = inject(Router);
    private breakpointObserver = inject(BreakpointObserver);

    // Não precisa mais ter currentUser próprio
    currentUser = this.authService.currentUser;

    constructor() {}

    ngOnInit(): void {

        const user = this.currentUser();

        if (!user) {
            return;
        }

        this.dashboardState.setActiveSection(
            dashboardSections.find(section => section.name === 'Tentativas')!
        );

        this.dashboardState.setBreadCrumbs(
            this.dashboardState.activeSection().name
        );

        if (user.role === 'Admin') {
            this.sections = dashboardSections;
        } else {
            this.sections = dashboardSections.filter(
                section => section.role === user.role
            );
        }

        this.breakpointObserver
            .observe([
                Breakpoints.Handset,
                Breakpoints.Tablet
            ])
            .subscribe(result => {
                this.isMobile = result.matches;
                this.sidenavOpened = !result.matches;
            });
    }

    toggleSidenav(): void {
        this.sidenavOpened = !this.sidenavOpened;
    }

    changeSection(section: DashboardSection): void {
        if (this.isMobile) {
            this.toggleSidenav();
        }

        this.router.navigate([
            `/dashboard/${section.path}`
        ]);
    }

    onLogout(): void {
        this.authService.logout().then(result => {
            if (result.success) {
                this.router.navigate(['/auth']);
            }
        });
    }
}