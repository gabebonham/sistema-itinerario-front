import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './dashboard/dashboard-layout.component';
import { NotificationComponent } from './dashboard/notifications/notification/notification.component';
import { PlanningComponent } from './dashboard/planning/planning.component';
import { HistoryComponent } from './dashboard/history/history.component';
import { AttemptComponent } from './dashboard/attempt/attempt.component';
import { NotificatorsComponent } from './dashboard/notificators/notificators.component';
import { NotificationsComponent } from './dashboard/notifications/notifications.component';

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
            { path: 'notificacoes', component: NotificationsComponent },
            { path: 'notificacoes/:id', component: NotificationComponent },
            { path: 'historico', component: HistoryComponent },
            { path: 'notificadores', component: NotificatorsComponent },
            { path: '', redirectTo: 'tentativas', pathMatch: 'full' },
        ]
    },
];
