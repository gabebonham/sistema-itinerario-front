import { Address } from "./address";

export type AttemptStatus = 'Entregue' | 'Pendente'
export type AttemptOrdinal = '1ª Tentativa' | '2ª Tentativa' | '3ª Tentativa';
export interface WindowEntry {
    new:boolean
    start: Date;
    finish: Date;
    window: string;
}
export class Attempt {
    id: string;
    status: AttemptStatus
    protocol: string;
    start: Date;
    finish: Date;
    agentName: string;
    debtorName: string;
    window: string;
    concludedVisitNumber: number;
    attemptOrdinal: AttemptOrdinal;
    installmentsNumber: number;
    itineraryId: string;
    address?: Address
    createdAt: Date;
    updatedAt: Date;
    constructor(
        id: string,
        status: AttemptStatus,
        protocol: string,
        start: Date,
        finish: Date,
        agentName: string,
        debtorName: string,
        window: string,
        concludedVisitNumber: number,
        attemptOrdinal: AttemptOrdinal,
        installmentsNumber: number,
        itineraryId: string,
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
        this.itineraryId = itineraryId;
        this.installmentsNumber = installmentsNumber;
        this.attemptOrdinal = attemptOrdinal;
        this.concludedVisitNumber = concludedVisitNumber;
        this.address = address;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}