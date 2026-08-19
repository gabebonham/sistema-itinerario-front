import { Injectable, signal } from '@angular/core';

export interface DiligencesFilter {
  search: string;
  status: string;
  window: string;
  diligence: string;
  fromDate: string;
  toDate: string;
}

@Injectable({ providedIn: 'root' })
export class DiligencesFilterService {
  filter = signal<DiligencesFilter>({
    search: '',
    status: '',
    window: '',
    diligence: '',
    fromDate: '',
    toDate: '',
  });

  updateFilter(partial: Partial<DiligencesFilter>): void {
    this.filter.update(f => ({ ...f, ...partial }));
  }
}