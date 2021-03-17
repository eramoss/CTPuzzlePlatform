import ResearchGroup from "./ResearchGroup"

export default class User {
    id!: number
    name!: string
    birtyDate!: Date
    gender!: string
    email!: string
    password!: string
    researchGroup!: ResearchGroup

    birthDay: string = "";
    birthMonth: string = "";
    birthYear: string = "";

    get birthDate() {
        return `${this.birthDay}/${this.birthMonth}/${this.birthYear}`;
    }

}
