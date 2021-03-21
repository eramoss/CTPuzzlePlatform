import ResearchGroup from "./ResearchGroup"

export default class User {
    id!: number
    name!: string
    birtyDate!: Date
    gender!: string
    email!: string
    password!: string
    researchGroup!: ResearchGroup

    
    roles: string[] = []

    birthDate:Date

    

}
