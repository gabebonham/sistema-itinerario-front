import { Component, Input } from '@angular/core';
import { MatIcon } from "@angular/material/icon";

interface DashboardSection {
    name: string;
    icon: string;
}
@Component({
    selector: 'app-dashboard-header',
    templateUrl: './header.component.html',
    standalone: true,
    imports: [MatIcon],

})
export class DashboardHeaderComponent {
    @Input() activeSection: DashboardSection = { name: '', icon: '' };
}
