import Item from "./Item"
import Test from "./Test"

export default class TestItem {
    id!: number
    order!: number
    test!: Test
    item!: Item
    countItemResponses!: number
}
