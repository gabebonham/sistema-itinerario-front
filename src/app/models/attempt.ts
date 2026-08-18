import { Address } from "./address";

export type AttemptStatus = 'Entregue' | 'Pendente'
export type AttemptOrdinal = '1ª Tentativa' | '2ª Tentativa' | '3ª Tentativa';
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
    addresses?: Address[]
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
        addresses?: Address[],
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
        this.addresses = addresses;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}