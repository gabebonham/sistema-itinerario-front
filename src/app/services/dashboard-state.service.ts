import { Injectable, signal } from '@angular/core';
import { DashboardSection } from '../models/dashboard-section';



@Injectable({
  providedIn: 'root'
})
export class DashboardStateService {

  activeSection = signal<DashboardSection>({
    name: 'Tentativas',
    icon: 'checklist',
    path:'/tentativas'
  });

  setActiveSection(section: DashboardSection) {
    this.activeSection.set(section);
  }
}