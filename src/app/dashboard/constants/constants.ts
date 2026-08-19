import { DashboardSection } from "../../models/dashboard-section";

export const dashboardSections: DashboardSection[] = [
    new DashboardSection('Tentativas', 'route', '/tentativas', ['planner']),
    new DashboardSection('Campo', 'location_on', '/campo', ['planner', 'field']),
    new DashboardSection('Histórico', 'history', '/historico', ['planner'])
];