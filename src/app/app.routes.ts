import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './dashboard/dashboard-layout.component';
import { ItineraryComponent } from './dashboard/itinerary/itinerary.component';
import { FieldComponent } from './dashboard/field/field.component';
import { PlanningComponent } from './dashboard/planning/planning.component';

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
            { path: 'itinerario', component: ItineraryComponent },
            { path: 'campo', component: FieldComponent },
            { path: '', redirectTo: 'itinerario', pathMatch: 'full' },
            {
                path: 'itinerario/:id',
                component: PlanningComponent,
            },
        ]
    },

];
