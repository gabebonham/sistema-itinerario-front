import { Component, computed, effect, EventEmitter, inject, Input, input, OnInit, Output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NotificationEntryComponent } from './notification-entry/notification-entry.component';
import { Notification, NotificationEntry } from '../../../models/notification';

@Component({
    selector: 'app-notifications-section',
    standalone: true,
    imports: [MatIconModule, NotificationEntryComponent],
    templateUrl: './notifications-section.component.html',
})
export class NotificationsSection  {
    isLoading = input.required<boolean>();

    notifications = input.required<Notification[]>();
    notificationEntries = signal<NotificationEntry[]>([]);

    pageSize = 5;
    currentPage = 1;

    @Output() nextPage = new EventEmitter<number>();
    @Output() previousPage = new EventEmitter<number>();
    constructor() {
        effect(()=>{
            this.notificationEntries.set(this.notifications().map(notification=>({
                id:notification.id,
                createdAt:notification.createdAt,
                address:notification.diligence?.address?.neighborhood!,
                debtorName:notification.diligence?.debtorName!,
                diligenceFinish:notification.diligence?.finish!,
                diligenceStart:notification.diligence?.start!,
                diligenceOrdinal:notification.diligence?.diligenceOrdinal!,
                notificatorName:notification.diligence?.notificatorName!,
                diligenceWindow:notification.diligence?.window!,
                protocol:notification.diligence?.protocol!
            })))
        })
    }

    totalPages = computed(() =>
        Math.max(1, Math.ceil(this.notifications().length / this.pageSize))
    );

    paginatedDiligences = computed(() => {
        const start = (this.currentPage - 1) * this.pageSize;
        return this.notifications().slice(start, start + this.pageSize);
    });

    @Input() hasMorePages!: boolean;
    @Input() hasPreviousPages!: boolean;
    onPageChange() {
        // this.router.navigate([], {
        //     relativeTo: this.route,
        //     queryParams: { page: this.currentPage },
        //     queryParamsHandling: 'merge',
        // });
    }
    onNextPage(): void {
        if (this.hasMorePages) {
            this.nextPage.emit(this.currentPage + 1);
            this.currentPage = this.currentPage + 1
            this.onPageChange()
        }
    }
    onPreviousPage(): void {
        if (this.hasPreviousPages) {
            this.previousPage.emit(this.currentPage - 1);
            this.currentPage = this.currentPage - 1
            this.onPageChange()
        }
    }

}