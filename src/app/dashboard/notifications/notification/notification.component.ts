import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DashboardStateService } from '../../../services/dashboard-state.service';
import { dashboardSections } from '../../constants/constants';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';
import { MapSectionComponent } from './map-section/map-section.component';
import { Diligence } from '../../../models/diligence';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DebtorService } from '../../../services/debtor.service';
import { Debtor } from '../../../models/debtor';
import { ActionsSectionComponent } from './actions-section/actions-section.component';
import { SupportObservationsSectionComponent } from './support-observations-section/support-observations-section.component';
import { AttemptService } from '../../../services/attempt.service';
import { Address } from '../../../models/address';


@Component({
    selector: 'app-notifications',
    imports: [MatSidenavModule, MatSnackBarModule, MapSectionComponent, ActionsSectionComponent, SupportObservationsSectionComponent],
    templateUrl: './notification.component.html',
})
export class NotificationComponent implements OnInit {
    private snackBar = inject(MatSnackBar);
    dashboardState = inject(DashboardStateService);
    private notificationService = inject(NotificationService);
    private debtorService = inject(DebtorService);
    private attemptService = inject(AttemptService);
    diligence = signal<Diligence | undefined>(undefined)
    notificationId = signal<string | undefined>(undefined)
    debtor = signal<Debtor | undefined>(undefined)
    addresses = signal<Address[]>([])
    isAddressesLoading = signal(true)
    constructor(private route: ActivatedRoute) {
        this.dashboardState.setActiveSection(dashboardSections.find(section => section.name == 'Notificações')!);
    }
    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id') ?? '';
            this.notificationId.set(id)
            this.dashboardState.setBreadCrumbs(this.dashboardState.activeSection().getNameWithId(id));
            if (id) {
                this.notificationService.getById(id).then(notificationResult => {
                    if (notificationResult.success) {
                        this.getLastDiligenceByAttemptId(notificationResult.data?.diligence?.attemptId!)
                        this.getDebtor(notificationResult.data?.debtorId!)
                    } else {
                        this.showToast("Erro ao buscar notificação.")
                    }
                })
            }
        })
    }

    getLastDiligenceByAttemptId(id: string) {
        this.attemptService.getById(id).then(result => {
            if (result.success) {
                const diligence = result.data.lastDiligence;

                this.diligence.set(diligence);

                this.addresses.set(
                    diligence?.address
                        ? [diligence.address]
                        : []
                );
            } else {
                this.showToast("Erro ao buscar diligência.");
            }
        });
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
    getDateFormatted(date?: Date): string {
        if (!date) return '';

        const d = new Date(date);
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');

        return `${hours}:${minutes}`;
    }
}