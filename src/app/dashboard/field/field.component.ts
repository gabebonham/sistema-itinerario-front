import { Component, Input } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DashboardHeaderComponent } from '../components/header.component';


interface DashboardSection {
    name: string;
    icon: string;
}
@Component({
  selector: 'app-field',
  imports: [MatSidenavModule, DashboardHeaderComponent],
  templateUrl: './field.component.html',
})
export class FieldComponent {
    activeSection: DashboardSection = { name: 'Campo', icon: 'location_on' };

}
