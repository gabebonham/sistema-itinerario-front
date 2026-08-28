import { UserRole } from "../models/user";

export interface RegisterDTO {
    email:string;
    name:string;
    role:UserRole;
    password:string;
}