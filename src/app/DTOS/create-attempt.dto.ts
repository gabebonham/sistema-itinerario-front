import { DiligenceOrdinal, DiligenceStatus } from "../models/diligence";

export interface CreateDiligenceDTO { 
    status: DiligenceStatus;
    start: Date;
    finish: Date;
    notificatorId: string;
    window: string;
    diligenceOrdinal: DiligenceOrdinal;
    attemptId: string;
    observation:string;
}