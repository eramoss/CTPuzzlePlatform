import Item from "./Item"
import ResearchGroup from "./ResearchGroup"
import TestApplication from "./TestApplication"
import TestItem from "./TestItem"
import { UserDataQuestion } from "./UserDataQuiz"

export default class Test {
    id!: number
    name!: string
    link: string = 'https://ct.playerweb.com.br'
    items: TestItem[] = []
    applications: TestApplication[] = []
    researchGroup!: ResearchGroup
    createdAt!: Date
    deletedAt!: Date
    updatedAt!: Date
    userDataToRequest!: UserDataQuestion[]
}
