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

    attempt = signal<Attempt | undefined>(undefined);
    debtor = signal<Debtor | undefined>(undefined);
    addresses = signal<Address[]>([]);
    diligences = signal<Diligence[]>([]);
    addressName = signal<string|undefined>(undefined);

    addressEntry?: AddressEntry;
    windowEntry?: WindowEntry;

    attemptService: AttemptService = inject(AttemptService);
    diligencesService: DiligencesService = inject(DiligencesService);
    addressesService: AddressesService = inject(AddressesService);
    debtorService: DebtorService = inject(DebtorService);

    constructor(
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private router: Router
    ) {
        this.dashboardState.setActiveSection(dashboardSections.find(section => section.name == 'Tentativas')!);
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id') ?? '';
            if (id) {
                this.dashboardState.setActiveSection(dashboardSections.find(section => section.name == 'Tentativas')!);
                this.dashboardState.setBreadCrumbs(this.dashboardState.activeSection().getNameWithId(id));
                this.breadCrumbs = this.activeSection.getPathWithId(id)
                this.getAndBuildAttempt(id);
                this.getAndBuildDebtor(id);
            }
        });
    }

    buildNewAddress(address: AddressEntry, diligenceId: string) {
        return {
            diligenceId,
            city: address.city,
            complement: address.complement,
            country: address.country,
            zipCode: address.zipCode,
            street: address.street,
            state: address.state,
            number: address.number,
            lat: address.lat,
            lng: address.lng,
            name:this.addressName(),
            neighborhood: address.neighborhood
        } as CreateAddressDTO
    }

    buildNewDiligence(observation: string, notificatorId: string, notificatorName: string): CreateDiligenceDTO | null {
        if (!this.attempt()) return null;
        let newDiligence = null;
        if (this.windowEntry && this.attempt) {
            newDiligence = {
                finish: this.windowEntry.finish,
                start: this.windowEntry.start,
                window: this.windowEntry.window,
                observation,
                notificatorId,
                diligenceOrdinal: this.windowEntry.diligenceOrdinal,
                attemptId: this.attempt()?.id,
                status: 'Pendente',
                debtorId: this.attempt()?.debtorId,
                debtorName: this.attempt()?.debtor?.name,
                protocol: this.attempt()?.protocol,
                notificatorName
            } as CreateDiligenceDTO
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
            this.diligences.set(result.data.diligences ?? []);
            this.getAndBuildAddresses();
            this.isAttemptLoading.set(false)
        });
    }

    getAndBuildAddresses(): void {
        const addresses = this.diligences()
            .map(diligence => diligence.address)
            .filter((address): address is Address => address !== undefined);

        this.addresses.set(addresses);
        this.isAddressesLoading.set(false);
    }

    getAndBuildDebtor(diligenceId: string): void {
        this.diligencesService.getDiligenceById(diligenceId).then(result => {
            if (result.success) {
                this.debtor.set(result.data.debtor);
            } else {
                this.showToast("Erro ao buscar devedor.")
            }
        });
    }

    openModal() {
        const ref = this.dialog.open(SendToFieldModal, {
            width: '1200px',
            height: '500px',
            data: {}
        });
        ref.afterClosed().subscribe(result => {
            if (!result) {
                return;
            }
            if (result.success) {
                this.createDiligenceAndAddress(result.data.observation, result.data.notificatorId, result.data.notificatorName)
            }
        });
    }
    onUpdateaddressName(name:string) {
        this.addressName.set(name)
    }
    createDiligenceAndAddress(observation: string, notificatorId: string, notificatorName: string) {
        const newDiligence = this.buildNewDiligence(observation, notificatorId, notificatorName)
        if (newDiligence) {
            this.diligencesService.create(newDiligence).then(diligenceResult => {
                if (diligenceResult.success) {
                    this.handleCreateAddress(diligenceResult.data.id)
                }
            })
        } else {
            this.showToast('Erro ao criar diligência. Janela não foi criada ou sem vínculo com tentativa.');
        }
    }
    handleCreateAddress(diligenceId: string) {
        if (this.addressEntry) {
            const newAddress = this.buildNewAddress(this.addressEntry, diligenceId)
            this.addressesService.create(newAddress).then(addressResult => {
                if (addressResult.success)
                    this.router.navigate(['/dashboard/tentativas'])
            })
        } else {
            this.showToast('Erro ao criar diligência. Endereço não foi criado.');
        }
    }
}