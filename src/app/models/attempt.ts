import { Debtor } from "./debtor";
import { Diligence } from "./diligence";

export type AttemptStatus = 'Delivered' | 'Pending' | 'Cancelled'
export type DisplayAttemptStatus = 'Entregue' | 'Pendente' | 'Cancelada'

export class Attempt {
    id: string;
    status: DisplayAttemptStatus;
    debtorId: string;
    debtor?: Debtor;
    protocol: string;
    lastDiligenceId: string;
    concludedVisitNumber: number;
    diligences?: Diligence[]
    lastDiligence?: Diligence
    createdAt: Date;
    updatedAt: Date;
    constructor(
        id: string,
        status: DisplayAttemptStatus,
        debtorId: string,
        protocol: string,
        concludedVisitNumber: number,
        lastDiligenceId: string,
        createdAt: Date,
        updatedAt: Date,
        lastDiligence?: Diligence,
        diligences?: Diligence[],
        debtor?: Debtor,
    ) {
        this.id = id;
        this.status = status;
        this.protocol = protocol;
        this.diligences = diligences;
        this.concludedVisitNumber = concludedVisitNumber;
        this.debtorId = debtorId;
        this.lastDiligence = lastDiligence;
        this.lastDiligenceId = lastDiligenceId;
        this.debtor = debtor;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}