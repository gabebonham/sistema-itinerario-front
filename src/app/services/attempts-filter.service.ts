import { Injectable, signal } from '@angular/core';
import { DiligenceOrdinal } from '../models/diligence';
import { DisplayAttemptStatus } from '../models/attempt';

export interface AttemptsFilter {
    protocol: string;
    debtorName: string;
    window:string;
    diligenceOrdinal:DiligenceOrdinal|'';
    statuses:DisplayAttemptStatus[];
    from: string;
    to: string;
    diligenceVisited: boolean;
}

@Injectable({ providedIn: 'root' })
export class AttemptsFilterService {

    filter = signal<AttemptsFilter>({
        protocol: '',
        debtorName: '',
        window:'',
        diligenceOrdinal:'',
        statuses:[],
        from: '',
        to: '',
        diligenceVisited: true
    });

    updateFilter(partial: Partial<AttemptsFilter>): void {
        this.filter.update(f => ({
            ...f,
            ...partial
        }));
    }
}