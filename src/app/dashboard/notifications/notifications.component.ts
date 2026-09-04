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
        hours: [null as number | null, Validators.required],
    });
    currentPage = signal<number>(1)
    hasNext = signal<boolean | undefined>(undefined)
    hasPrevious = signal<boolean | undefined>(undefined)
    zone = signal<number | undefined>(undefined)
    window = signal<string | undefined>(undefined)
    hours = signal<number | undefined>(undefined)
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
    handleUpdateZone(zone:number){
        this.zone.set(zone)
    }
    planGeneralRoute() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        if (!this.zone() || !this.form.value.hours) {
            return;
        }
        this.router.navigate(
            ['/dashboard/rota-geral', this.currentUser()?.id],
            {
                queryParams: {
                    zone: this.zone()!,
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

        await this.loadNotifications();
    }

    fetchNotifications() {
        if (!this.zone()) {
            return;
        }
        this.loadNotifications()
    }
    private async loadNotifications(): Promise<void> {
        if (!this.zone()) {
            this.isLoading.set(false);
            return;
        }
        this.isLoading.set(true);

        const result =
            await this.notificationService.getAllPaginatedByZone(this.currentPage(), 6, this.zone()!);

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