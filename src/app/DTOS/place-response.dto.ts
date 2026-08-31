export interface PlaceResponse {
    placeId: string;
    name: string;
    street: string | null;
    number: string | null;
    neighborhood: string | null;
    city: string;
    state: string;
    zipCode: string | null;
    country: string;
    latitude: number;
    longitude: number;
    formattedAddress: string;
}