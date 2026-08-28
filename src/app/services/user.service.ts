import { inject, Injectable } from "@angular/core";
import { User, UserRole } from "../models/user";
import { ApiService } from "./api";
import { PaginatedResponse } from "../DTOS/paginated-response";
import { UserResponse } from "../DTOS/user-response.dto";
import { ApiResponse } from "../DTOS/api-response";

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
    private api = inject(ApiService);
    async getAllByRole(page: number = 1, pageSize: number = 8, role: UserRole): Promise<ApiResponse<PaginatedResponse<UserResponse[]>>> {
        const params: any = {
            page,
            pageSize,
            role
        }
        return await this.api.get<PaginatedResponse<UserResponse[]>>('api/users', { params })
    }
    async getById(id: string): Promise<ApiResponse<UserResponse>> {
        return await this.api.get<UserResponse>('api/users/' + id)
    }
    async delete(id: string): Promise<ApiResponse<null>> {
        return await this.api.delete<null>('api/users/' + id)
    }
}