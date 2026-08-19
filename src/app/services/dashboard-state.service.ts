import { Injectable, signal } from '@angular/core';
import { DashboardSection } from '../models/dashboard-section';
import { dashboardSections } from '../dashboard/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class DashboardStateService {

  activeSection = signal<DashboardSection>(dashboardSections[0]);
  breadCrumbs = signal<string>('');

  setActiveSection(section: DashboardSection) {
    this.activeSection.set(section);
  }
  setBreadCrumbs(breadCrumbs:string) {
    this.breadCrumbs.set(breadCrumbs);
  }
}