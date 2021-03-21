import Participation from "./Participation"
import Test from "./Test"

export default class TestApplication {

    id: number = 0
    test: Test = new Test()

    name: string = ''
    url!: string
    hash!: string

    participations: Participation[] = []
    createdAt!:Date
    deletedAt!:Date
    updatedAt!:Date

}
