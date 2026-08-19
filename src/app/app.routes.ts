import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './dashboard/dashboard-layout.component';
import { FieldComponent } from './dashboard/field/field.component';
import { PlanningComponent } from './dashboard/planning/planning.component';
import { HistoryComponent } from './dashboard/history/history.component';
import { AttemptComponent } from './dashboard/attempt/attempt.component';

export const routes: Routes = [
    // {
    //     path: 'auth',
    //     component: AuthComponent,
    //     canActivate: [guestGuard], // autenticado → vai pro dashboard
    // },
    {
        path: 'dashboard',
        component: DashboardLayoutComponent,
        // canActivate: [authGuard], // não autenticado → vai pro auth
        children: [
            { path: 'tentativas', component: AttemptComponent },
            { path: 'tentativas/:id', component: PlanningComponent},
            { path: 'campo', component: FieldComponent },
            { path: 'historico', component: HistoryComponent },
            { path: '', redirectTo: 'tentativas', pathMatch: 'full' },
        ]
    },
];
