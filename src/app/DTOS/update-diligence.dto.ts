export interface UpdateDiligenceDTO {
    factsObservations?: string | null,
    generalObservations?: string | null,
    propertyObservations?: string | null,
    audioUrl?: string |null,
    imageUrls?: string[] |null,
    wasDebtorFound: boolean
}