import Participation from "./Participation";
import TestApplication from "./TestApplication";
import TestItem from "./TestItem";

export default class ItemResponse {
    id!: number
    participation!: Participation
    testItem!: TestItem
    response!: string
}