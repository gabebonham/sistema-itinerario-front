import { Diligence } from "./diligence";

export type AttemptStatus = 'Entregue' | 'Pendente' | 'Cancelada'

export class Attempt {
    id: string;
    status: AttemptStatus;
    debtorId: string;
    protocol: string;
    lastDiligenceId: string;
    concludedVisitNumber: number;
    diligences?: Diligence[]
    createdAt: Date;
    updatedAt: Date;
    constructor(
        id: string,
        status: AttemptStatus,
        debtorId: string,
        protocol: string,
        concludedVisitNumber: number,
        lastDiligenceId: string,
        createdAt: Date,
        updatedAt: Date,
        diligences?: Diligence[],
    ) {
        this.id = id;
        this.status = status;
        this.protocol = protocol;
        this.diligences = diligences;
        this.concludedVisitNumber = concludedVisitNumber;
        this.debtorId = debtorId;
        this.lastDiligenceId = lastDiligenceId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}