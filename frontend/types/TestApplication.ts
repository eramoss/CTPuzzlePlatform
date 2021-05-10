import Participation from "./Participation"
import Test from "./Test"

export type TestApplicationVisibility = "PUBLIC" | "PRIVATE"
export default class TestApplication {

    id: number = 0
    test: Test = new Test()

    name: string = ''
    description: string = ''
    url!: string
    hash!: string

    controlApplication?: TestApplication | null = null

    participations: Participation[] = []
    countParticipations = 0
    createdAt!: Date
    deletedAt!: Date
    updatedAt!: Date
    visibility: TestApplicationVisibility = "PRIVATE"

}
