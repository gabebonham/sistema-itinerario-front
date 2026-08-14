export class Attempt {
    clientName: string;
    status: string;
    window: string;
    agent: string;
    date: Date;
    visitNumber: number;
    attempt: string;
    installmentsNumber: number;
    contractId: string;

    constructor(clientName: string, status: string, window: string, agent: string, date: Date, visitNumber: number, attempt: string, installmentsNumber: number, contractId: string) {
        this.clientName = clientName;
        this.status = status;
        this.window = window;
        this.agent = agent;
        this.date = date;
        this.visitNumber = visitNumber;
        this.attempt = attempt;
        this.installmentsNumber = installmentsNumber;
        this.contractId = contractId;
    }
}