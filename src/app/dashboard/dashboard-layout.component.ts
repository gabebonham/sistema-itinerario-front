import { Component, effect, inject, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { environment } from '../../environtments/environment.dev';
import { dashboardSections } from './constants/constants';
import { DashboardHeaderComponent } from './components/header.component';
import { DashboardSection } from '../models/dashboard-section';
import { DashboardStateService } from '../services/dashboard-state.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard-layout',
    imports: [CommonModule, MatSidenavModule, MatIconModule, RouterOutlet, DashboardHeaderComponent],
    templateUrl: './dashboard-layout.component.html',
})
export class DashboardLayoutComponent implements OnInit {
    sections: DashboardSection[] = [];
    appName = environment.appName;
    sidenavOpened = true;
    dashboardState = inject(DashboardStateService);
    authService = inject(AuthService);
    currentUser = this.authService.currentUser;
    private breakpointObserver = inject(BreakpointObserver);

    constructor(private router: Router) {
        effect(() => {
            if (this.authService.currentUser()?.role == 'admin') {
                this.sections = dashboardSections

            } else {

                this.sections = dashboardSections.filter(section => section.role == (this.authService.currentUser()?.role!))
            }
        })
    }

    ngOnInit(): void {
        this.authService.checkSession().subscribe();
        this.breakpointObserver
            .observe([Breakpoints.Handset, Breakpoints.Tablet])
            .subscribe(result => {
                this.sidenavOpened = !result.matches;
            });
    }

    toggleSidenav(): void {
        this.sidenavOpened = !this.sidenavOpened;
    }

    changeSection(section: DashboardSection): void {
        this.router.navigate([`/dashboard/${section.path}`]);
    }
}