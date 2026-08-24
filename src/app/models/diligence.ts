import { Address } from "./address";

export type DiligenceOrdinal = '1ª Diligência' | '2ª Diligência' | '3ª Diligência';
export interface WindowEntry {
    new: boolean
    start: Date;
    finish: Date;
    window: string;
    diligenceOrdinal: DiligenceOrdinal;
}
export class Diligence {
    id: string;
    protocol: string;
    start: Date;
    finish: Date;
    notificatorName: string;
    debtorName: string;
    window: string;
    factsObservations: string[];
    propertyObservations: string[];
    generalObservations: string[];
    concludedVisitNumber: number;
    diligenceOrdinal: DiligenceOrdinal;
    attemptId: string;
    address?: Address;
    porHoraCerta: boolean;
    plannerObservations?: string;
    imageUrls?: string[];
    audioUrl?: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(
        id: string,
        protocol: string,
        start: Date,
        finish: Date,
        notificatorName: string,
        debtorName: string,
        window: string,
        factsObservations: string[],
        propertyObservations: string[],
        generalObservations: string[],
        concludedVisitNumber: number,
        diligenceOrdinal: DiligenceOrdinal,
        attemptId: string,
        createdAt: Date,
        updatedAt: Date,
        porHoraCerta: boolean,
        imageUrls?: string[],
        audioUrl?: string,
        plannerObservations?: string,
        address?: Address,
    ) {
        this.id = id;
        this.debtorName = debtorName;
        this.window = window;
        this.notificatorName = notificatorName;
        this.protocol = protocol;
        this.start = start;
        this.factsObservations = factsObservations;
        this.propertyObservations = propertyObservations;
        this.generalObservations = generalObservations;
        this.finish = finish;
        this.attemptId = attemptId;
        this.diligenceOrdinal = diligenceOrdinal;
        this.concludedVisitNumber = concludedVisitNumber;
        this.address = address;
        this.porHoraCerta = porHoraCerta;
        this.plannerObservations = plannerObservations;
        this.imageUrls = imageUrls;
        this.audioUrl = audioUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}