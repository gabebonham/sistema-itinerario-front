import { Injectable, signal } from '@angular/core';
import { DiligenceOrdinal } from '../models/diligence';
import { AttemptStatus, DisplayAttemptStatus } from '../models/attempt';

export interface AttemptsFilter {
    protocol: string;
    debtorName: string;
    window:string;
    diligenceOrdinal:DiligenceOrdinal|'';
    status:DisplayAttemptStatus|'';
    from: string;
    to: string;
}

@Injectable({ providedIn: 'root' })
export class AttemptsFilterService {

    filter = signal<AttemptsFilter>({
        protocol: '',
        debtorName: '',
        window:'',
        diligenceOrdinal:'',
        status:'',
        from: '',
        to: '',
    });

    updateFilter(partial: Partial<AttemptsFilter>): void {
        this.filter.update(f => ({
            ...f,
            ...partial
        }));
    }
}