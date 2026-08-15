import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './dashboard/dashboard-layout.component';
import { AttemptsComponent } from './dashboard/attempts/attempts.component';
import { PlanningComponent } from './dashboard/planning/planning.component';
import { FieldComponent } from './dashboard/field/field.component';

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
            { path: 'planejamento', component: AttemptsComponent },
            { path: 'campo', component: FieldComponent },
            { path: '', redirectTo: 'planejamento', pathMatch: 'full' },
            {
                path: 'planejamento/:id',
                component: PlanningComponent,
            },
        ]
    },

];
