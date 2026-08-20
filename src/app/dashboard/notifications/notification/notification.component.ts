import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DashboardStateService } from '../../../services/dashboard-state.service';
import { dashboardSections } from '../../constants/constants';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';
import { Notification } from '../../../models/notification';
import { MapSectionComponent } from './map-section/map-section.component';
import { AddressesSectionComponent } from './addresses-section/addresses-section.component';


@Component({
    selector: 'app-notifications',
    imports: [MatSidenavModule, MapSectionComponent, AddressesSectionComponent],
    templateUrl: './notification.component.html',
})
export class NotificationComponent implements OnInit {
    dashboardState = inject(DashboardStateService);
    private notificationService = inject(NotificationService);
    notification = signal<Notification | undefined>(undefined)
    isAddressesLoading = signal(true)
    constructor(private route: ActivatedRoute) {
        this.dashboardState.setActiveSection(dashboardSections.find(section => section.name == 'Notificações')!);
    }
    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id') ?? 'f47ac10b-58cc-4372-a567-0e02b2c3d004';
            this.dashboardState.setBreadCrumbs(this.dashboardState.activeSection().getNameWithId(id));
            if (id) {
                this.notificationService.getById(id).then(result => {
                    this.notification.set(result.data)
                })
            }
        })
    }
}