import { DashboardSection } from "../../models/dashboard-section";

export const dashboardSections: DashboardSection[] = [
    new DashboardSection('Itinerário', 'route', '/itinerario', ['planner']),
    new DashboardSection('Campo', 'location_on', '/campo', ['planner', 'field']),
    new DashboardSection('Histórico', 'history', '/historico', ['planner'])
];