import { Component, inject, OnInit, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { AddressesSectionComponent } from './addresses-section/addresses-section.component';
import { AddressesService } from '../../services/addresses.service';
import { Address, AddressEntry } from '../../models/address';
import { DashboardSection } from '../../models/dashboard-section';
import { DashboardStateService } from '../../services/dashboard-state.service';
import { MapSectionComponent } from './map-section/map-section.component';
import { Debtor } from '../../models/debtor';
import { DebtorService } from '../../services/debtor.service';
import { dashboardSections } from '../constants/constants';
import { WindowComponent } from './windows-section/window.component';
import { AttemptService } from '../../services/attempt.service';
import { MatDialog } from '@angular/material/dialog';
import { SendToFieldModal } from './send-to-field-modal/send-to-field-modal.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Attempt } from '../../models/attempt';
import { Diligence, WindowEntry } from '../../models/diligence';
import { CreateDiligenceDTO } from '../../DTOS/create-attempt.dto';
import { DiligencesService } from '../../services/diligences.service';
import { CreateAddressDTO } from '../../DTOS/create-address.dto';
import { PlaceSuggestion } from '../../DTOS/place-sugestion';
import { NotificationService } from '../../services/notification.service';
import { CreateNotificationDto } from '../../DTOS/create-notification.dto';
import { runInThisContext } from 'vm';

@Component({
    selector: 'app-planning',
    imports: [
        MatSidenavModule,
        AddressesSectionComponent,
        MapSectionComponent,
        WindowComponent,
        MatSnackBarModule
    ],
    templateUrl: './planning.component.html',
})
export class PlanningComponent implements OnInit {
    private snackBar = inject(MatSnackBar);
    private dashboardState = inject(DashboardStateService);
    activeSection: DashboardSection = dashboardSections.find(section => section.name == 'Tentativas')!;
    breadCrumbs: string = ''

    isAddressesLoading = signal(true)
    isAttemptLoading = signal(true)
    isAddressReady = signal(false)
    isWindowReady = signal(false)

    attempt = signal<Attempt | undefined>(undefined);
    debtor = signal<Debtor | undefined>(undefined);
    diligences = signal<Diligence[]>([]);
    place = signal<PlaceSuggestion | undefined>(undefined);
    addresses = signal<Address[]>([])

    newAddress = signal<CreateAddressDTO | undefined>(undefined);
    windowEntry = signal<WindowEntry | undefined>(undefined);

    attemptService: AttemptService = inject(AttemptService);
    diligencesService: DiligencesService = inject(DiligencesService);
    addressesService: AddressesService = inject(AddressesService);
    debtorService: DebtorService = inject(DebtorService);
    notificationService: NotificationService = inject(NotificationService);

    constructor(
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private router: Router
    ) {
        this.dashboardState.setActiveSection(dashboardSections.find(section => section.name == 'Tentativas')!);
    }
    onUpdatePlace(place?: PlaceSuggestion) {
        this.place.set(place)
    }
    onWindowReady() {
        this.isWindowReady.set(true)
    }
    onAddressReady() {
        this.isAddressReady.set(true)
    }
    canSendToField() {
        return this.isAddressReady() && this.isWindowReady()
    }
    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id') ?? '';
            if (id) {
                this.dashboardState.setActiveSection(dashboardSections.find(section => section.name == 'Tentativas')!);
                this.dashboardState.setBreadCrumbs(this.dashboardState.activeSection().getNameWithId(id));
                this.breadCrumbs = this.activeSection.getPathWithId(id)
                this.getAndBuildAttempt(id);
            }
        });
    }

    onBuildAddress(dto: CreateAddressDTO) {
        this.newAddress.set(dto)
    }
    onBuildWindow(entry: WindowEntry) {
        this.windowEntry.set(entry)
    }
    buildNewDiligence(): Partial<CreateDiligenceDTO> | null {
        if (!this.attempt()) return null;
        let newDiligence = null;
        if (this.windowEntry() && this.attempt()) {
            newDiligence = {
                finish: this.windowEntry()?.finish,
                start: this.windowEntry()?.start,
                window: this.windowEntry()?.window,
                diligenceOrdinal: this.windowEntry()?.diligenceOrdinal,
                attemptId: this.attempt()?.id,
                status: 'Pending',
                debtorId: this.attempt()?.debtorId,
                debtorName: this.attempt()?.debtor?.name,
                protocol: this.attempt()?.protocol,
            } as Partial<CreateDiligenceDTO>
        }
        return newDiligence;
    }

    showToast(text: string) {
        this.snackBar.open(text, 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
        });
    }

    getAndBuildAttempt(id: string): void {
        this.attemptService.getById(id).then(result => {
            if (result.success) {
                const attempt = result.data
                const diligences = result.data.diligences ?? []
                const addresses = diligences
                    .map(diligence => diligence.address)
                    .filter((address): address is Address => address !== undefined);
                const debtor = attempt.debtor;

                this.debtor.set(debtor)
                this.attempt.set(attempt)
                this.diligences.set(diligences);
                this.addresses.set(addresses)

                this.isAddressesLoading.set(false);
                this.isAttemptLoading.set(false)
            } else {
                this.showToast("Erro ao buscar tentativa.")
            }
        });
    }

    openModal() {
        const diligence = this.buildNewDiligence()
        const ref = this.dialog.open(SendToFieldModal, {
            width: '1200px',
            height: '500px',
            data: { diligence }
        });
        ref.afterClosed().subscribe((result: Diligence) => {
            if (!result) {
                return;
            }
            this.handleCreateAddress(result.id)
            this.handleCreateNotification(result.notificatorId, result.debtorId, result.id)

        });
    }
    buildNewAddress(diligenceId: string) {
        return { ...this.newAddress(), diligenceId, debtorId: this.attempt()?.debtorId } as CreateAddressDTO
    }

    handleCreateAddress(diligenceId: string) {
        if (this.newAddress()) {
            const newAddress = this.buildNewAddress(diligenceId)
            this.addressesService.create(newAddress).then(addressResult => {
                if (addressResult.success) {
                    this.router.navigate(['/dashboard/tentativas'])
                } else {
                    this.showToast("Erro ao registrar endereço.")
                }
            })
        }
    }
    handleCreateNotification(notificatorId: string, debtorId: string, diligenceId: string) {
        const dto: CreateNotificationDto = {
            debtorId,
            diligenceId
        }
        this.notificationService.create(dto).then(result => {
            if (result.success) {
                
            } else {
                this.showToast('Erro ao disparar notificação.')
            }
        })
    }
}