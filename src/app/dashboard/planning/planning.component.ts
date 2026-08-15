import { Component, inject, OnInit, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DashboardHeaderComponent } from '../components/header.component';
import { ActivatedRoute } from '@angular/router';
import { Attempt } from '../../models/attempt';
import { AttemptsService } from '../../services/attempts.service';
import { AddressesSectionComponent } from './addresses-section/addresses-section.component';
import { AddressesService } from '../../services/addresses.service';
import { Address } from '../../models/address';
interface DashboardSection {
    name: string;
    icon: string;
}
@Component({
    selector: 'app-planning',
    imports: [MatSidenavModule, DashboardHeaderComponent, AddressesSectionComponent],
    templateUrl: './planning.component.html',
})
export class PlanningComponent implements OnInit {
    activeSection: DashboardSection = { name: 'Planejamento', icon: 'tune' };
    attempt?: Attempt;
    addresses = signal<Address[]>([]);
    attemptsService: AttemptsService = inject(AttemptsService);
    addressesService: AddressesService = inject(AddressesService);
    constructor(private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id') ?? '';
            if (id) {
                this.activeSection = {icon:'tune', name:'Tentativa / '+ id}
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
    getAndBuildDebtor(attemptId: string): void { }
    getAndBuildRoute(attemptId: string): void { }
}
