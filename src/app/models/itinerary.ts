import { Attempt } from "./attempt";

export class Itinerary {
    id: string;
    debtorId: string;
    lastAttemptId: string;
    attempts?: Attempt[]
    createdAt: Date;
    updatedAt: Date;
    constructor(
        id: string,
        debtorId: string,
        lastAttemptId: string,
        createdAt: Date,
        updatedAt: Date,
        attempts?: Attempt[],
    ) {
        this.id = id;
        this.attempts = attempts;
        this.debtorId = debtorId;
        this.lastAttemptId = lastAttemptId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}