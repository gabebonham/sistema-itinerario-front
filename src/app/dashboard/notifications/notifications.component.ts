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
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-notifications',
    imports: [
        MatSidenavModule,
        MatSnackBarModule,
        NotificationsSection,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
    ],
    templateUrl: './notifications.component.html',
})
export class NotificationsComponent implements OnInit {
    private snackBar = inject(MatSnackBar);
    activeSection: DashboardSection =
        dashboardSections.find(section => section.name === 'Notificações')!;

    dashboardState = inject(DashboardStateService);
    notificationService = inject(NotificationService);
    authService = inject(AuthService);
    private fb = inject(FormBuilder);
    form = this.fb.group({
        hours: ['', Validators.required],
        zone: ['', Validators.required],
    });

    zone = signal(undefined)
    window = signal(undefined)
    hours = signal(undefined)
    currentLat = signal(-30.0346)
    currentLng = signal(-51.2177)
    notifications = signal<Notification[]>([]);
    isLoading = signal(true);
    currentUser = this.authService.currentUser;

    constructor(private router: Router) {
        this.dashboardState.setActiveSection(
            dashboardSections.find(section => section.name === 'Notificações')!
        );

        this.dashboardState.setBreadCrumbs(
            this.dashboardState.activeSection().name
        );
    }
    planGeneralRoute() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.router.navigate(
            ['/dashboard/rota-geral', this.currentUser()?.id],
            {
                queryParams: {
                    zone: this.form.value.zone!,
                    hours: this.form.value.hours!,
                }
            }
        );
    }
    currentMoment() {
        const now = new Date();
        const hours = now.getHours();
        const day = now.getDay();
        if (day == 6) {
            return 'Sábado'
        }
        if (hours < 12) {
            return 'Manhã'
        } else {
            return 'Tarde'
        }
    }
    async ngOnInit(): Promise<void> {
        const user = this.currentUser();

        if (!user) {
            await this.authService.logout();
            await this.router.navigate(['/auth']);
            return;
        }

        await this.loadNotifications(user.id);
    }

    private async loadNotifications(userId: string): Promise<void> {
        this.isLoading.set(true);

        const result =
            await this.notificationService.getAllByNotificatorId(userId);

        if (result.success) {
            this.notifications.set(
                result.data.data.map(notification => ({
                    attemptId: notification.attemptId,
                    createdAt: notification.createdAt,
                    debtorId: notification.debtorId,
                    diligenceId: notification.diligenceId,
                    id: notification.id,
                    notificatorId: notification.notificatorId,
                    updatedAt: notification.updatedAt,
                    attempt: notification.attempt,
                    diligence: notification.diligence,
                }))
            );
        } else {
            this.showToast('Erro ao buscar notificações.');
        }

        this.isLoading.set(false);
    }

    showToast(text: string) {
        this.snackBar.open(text, 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
        });
    }
}