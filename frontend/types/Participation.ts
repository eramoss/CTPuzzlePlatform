import ItemResponse from "./ItemResponse";
import TestApplication from "./TestApplication";
import User from "./User";
import { UserQuizSession } from "./UserDataQuiz";

export default class Participation {
    id!: number
    user!: User
    application!: TestApplication
    progress!: number
    itemResponses!: ItemResponse[]
    createdAt!: Date
    deletedAt!: Date
    updatedAt!: Date
    userDataToRequest!: UserQuizSession
    observations!: string
}