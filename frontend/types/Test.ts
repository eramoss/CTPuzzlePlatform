import Item from "./Item"
import ResearchGroup from "./ResearchGroup"
import TestApplication from "./TestApplication"
import TestItem from "./TestItem"

export default class Test {
    id!: number
    name!: string
    link: string = 'https://ct.playerweb.com.br'
    items: TestItem[] = []
    applications: TestApplication[] = []
    researchGroup!: ResearchGroup

}
