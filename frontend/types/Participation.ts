import TestApplication from "./TestApplication";
import User from "./User";

export default class Participation {
    id!: number
    user!: User
    testApplication!: TestApplication
    progress!:number
}