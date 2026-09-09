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
import { DiligencesService } from '../../services/diligences.service';

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
    diligencesService = inject(DiligencesService);
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
    hasPendingDiligences = signal<boolean>(false)
    isLoadingPendingVerification = signal(true)
    constructor(private router: Router) {
        this.dashboardState.setActiveSection(
            dashboardSections.find(section => section.name === 'Notificações')!
        );

        this.dashboardState.setBreadCrumbs(
            this.dashboardState.activeSection().name
        );

        this.currentMoment();
        this.getPendingDiligences();
        const hours = this.getHoursFromCookie();

        if (hours) {
            const parsedHours = parseInt(hours, 10);

            if (Number.isInteger(parsedHours)) {
                this.form.patchValue({ hours: parsedHours });
            }
        }
    }
    getPendingDiligences() {
        if (!this.currentUser()?.id) {
            this.router.navigate(['/auth'])
            return
        }
        this.diligencesService.getProgressByNotificatorId(this.currentUser()?.id!).then(result => {
            if (result.success) {
                const hasPendingDiligences = result.data.ongoingDiligences.length > 0
                this.hasPendingDiligences.set(hasPendingDiligences)
            } else {
                this.showToast(result.error)
            }
        }).finally(()=>{
            this.isLoadingPendingVerification.set(false)
        })
    }
    handleUpdateZone(zone: number) {
        this.zone.set(zone)
        this.setZoneToCookie(zone)
    }
    planGeneralRoute(data: { zone?: number, hours?: number, pending?: boolean }) {
        this.router.navigate(
            ['/dashboard/rota-geral', this.currentUser()?.id],
            {
                queryParams: {
                    zone: data.zone,
                    hours: data.hours,
                    pending: data.pending
                }
            }
        );
    }
    setHoursToCookie(hours: number) {
        document.cookie = `hours=${hours}; path=/`;
    }
    setZoneToCookie(zone: number) {
        document.cookie = `zone=${zone}; path=/`;
    }
    getHoursFromCookie() {
        const cookies = document.cookie.split('; ');

        const cookie = cookies.find(row => row.startsWith('hours='));

        const hours = cookie?.split('=')[1];
        return hours
    }
    planPendingRoute(pending: boolean) {
        if (!this.form.value.hours) {
            this.form.markAsTouched()
            this.showToast("Carga horária deve ser informada")
            return
        }
        this.setHoursToCookie(this.form.value.hours!)
        this.planGeneralRoute({ pending, hours: this.form.value.hours! })
    }

    currentMoment() {
        const today = new Date();
        const hour = today.getHours();
        const weekDay = today.getDate();

        let window: string | undefined = undefined;
        if (weekDay == 6) {
            window = hour < 12 ? 'Sábado' : undefined;
        } else if (weekDay == 7) {
            window = undefined;
        } else {
            window = hour < 12 ? 'Manhã' : 'Tarde';
        }
        this.window.set(window)
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
            this.showToast(result.error);
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