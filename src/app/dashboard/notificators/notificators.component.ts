import { Component, inject, OnInit, signal } from '@angular/core';
import { DashboardSection } from '../../models/dashboard-section';
import { DashboardStateService } from '../../services/dashboard-state.service';
import { dashboardSections } from '../constants/constants';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificatorsSection } from './notificators-section/notificators-section.component';

@Component({
    selector: 'app-notificators',
    imports: [MatSnackBarModule, NotificatorsSection],
    templateUrl: './notificators.component.html',
})
export class NotificatorsComponent implements OnInit {
    private dashboardState = inject(DashboardStateService);
    activeSection: DashboardSection = dashboardSections.find(section => section.name == 'Notificadores')!;
    private userService = inject(UserService)
    notificators = signal<User[]>([])
    isLoading = signal(true)
    private snackBar = inject(MatSnackBar);
    constructor() {
        this.dashboardState.setActiveSection(dashboardSections.find(section => section.name == 'Notificadores')!);
        this.dashboardState.setBreadCrumbs(this.dashboardState.activeSection().name);
    }
    ngOnInit(): void {
        this.userService.getAllByRole(1, 100, 'Notificador').then(result => {
            if (result.success) { this.notificators.set(result.data.data); this.isLoading.set(false) }
            else { this.showToast('Erro ao carregar notificadores.') }
        })
    }
    showToast(text: string) {
        this.snackBar.open(text, 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
        });
    }
}