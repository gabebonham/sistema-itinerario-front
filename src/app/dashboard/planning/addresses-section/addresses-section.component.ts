import { Component, Input } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DashboardHeaderComponent } from '../../components/header.component';
@Component({
    selector: 'app-addresses-section',
    imports: [MatSidenavModule, DashboardHeaderComponent],
    templateUrl: './addresses-section.component.html',
})
export class AddressesSectionComponent {
}
