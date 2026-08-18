import { Component, inject, OnInit, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';
import { Attempt } from '../../models/attempt';
import { AttemptsService } from '../../services/attempts.service';
import { AddressesSectionComponent } from './addresses-section/addresses-section.component';
import { AddressesService } from '../../services/addresses.service';
import { Address } from '../../models/address';
import { DashboardSection } from '../../models/dashboard-section';
import { DashboardStateService } from '../../services/dashboard-state.service';
import { MapSectionComponent } from './map-section/map-section.component';
import { Debtor } from '../../models/debtor';
import { DebtorService } from '../../services/debtor.service';
import { dashboardSections } from '../constants/constants';
import { WindowComponent } from './windows-section/window.component';
import { Itinerary } from '../../models/itinerary';
import { ItineraryService } from '../../services/itinerary.service';

@Component({
    selector: 'app-planning',
    imports: [MatSidenavModule, AddressesSectionComponent, MapSectionComponent, WindowComponent],
    templateUrl: './planning.component.html',
})
export class PlanningComponent implements OnInit {
    activeSection: DashboardSection = dashboardSections.find(section => section.name == 'Itinerário')!;
    debtor?: Debtor;
    itinerary?: Itinerary;
    breadCrumbs: string = ''
    isAddressesLoading = true
    addresses = signal<Address[]>([]);
    attempts = signal<Attempt[]>([]);
    itineraryService: ItineraryService = inject(ItineraryService);
    attemptsService: AttemptsService = inject(AttemptsService);
    addressesService: AddressesService = inject(AddressesService);
    debtorService: DebtorService = inject(DebtorService);
    private dashboardState = inject(DashboardStateService);
    constructor(private route: ActivatedRoute) {
        this.dashboardState.setActiveSection(dashboardSections.find(section => section.name == 'Itinerário')!);
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id') ?? '';
            if (id) {
                this.dashboardState.setActiveSection(dashboardSections.find(section => section.name == 'Itinerário')!);
                this.dashboardState.setBreadCrumbs(this.dashboardState.activeSection().getNameWithId(id));
                this.breadCrumbs = this.activeSection.getPathWithId(id)
                this.getAndBuildItinerary(id);
                this.getAndBuildAddresses(id);
                this.getAndBuildInstallments(id);
                this.getAndBuildDebtor(id);
                this.getAndBuildRoute(id);
            }
        });
    }
    getAndBuildItinerary(id: string): void {
        this.itineraryService.getAttemptsByItineraryId(id).then(result => {
            this.attempts.set(result.data);
        });
    }
    getAndBuildAddresses(attemptId: string): void {
        this.addressesService.getAddressByAttemptId(attemptId).then(addresses => {
            this.addresses.set(addresses);
        });
        this.isAddressesLoading = false
    }
    getAndBuildInstallments(attemptId: string): void { }
    getAndBuildDebtor(attemptId: string): void {
        this.debtorService.getDebtorByAttemptId(attemptId).then(debtor => {
            this.debtor = (debtor);
        });
    }
    getAndBuildRoute(attemptId: string): void { }
}
