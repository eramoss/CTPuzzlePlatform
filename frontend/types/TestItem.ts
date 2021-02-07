import Mechanic from "./Mechanic";

export default class TestItem {
  id!: number;
  name: string = ''
  description: string = ''
  mechanic!: Mechanic
  itemDefinition: string = ''
}

export function createExampleItem(): TestItem {
  const testItemExample = new TestItem()
  testItemExample.itemDefinition = `let item = new MecanicaRope();
item.mapa = [
  ['tile','tile','tile'],
  ['tile','tile','tile'],
]
item.osb = [
  ['tile','tile','tile'],
  ['tile','tile','tile'],
]`;
  return testItemExample;
}
