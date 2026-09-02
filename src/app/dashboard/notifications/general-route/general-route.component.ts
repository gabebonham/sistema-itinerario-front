import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DashboardStateService } from '../../../services/dashboard-state.service';
import { dashboardSections } from '../../constants/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';
import { MapSectionComponent } from './map-section/map-section.component';
import { Diligence } from '../../../models/diligence';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Debtor } from '../../../models/debtor';
import { ActionsSectionComponent } from './actions-section/actions-section.component';
import { SupportObservationsSectionComponent } from './support-observations-section/support-observations-section.component';
import { AttemptService } from '../../../services/attempt.service';
import { DiligencesService } from '../../../services/diligences.service';
import { DebtorService } from '../../../services/debtor.service';
import { Address } from '../../../models/address';


@Component({
    selector: 'app-general-route',
    imports: [MatSidenavModule, MatSnackBarModule, MapSectionComponent, ActionsSectionComponent, SupportObservationsSectionComponent],
    templateUrl: './general-route.component.html',
})
export class GeneralRouteComponent implements OnInit {
    private snackBar = inject(MatSnackBar);
    dashboardState = inject(DashboardStateService);
    private notificationService = inject(NotificationService);
    private debtorService = inject(DebtorService);
    private attemptService = inject(AttemptService);

    currentDiligence = signal<Diligence | undefined>(undefined)
    diligences = signal<Diligence[]>([])
    localDiligences = signal<Diligence[]>([])
    notificatorId = signal<string | undefined>(undefined)
    localNotifications = signal<string[]>([])
    addresses = signal<Address[]>([])
    currentNotificationId = signal<string | undefined>(undefined)
    currentDebtor = signal<Debtor | undefined>(undefined)
    isAddressesLoading = signal(true)
    loadingNextDiligence = signal(true)
    constructor(private route: ActivatedRoute,private router: Router) {
        this.dashboardState.setActiveSection(dashboardSections.find(section => section.name == 'Notificações')!);
    }
    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id') ?? '';
            this.notificatorId.set(id)
            this.dashboardState.setBreadCrumbs(this.dashboardState.activeSection().getNameWithId(id));
            if (id) {
                this.notificationService.getAllByNotificatorId(id).then(notificationResult => {
                    if (notificationResult.success) {
                        this.diligences.set(notificationResult.data.data.map(notification => notification.diligence!).filter(diligence => diligence !== undefined) as Diligence[])
                        this.localDiligences.set(notificationResult.data.data.map(notification => notification.diligence!).filter(diligence => diligence !== undefined) as Diligence[])
                        this.localNotifications.set(notificationResult.data.data.map(notification => notification.id!).filter(id => id !== undefined) as string[])
                        
                        this.addresses.set(notificationResult.data.data.map(notification => notification.diligence?.address!).filter(address => address !== undefined) as Address[])
                        this.getNextDiligence()
                    } else {
                        this.showToast("Erro ao buscar notificações.")
                    }
                })
            }
        })
    }
    getNextDiligence() {
        if (!this.localDiligences() || this.localDiligences().length === 0) {
            this.showToast("Todas as diligências foram visitadas.")
            this.router.navigate(['/dashboard/notificacoes'])
            return
        }
        this.loadingNextDiligence.set(true)
        const nextDiligence = this.localDiligences()[0]
        const nextNotificationId = this.localNotifications()[0]
        if (nextDiligence) {
            this.currentDiligence.set(nextDiligence)
            this.currentNotificationId.set(nextNotificationId)
            this.localNotifications.update(notifications => notifications.slice(1))
            this.localDiligences.update(diligences => diligences.slice(1))
        }
        this.loadingNextDiligence.set(false)
    }
    getLastDiligenceByAttemptId(id: string) {
        this.attemptService.getById(id).then(result => {
            if (result.success) {
                this.currentDiligence.set(result.data.lastDiligence)
            } else {
                this.showToast("Erro ao buscar diligência.")
            }
        })
    }

    getDebtor(id: string) {
        this.debtorService.getById(id).then(result => {
            if (result.success) {
                this.currentDebtor.set(result.data)
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