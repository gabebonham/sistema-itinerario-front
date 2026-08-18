export interface AddressEntry {
    new:boolean
    city: string;
    neighborhood: string;
    street: string;
    number: string;
    complement: string;
    zipCode: string;
    state: string;
    country: string;
    lat: number;
    lng: number;
    attemptId: string;
    order: number;
}
export class Address {
    id: string;
    city: string;
    neighborhood: string;
    street: string;
    number: string;
    complement: string;
    zipCode: string;
    state: string;
    country: string;
    lat: number;
    lng: number;
    attemptId: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
    constructor(
        id: string,
        city: string,
        neighborhood: string,
        street: string,
        number: string,
        complement: string,
        zipCode: string,
        state: string,
        country: string,
        lat: number,
        lng: number,
        attemptId: string,
        order: number,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.city = city;
        this.neighborhood = neighborhood;
        this.street = street;
        this.number = number;
        this.complement = complement;
        this.zipCode = zipCode;
        this.state = state;
        this.country = country;
        this.lat = lat;
        this.lng = lng;
        this.attemptId = attemptId;
        this.order = order;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
