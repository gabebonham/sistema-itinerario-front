import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './dashboard/dashboard-layout.component';
import { NotificationComponent } from './dashboard/notifications/notification/notification.component';
import { PlanningComponent } from './dashboard/planning/planning.component';
import { HistoryComponent } from './dashboard/history/history.component';
import { AttemptComponent } from './dashboard/attempt/attempt.component';
import { NotificatorsComponent } from './dashboard/notificators/notificators.component';
import { NotificationsComponent } from './dashboard/notifications/notifications.component';
import { AuthComponent } from './dashboard/auth/auth.component';
import { guestGuard } from './guards/guest.guard';
import { authGuard } from './guards/auth.guard';
import { GeneralRouteComponent } from './dashboard/notifications/general-route/general-route.component';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
        path: 'auth',
        component: AuthComponent,
        canActivate: [guestGuard], // autenticado → vai pro dashboard
    },
    {
        path: 'dashboard',
        component: DashboardLayoutComponent,
        canActivate: [authGuard], // não autenticado → vai pro auth
        children: [
            { path: 'tentativas', component: AttemptComponent },
            { path: 'tentativas/:id', component: PlanningComponent },
            { path: 'notificacoes', component: NotificationsComponent },
            { path: 'notificacoes/:id', component: NotificationComponent },
            { path: 'rota-geral/:id', component: GeneralRouteComponent },
            { path: 'historico', component: HistoryComponent },
            { path: 'notificadores', component: NotificatorsComponent },
            { path: '', redirectTo: 'tentativas', pathMatch: 'full' },
        ]
    },
];
