import { Injectable, signal } from '@angular/core';

export interface AttemptsFilter {
  search: string;
  status: string;
  window: string;
  attempt: string;
  fromDate: string;
  toDate: string;
}

@Injectable({ providedIn: 'root' })
export class AttemptsFilterService {
  filter = signal<AttemptsFilter>({
    search: '',
    status: '',
    window: '',
    attempt: '',
    fromDate: '',
    toDate: '',
  });

  updateFilter(partial: Partial<AttemptsFilter>): void {
    this.filter.update(f => ({ ...f, ...partial }));
  }
}