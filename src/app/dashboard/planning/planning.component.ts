import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DashboardHeaderComponent } from '../components/header.component';
interface DashboardSection {
    name: string;
    icon: string;
}
@Component({
  selector: 'app-planning',
  imports: [MatSidenavModule, DashboardHeaderComponent],
  templateUrl: './planning.component.html',
})
export class PlanningComponent {
    activeSection: DashboardSection = { name: 'Planejamento', icon: 'tune' };

}
