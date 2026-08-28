export type UserRole = 'Admin' | 'Planejador' | 'Notificador'
export class User {
    id: string
    name: string
    email: string
    password?: string
    role: UserRole
    createdAt: Date
    updatedAt: Date
    constructor(
        id: string,
        name: string,
        email: string,
        role: UserRole,
        createdAt: Date,
        updatedAt: Date,
        password?: string,
    ) {
        this.id = id
        this.name = name
        this.email = email
        this.password = password
        this.role = role
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }
}