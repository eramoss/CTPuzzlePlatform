import Participation from "./Participation";
import Score from "./Score";
import TestItem from "./TestItem";

export default class ItemResponse {
    id!: number
    participation!: Participation
    testItem!: TestItem
    response!: string
    score!: Score
    message!: string
}