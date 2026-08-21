import { Injectable, signal } from '@angular/core';

export interface DiligencesFilter {
    debtor: string;
    protocol: string;
    status:string;
    fromDate: string;
    toDate: string;
}

@Injectable({ providedIn: 'root' })
export class AttemptsFilterService {

    filter = signal<DiligencesFilter>({
        debtor: '',
        protocol: '',
        status:'',
        fromDate: '',
        toDate: '',
    });

    updateFilter(partial: Partial<DiligencesFilter>): void {
        this.filter.update(f => ({
            ...f,
            ...partial
        }));
    }
}