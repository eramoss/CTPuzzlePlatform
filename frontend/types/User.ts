import ResearchGroup from "./ResearchGroup"

export enum UserRole {
    ADMIN = 'admin', STUDENT = 'student', SYSADMIN = 'sysadmin'
}

export const USER_UUID_TOKEN = "<user_uuid>"

export const userRoles = [
    UserRole.ADMIN,
    UserRole.STUDENT,
    UserRole.SYSADMIN,
]

export function getLabel(key: UserRole): string {
    let names = {
        admin: 'Administrador',
        student: 'Aluno',
        sysadmin: 'Administrador do systema',
    }
    return names[key]
}

export default class User {
    id!: number
    name!: string
    birtyDate!: Date
    gender!: string
    email!: string
    password!: string
    researchGroup!: ResearchGroup
    roles: string[] = []
    birthDate!: Date
    createdAt!: Date
    updatedAt!: Date
    deletedAt!: Date
    data!: any
}
