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
import { RouteService } from '../../../services/route.service';
import { Attempt } from '../../../models/attempt';
import { AuthService } from '../../../services/auth.service';


@Component({
    selector: 'app-general-route',
    imports: [MatSidenavModule, MatSnackBarModule, MapSectionComponent, ActionsSectionComponent, SupportObservationsSectionComponent],
    templateUrl: './general-route.component.html',
})
export class GeneralRouteComponent implements OnInit {
    private snackBar = inject(MatSnackBar);
    dashboardState = inject(DashboardStateService);
    private debtorService = inject(DebtorService);
    private attemptService = inject(AttemptService);
    private diligencesService = inject(DiligencesService);
    private routeService = inject(RouteService);
    private authService = inject(AuthService);

    currentLastDiligence = signal<Diligence | undefined>(undefined);
    orderedAddresses = signal<Address[]>([]);
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
    currentUser = this.authService.currentUser;

    currentOrigin = signal<{ lat: number, lng: number } | undefined>(undefined)
    window = signal<string | undefined>(undefined)
    zone = signal<string | undefined>(undefined)
    hours = signal<string | undefined>(undefined)

    constructor(private route: ActivatedRoute, private router: Router) {
        this.dashboardState.setActiveSection(dashboardSections.find(section => section.name == 'Notificações')!);
    }
    getCurrentWindow() {
        const hour = new Date().getHours();

        const window = hour < 12 ? 'Manhã' : 'Tarde';
        this.window.set(window)
    }
    getCurrentLocation(): Promise<GeolocationCoordinates> {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                position => resolve(position.coords),
                error => reject(error)
            );
        });
    }
    async getLocation() {
        try {
            const coords = await this.getCurrentLocation();
            this.currentOrigin.set({ lat: coords.latitude, lng: coords.longitude });
            return true
        } catch (error) {
            this.showToast('Localização não disponível.');
            return false
        }
    }
    ngOnInit(): void {
        this.getCurrentWindow()
        this.getLocation().then(result => {
            if (!result) {
                this.router.navigate(['/dashboard/notificacoes'])
                return
            }
            this.route.paramMap.subscribe(params => {
                const id = params.get('id') ?? '';
                this.notificatorId.set(id)
                if (id != this.currentUser()?.id) {
                    this.showToast("Id de notificador inválido.")
                    this.router.navigate(['/dashboard/notificacoes'])
                }
                this.dashboardState.setBreadCrumbs(this.dashboardState.activeSection().getNameWithId(id));
                this.route.queryParamMap.subscribe(params => {
                    const zone = params.get('zone') ?? '';
                    const hours = params.get('hours') ?? '';
                    this.zone.set(zone)
                    this.hours.set(hours)
                    if (id && zone && hours) {
                        const dto = {
                            zone,
                            hours,
                            originLat: this.currentOrigin()?.lat,
                            originLng: this.currentOrigin()?.lng,
                            window: this.window()
                        }
                        this.routeService.prepareRoute(id, dto)
                            .then(result => {
                                if (result.success) {
                                    const validDiligences = result.data.notifications.map(notification => notification.diligence)
                                        .filter(diligence => diligence !== undefined)
                                    const validNotificationIds = result.data.notifications.map(notification => notification.id)
                                    this.diligences.set(validDiligences);
                                    this.localDiligences.set(validDiligences);
                                    this.localNotifications.set(validNotificationIds);

                                    this.addresses.set(
                                        validDiligences
                                            .map(diligence => diligence.address)
                                            .filter((address): address is Address => address !== undefined)
                                    );
                                    this.updateDiligencesProgress();
                                    this.getNextDiligence();
                                } else {
                                    this.showToast(result.error)
                                }
                            })
                    }
                });
            })
        })
    }
    onOrderedAddressesChange(addresses: Address[]) {
        this.orderedAddresses.set(addresses);
    }
    validateDate(date: string | Date): boolean {
        const now = new Date();
        const diligenceDate = new Date(date);
        const isToday =
            diligenceDate.getFullYear() === now.getFullYear() &&
            diligenceDate.getMonth() === now.getMonth() &&
            diligenceDate.getDate() === now.getDate();

        const result = isToday && diligenceDate.getTime() > now.getTime();
        return result
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
            this.getLastDiligenceByAttemptId(nextDiligence.attemptId)
            this.currentDiligence.set(nextDiligence)
            this.currentNotificationId.set(nextNotificationId)
            this.localNotifications.update(notifications => notifications.slice(1))
            this.localDiligences.update(diligences => diligences.slice(1))
        }
        this.loadingNextDiligence.set(false)
    }
    async updateDiligencesProgress() {
        for (const diligence of this.localDiligences()) {
            const result =
                await this.diligencesService.patchDiligenceProgress(
                    {
                        id: diligence.id,
                        inProgress: true,
                        notificatorId: this.notificatorId()!,
                        notificatorName: this.currentUser()?.name!,
                        start: new Date()
                    }
                );

            if (!result.success) {
                this.showToast(
                    "Erro ao atualizar progresso da diligência."
                );
            }
        }
    }
    updateDiligenceProgress(id: string) {
        this.diligencesService.patchDiligenceProgress(
            {
                id,
                inProgress: false,
                notificatorId: this.notificatorId()!,
                notificatorName: this.currentUser()?.name!,
                start: new Date()
            }
        ).then(result => {
            if (!result.success) {
                this.showToast("Erro ao atualizar progresso da diligência.");
            }
        });
    }
    getLastDiligenceByAttemptId(id: string) {
        this.attemptService.getById(id).then(result => {
            if (result.success) {
                this.currentLastDiligence.set(result.data.lastDiligence)
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