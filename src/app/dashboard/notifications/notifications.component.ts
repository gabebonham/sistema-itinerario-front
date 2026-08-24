import { Component, effect, inject, Input, OnInit, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DashboardSection } from '../../models/dashboard-section';
import { dashboardSections } from '../constants/constants';
import { DashboardStateService } from '../../services/dashboard-state.service';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/notification';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationsSection } from './notifications-section/notifications-section.component';
import { User } from '../../models/user';
import { Router } from '@angular/router';

@Component({
    selector: 'app-notifications',
    imports: [
        MatSidenavModule,
        MatSnackBarModule,
        NotificationsSection
    ],
    templateUrl: './notifications.component.html',
})
export class NotificationsComponent  {
    private snackBar = inject(MatSnackBar);
    activeSection: DashboardSection = dashboardSections.find(section => section.name == 'Notificações')!;

    dashboardState = inject(DashboardStateService);
    notificationService = inject(NotificationService);
    authService = inject(AuthService);

    notifications = signal<Notification[]>([]);
    isLoading = signal(false);


    constructor(private router: Router) {
        this.dashboardState.setActiveSection(dashboardSections.find(section => section.name == 'Notificações')!);
        this.dashboardState.setBreadCrumbs(this.dashboardState.activeSection().name);

        effect(() => {
            let user:User|undefined;
            this.authService.me().then(result=> {
                if (result.success) {
                    user = result.data.user
                } else {
                    this.authService.logout()
                    this.router.navigate(['/auth'])
                }
            })
            if (user) {
                this.isLoading.set(true);
                this.notificationService.getAllByNotificatorId(user.id)
                    .then(result => {
                        if (result.success) this.notifications.set(result.data);
                        this.isLoading.set(false);
                    });
            }
        });
    }
    showToast(text: string) {
        this.snackBar.open(text, 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
        });
    }
}
