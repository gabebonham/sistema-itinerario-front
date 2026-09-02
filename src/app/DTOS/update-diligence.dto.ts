import { DiligenceOrdinal } from "../models/diligence";

export interface UpdateDiligenceDTO {
    protocol?: string;
    start?: Date;
    finish?: Date;
    notificatorName?: string;
    debtorName?: string;
    window?: string;
    factsObservations?: string[]
    propertyObservations?: string[]
    generalObservations?: string[]
    diligenceOrdinal?: DiligenceOrdinal;
    porHoraCerta?: boolean;
    plannerObservations?: string;
    imageUrls?: string[];
    audioUrls?: string[];
    wasDebtorFound:boolean
    visited?:boolean
    attemptId?:string
}
