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

@Component({
    selector: 'app-planning',
    imports: [MatSidenavModule, AddressesSectionComponent, MapSectionComponent],
    templateUrl: './planning.component.html',
})
export class PlanningComponent implements OnInit {
    activeSection: DashboardSection = { name: 'Planejamento', icon: 'history', path: '/planejamento' };
    attempt?: Attempt;
    debtor?: Debtor;
    addresses = signal<Address[]>([]);
    attemptsService: AttemptsService = inject(AttemptsService);
    addressesService: AddressesService = inject(AddressesService);
    debtorService: DebtorService = inject(DebtorService);
    private dashboardState = inject(DashboardStateService);
    constructor(private route: ActivatedRoute) {
        this.dashboardState.setActiveSection({
            name: 'Planejamento',
            icon: 'checklist',
            path: 'planejamento'
        });
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id') ?? '';
            if (id) {
                this.dashboardState.setActiveSection({ icon: 'checklist', name: 'Planejamento / ' + id, path: '/planejamento/ ' + id });
                this.getAndBuildAttempt(id);
                this.getAndBuildAddresses(id);
                this.getAndBuildInstallments(id);
                this.getAndBuildDebtor(id);
                this.getAndBuildRoute(id);
            }
        });
    }
    getAndBuildAttempt(id: string): void {
        this.attemptsService.getAttemptById(id).then(attempt => {
            this.attempt = attempt;
        });
    }
    getAndBuildAddresses(attemptId: string): void {
        this.addressesService.getAddressByAttemptId(attemptId).then(addresses => {
            this.addresses.set(addresses);
        });
    }
    getAndBuildInstallments(attemptId: string): void { }
    getAndBuildDebtor(attemptId: string): void {
        this.debtorService.getDebtorByAttemptId(attemptId).then(debtor => {
            this.debtor = (debtor);
        });
    }
    getAndBuildRoute(attemptId: string): void { }
}
