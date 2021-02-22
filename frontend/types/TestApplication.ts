import Respondent from "./Respondent"
import Test from "./Test"

export default class TestApplication {

    id: number = 0
    test!: Test
    participants!: Respondent[]

    name: string = ''
    url!: string

}
