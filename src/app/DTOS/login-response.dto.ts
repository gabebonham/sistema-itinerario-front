import { UserResponse } from "./user-response.dto"

export interface LoginResponse {
    accessToken:string
    user:UserResponse
}