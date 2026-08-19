import { Diligence } from "./diligence";

export class Attempt {
    id: string;
    debtorId: string;
    protocol: string;
    lastDiligenceId: string;
    concludedVisitNumber: number;
    diligences?: Diligence[]
    createdAt: Date;
    updatedAt: Date;
    constructor(
        id: string,
        debtorId: string,
        protocol: string,
        concludedVisitNumber: number,
        lastDiligenceId: string,
        createdAt: Date,
        updatedAt: Date,
        diligences?: Diligence[],
    ) {
        this.id = id;
        this.protocol = protocol;
        this.diligences = diligences;
        this.concludedVisitNumber = concludedVisitNumber;
        this.debtorId = debtorId;
        this.lastDiligenceId = lastDiligenceId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}