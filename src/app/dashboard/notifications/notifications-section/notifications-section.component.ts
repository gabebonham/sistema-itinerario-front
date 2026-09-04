import { Component, computed, effect, EventEmitter, inject, Input, input, OnInit, output, Output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NotificationEntryComponent } from './notification-entry/notification-entry.component';
import { Notification, NotificationEntry } from '../../../models/notification';
import { NotificationService } from '../../../services/notification.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-notifications-section',
    standalone: true,
    imports: [
        MatIconModule,
        NotificationEntryComponent,
        MatSnackBarModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
    ],
    templateUrl: './notifications-section.component.html',
})
export class NotificationsSection {
    private snackBar = inject(MatSnackBar);
    isLoading = signal<boolean>(false);

    notificationService = inject(NotificationService);

    notifications = signal<Notification[]>([]);
    notificationEntries = signal<NotificationEntry[]>([]);

    pageSize = signal(6);
    currentPage = signal(1);
    private fb = inject(FormBuilder);
    form = this.fb.group({
        zone: [null as number | null, Validators.required],
    });
    updateZone = output<number>()
    zone = input<undefined | number>(undefined)
    @Output() nextPage = new EventEmitter<number>();
    @Output() previousPage = new EventEmitter<number>();
    constructor() {
        effect(() => {
            this.notificationEntries.set(this.notifications().map(notification => ({
                id: notification.id,
                createdAt: notification.createdAt,
                address: notification.diligence?.address?.name!,
                debtorName: notification.diligence?.debtorName!,
                diligenceFinish: notification.diligence?.finish!,
                diligenceStart: notification.diligence?.start!,
                diligenceOrdinal: notification.diligence?.diligenceOrdinal!,
                notificatorName: notification.diligence?.notificatorName!,
                diligenceWindow: notification.diligence?.window!,
                protocol: notification.diligence?.protocol!
            })))
        })
    }
    fetchNotifications() {
        if (!this.form.value.zone) {
            return;
        }
        this.loadNotifications(Number(this.form.value.zone!))
    }

    private async loadNotifications(zone: number): Promise<void> {

        this.isLoading.set(true);
        this.updateZone.emit(zone)
        const result =
            await this.notificationService.getAllPaginatedByZone(this.currentPage(), this.pageSize(), zone);

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

    totalPages = computed(() =>
        Math.max(1, Math.ceil(this.notifications().length / this.pageSize()))
    );

    paginatedDiligences = computed(() => {
        const start = (this.currentPage() - 1) * this.pageSize();
        return this.notifications().slice(start, start + this.pageSize());
    });

    @Input() hasMorePages!: boolean;
    @Input() hasPreviousPages!: boolean;


    onNextPage(): void {
        if (this.hasMorePages) {
            this.nextPage.emit(this.currentPage() + 1);
            this.currentPage.set(this.currentPage() + 1)
        }
    }
    onPreviousPage(): void {
        if (this.hasPreviousPages) {
            this.previousPage.emit(this.currentPage() - 1);
            this.currentPage.set(this.currentPage() - 1)
        }
    }
    showToast(text: string) {
        this.snackBar.open(text, 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
        });
    }

}