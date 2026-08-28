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
export class NotificationsComponent {
    private snackBar = inject(MatSnackBar);
    activeSection: DashboardSection = dashboardSections.find(section => section.name == 'Notificações')!;

    dashboardState = inject(DashboardStateService);
    notificationService = inject(NotificationService);
    authService = inject(AuthService);

    notifications = signal<Notification[]>([]);
    isLoading = signal(true);

    currentUser = signal<User | undefined>(undefined)

    constructor(private router: Router) {
        this.dashboardState.setActiveSection(dashboardSections.find(section => section.name == 'Notificações')!);
        this.dashboardState.setBreadCrumbs(this.dashboardState.activeSection().name);

        effect(() => {
            this.authService.me().then(result => {
                if (result.success) {
                    const user: User = {
                        createdAt: result.data.createdAt,
                        email: result.data.email,
                        id: result.data.id,
                        name: result.data.name,
                        role: result.data.role,
                        updatedAt: result.data.updatedAt,
                    }
                    this.currentUser.set(user)
                } else {
                    this.authService.logout()
                    this.router.navigate(['/auth'])
                }
            })
            if (this.currentUser()) {
                this.isLoading.set(true);
                this.notificationService.getAllByNotificatorId(this.currentUser()?.id!)
                    .then(result => {
                        if (result.success) this.notifications.set(result.data.data.map(notification => ({
                            attemptId:notification.attemptId,
                            createdAt:notification.createdAt,
                            debtorId:notification.debtorId,
                            diligenceId:notification.diligenceId,
                            id:notification.id,
                            notificatorId:notification.notificatorId,
                            updatedAt:notification.updatedAt,
                            attempt:notification.attempt,
                            diligence:notification.diligence,
                        } as Notification)));
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
