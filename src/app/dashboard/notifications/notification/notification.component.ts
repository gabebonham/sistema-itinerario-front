import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DashboardStateService } from '../../../services/dashboard-state.service';
import { dashboardSections } from '../../constants/constants';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';
import { MapSectionComponent } from './map-section/map-section.component';
import { DiligencesService } from '../../../services/diligences.service';
import { Diligence } from '../../../models/diligence';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DebtorService } from '../../../services/debtor.service';
import { Debtor } from '../../../models/debtor';
import { ActionsSectionComponent } from './actions-section/actions-section.component';
import { SupportObservationsSectionComponent } from './support-observations-section/support-observations-section.component';


@Component({
    selector: 'app-notifications',
    imports: [MatSidenavModule, MatSnackBarModule, MapSectionComponent,ActionsSectionComponent, SupportObservationsSectionComponent],
    templateUrl: './notification.component.html',
})
export class NotificationComponent implements OnInit {
    private snackBar = inject(MatSnackBar);
    dashboardState = inject(DashboardStateService);
    private notificationService = inject(NotificationService);
    private diligenceService = inject(DiligencesService);
    private debtorService = inject(DebtorService);
    diligence = signal<Diligence | undefined>(undefined)
    debtor = signal<Debtor | undefined>(undefined)
    isAddressesLoading = signal(true)
    constructor(private route: ActivatedRoute) {
        this.dashboardState.setActiveSection(dashboardSections.find(section => section.name == 'Notificações')!);
    }
    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id') ?? 'f47ac10b-58cc-4372-a567-0e02b2c3d004';
            this.dashboardState.setBreadCrumbs(this.dashboardState.activeSection().getNameWithId(id));
            if (id) {
                this.notificationService.getById(id).then(notificationResult => {
                    if (notificationResult.success) {
                        this.getDiligence(notificationResult.data?.diligenceId!)
                        this.getDebtor(notificationResult.data?.debtorId!)
                    } else {
                        this.showToast("Erro ao buscar notificação.")
                    }
                })
            }
        })
    }
    getDiligence(id: string) {
        this.diligenceService.getDiligenceById(id).then(diligenceResult => {
            if (diligenceResult.success) {
                this.diligence.set(diligenceResult.data)
            } else {
                this.showToast("Erro ao buscar diligência.")
            }
        })
    }
    getDebtor(id: string) {
        this.debtorService.getById(id).then(diligenceResult => {
            if (diligenceResult.success) {
                this.debtor.set(diligenceResult.data)
            } else {
                this.showToast("Erro ao buscar devedor.")
            }
        })
    }
    showToast(text: string) {
        this.snackBar.open(text, 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
        });
    }
}