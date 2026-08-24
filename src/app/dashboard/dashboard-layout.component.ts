import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { environment } from '../../environtments/environment.dev';
import { dashboardSections } from './constants/constants';
import { DashboardHeaderComponent } from './components/header.component';
import { DashboardSection } from '../models/dashboard-section';
import { DashboardStateService } from '../services/dashboard-state.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { User } from '../models/user';

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
    currentUser = signal<User|undefined>(undefined);
    private breakpointObserver = inject(BreakpointObserver);

    isMobile = false;
    constructor(private router: Router) {
        effect(() => {
            this.authService.me().then(result=>{
                if(result.success) {
                    this.currentUser.set(result.data.user)
                } else {
                    this.authService.logout()
                    this.router.navigate(['/auth'])
                }
            })
            if (this.currentUser() && this.currentUser()?.role=='admin') {
                this.sections = dashboardSections
            } else {
                this.sections = dashboardSections.filter(section => section.role == (this.currentUser()?.role!))
            }
        })
    }

    ngOnInit(): void {
        this.breakpointObserver
            .observe([Breakpoints.Handset, Breakpoints.Tablet])
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
            this.toggleSidenav()
        }
        this.router.navigate([`/dashboard/${section.path}`]);
    }
    onLogout() {
        this.authService.logout()
    }
}