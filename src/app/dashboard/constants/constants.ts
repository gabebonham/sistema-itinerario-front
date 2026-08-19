import { DashboardSection } from "../../models/dashboard-section";

export const dashboardSections: DashboardSection[] = [
    new DashboardSection('Tentativas', 'route', '/tentativas', ['planner']),
    new DashboardSection('Campo', 'location_on', '/campo', ['notificator']),
    new DashboardSection('Histórico', 'history', '/historico', ['planner']),
    new DashboardSection('Notificadores', 'badge', '/notificadores', ['planner'])
];