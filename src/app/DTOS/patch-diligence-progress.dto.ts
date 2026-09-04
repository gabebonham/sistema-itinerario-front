export interface PatchDiligenceDto {
    id: string, 
    inProgress: boolean,
    notificatorId?: string,
    notificatorName?: string, 
    start?:Date,
    finish?:Date
}