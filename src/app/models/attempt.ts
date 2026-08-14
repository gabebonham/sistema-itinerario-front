export class Attempt {
    id: string;
    clientName: string;
    status: string;
    window: string;
    agent: string;
    date: Date;
    visitNumber: number;
    attempt: string;
    installmentsNumber: number;
    contractId: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(
        id: string,
        clientName: string,
        status: string,
        window: string,
        agent: string,
        date: Date,
        visitNumber: number,
        attempt: string,
        installmentsNumber: number,
        contractId: string,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.clientName = clientName;
        this.status = status;
        this.window = window;
        this.agent = agent;
        this.date = date;
        this.visitNumber = visitNumber;
        this.attempt = attempt;
        this.installmentsNumber = installmentsNumber;
        this.contractId = contractId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}