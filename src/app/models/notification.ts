import { Attempt } from "./attempt";
import { Diligence, DiligenceOrdinal } from "./diligence";

export interface NotificationEntry {
    id: string;
    notificatorName: string;
    diligenceOrdinal: DiligenceOrdinal;
    diligenceWindow: string;
    diligenceStart: Date;
    diligenceFinish: Date;
    address: string;
    debtorName: string;
    protocol: string;
    createdAt: Date;
}
export class Notification {
    id: string;
    notificatorId: string;
    attemptId: string;
    diligenceId: string;
    diligence?: Diligence
    attempt?: Attempt
    debtorId: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(
        id: string,
        notificatorId: string,
        attemptId: string,
        diligenceId: string,
        debtorId: string,
        createdAt: Date,
        updatedAt: Date,
        diligence?: Diligence,
        attempt?: Attempt,
    ) {
        this.id = id
        this.notificatorId = notificatorId
        this.attemptId = attemptId
        this.diligenceId = diligenceId
        this.diligence = diligence
        this.debtorId = debtorId
        this.attempt = attempt
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }
}