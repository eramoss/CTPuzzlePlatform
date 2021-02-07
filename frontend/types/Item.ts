import Mechanic from "./Mechanic";

export default class Item {
  id!: number;
  name: string = ''
  description: string = ''
  mechanic!: Mechanic
  itemDefinition: string = ''
}

export function createExampleItem(): Item {
  const itemExample = new Item()
  itemExample.itemDefinition = `let item = new MecanicaRope();
item.mapa = [
  ['tile','tile','tile'],
  ['tile','tile','tile'],
]
item.osb = [
  ['tile','tile','tile'],
  ['tile','tile','tile'],
]`;
  return itemExample;
}
