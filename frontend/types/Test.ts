import ResearchGroup from "./ResearchGroup"
import TestApplication from "./TestApplication"
import TestItem from "./TestItem"
import { UserDataQuestion } from "./UserDataQuiz"

export type MomentOfQuizPresentation = "after-the-test" | "before-the-test";
export default class Test {
    id!: number
    name!: string
    link: string = 'http://localhost:9000/'
    items: TestItem[] = []
    applications: TestApplication[] = []
    researchGroup!: ResearchGroup
    createdAt!: Date
    deletedAt!: Date
    updatedAt!: Date
    userDataToRequest!: UserDataQuestion[]
    momentOfQuizPresentation: MomentOfQuizPresentation = "after-the-test"
}
