import Item from "./Item"
import TestItem from "./TestItem"

export default class Test {
  id!: number
  name!: string
  link: string = 'https://ct.playerweb.com.br'
  items: TestItem[] = []

}

export function setItems(test: Test, items: Item[]) {
  test.items = items.map((item: Item) => {
    let testItem = new TestItem()
    testItem.item = item;
    return testItem;
  })
}
