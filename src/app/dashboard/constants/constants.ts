import { DashboardSection } from "../../models/dashboard-section";

export const dashboardSections: DashboardSection[] = [
    new DashboardSection('Tentativas', 'route', '/tentativas', 'Planejador'),
    new DashboardSection('Notificações', 'notifications', '/notificacoes', 'Notificador'),
    new DashboardSection('Histórico', 'history', '/historico', 'Planejador'),
    new DashboardSection('Notificadores', 'badge', '/notificadores', 'Planejador')
];