export class Itinerary {
    id: string;
    debtorId: string;
    lastAttemptId: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(
        id: string,
        debtorId: string,
        lastAttemptId: string,
        createdAt: Date,
        updatedAt: Date,
    ) {
        this.id = id;
        this.debtorId = debtorId;
        this.lastAttemptId = lastAttemptId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}