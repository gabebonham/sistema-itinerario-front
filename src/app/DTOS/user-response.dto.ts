import { UserRole } from "../models/user"

export interface UserResponse {
    id:string
    email:string
    name:string
    role:UserRole
    createdAt:Date
    updatedAt:Date
}