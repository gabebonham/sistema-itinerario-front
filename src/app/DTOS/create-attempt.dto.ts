import { AttemptStatus } from "../models/attempt";
import { DiligenceOrdinal } from "../models/diligence";

export interface CreateDiligenceDTO { 
    status: AttemptStatus;
    start: Date;
    finish: Date;
    notificatorId: string;
    window: string;
    diligenceOrdinal: DiligenceOrdinal;
    attemptId: string;
    observation:string;
}