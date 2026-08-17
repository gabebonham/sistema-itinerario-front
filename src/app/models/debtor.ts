export class Debtor {
    id: string;
    name: string;
    cpf: string;
    cep: string;
    contractId: string;
    createdAt:Date;
    updatedAt:Date;
    constructor(id:string, name: string, cpf: string,cep: string,contractId: string, createdAt:Date,updatedAt:Date) {
        this.id = id;
        this.name = name;
        this.cpf = cpf;
        this.cep = cep;
        this.contractId = contractId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}