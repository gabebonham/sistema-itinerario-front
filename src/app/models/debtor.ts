export class Debtor {
    id: string;
    name: string;
    cpfCnpj: string;
    address: string;
    rg: string;
    createdAt:Date;
    updatedAt:Date;
    constructor(id:string, name: string, cpfCnpj: string,address: string,rg: string, createdAt:Date,updatedAt:Date) {
        this.id = id;
        this.name = name;
        this.cpfCnpj = cpfCnpj;
        this.address = address;
        this.rg = rg;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}