import { Injectable } from "@angular/core";
import { User } from "../models/user";

export const USERS_MOCK: User[] = [{
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3n001',
    name: "Eduardo Smith",
    email: "eduardosmith@gmail.com",
    password: "123",
    role: 'Notificador',
    createdAt: new Date(),
    updatedAt: new Date()
},
{
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3n002',
    name: "Alan Awake",
    email: "alanawake@gmail.com",
    password: "123",
    role: 'Notificador',
    createdAt: new Date(),
    updatedAt: new Date()
},
{
    id: 'f47ac10b-58cc-4372-a567-0f02b2c3n002',
    name: "Ana Luisa",
    email: "analuisa@gmail.com",
    password: "123",
    role: 'Planejador',
    createdAt: new Date(),
    updatedAt: new Date()
},
{
    id: 'f47ac10b-58cc-4172-a567-0f02b2c3n002',
    name: "Amanda Roberta",
    email: "amandaroberta@gmail.com",
    password: "123",
    role: 'Planejador',
    createdAt: new Date(),
    updatedAt: new Date()
}]
@Injectable({ providedIn: 'root' })
export class UserService {
    async getAllByRole(role: string) {
        await new Promise(resolve => setTimeout(resolve, 800));
        return { success: true, data: USERS_MOCK.filter(user => user.role == role) }
    }
    async getById(id: string) {
        await new Promise(resolve => setTimeout(resolve, 800));
        return { success: true, data: USERS_MOCK.find(user => user.id == id) }
    }
}