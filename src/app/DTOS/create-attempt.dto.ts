import { AttemptStatus } from "../models/attempt";
import { DiligenceOrdinal } from "../models/diligence";

export interface CreateDiligenceDTO {
    protocol: string;
    start: Date;
    finish: Date;
    notificatorName: string;
    debtorName: string;
    window: string;
    factsObservations?: string[]
    propertyObservations?: string[]
    generalObservations?: string[]
    diligenceOrdinal: DiligenceOrdinal;
    attemptId: string;
    debtorId: string;
    notificatorId: string;
    status:AttemptStatus;
    porHoraCerta?: boolean;
    plannerObservations?: string;
    imageUrls?: string[];
    audioUrl?: string;
}