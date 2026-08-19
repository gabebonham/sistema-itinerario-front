import { Address } from "./address";

export type DiligenceStatus = 'Entregue' | 'Pendente' | 'Cancelada'
export type DiligenceOrdinal = '1ª Diligência' | '2ª Diligência' | '3ª Diligência';
export interface WindowEntry {
    new:boolean
    start: Date;
    finish: Date;
    window: string;
    diligenceOrdinal: DiligenceOrdinal;
}
export class Diligence {
    id: string;
    status: DiligenceStatus
    protocol: string;
    start: Date;
    finish: Date;
    agentName: string;
    debtorName: string;
    window: string;
    concludedVisitNumber: number;
    diligenceOrdinal: DiligenceOrdinal;
    installmentsNumber: number;
    attemptId: string;
    address?: Address
    createdAt: Date;
    updatedAt: Date;
    constructor(
        id: string,
        status: DiligenceStatus,
        protocol: string,
        start: Date,
        finish: Date,
        agentName: string,
        debtorName: string,
        window: string,
        concludedVisitNumber: number,
        diligenceOrdinal: DiligenceOrdinal,
        installmentsNumber: number,
        attemptId: string,
        createdAt: Date,
        updatedAt: Date,
        address?: Address,
    ) {
        this.id = id;
        this.debtorName = debtorName;
        this.status = status;
        this.window = window;
        this.agentName = agentName;
        this.protocol = protocol;
        this.start = start;
        this.finish = finish;
        this.attemptId = attemptId;
        this.installmentsNumber = installmentsNumber;
        this.diligenceOrdinal = diligenceOrdinal;
        this.concludedVisitNumber = concludedVisitNumber;
        this.address = address;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}