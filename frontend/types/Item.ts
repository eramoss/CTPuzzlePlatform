import Mechanic from "./Mechanic";

export default class Item {
    id!: number;
    name: string = ''
    description: string = ''
    mechanic!: Mechanic
    thumbnail!: string
    itemDefinition: string = ''
    createdAt!:Date
    deletedAt!:Date
    updatedAt!:Date
    isTutorial!:boolean
}

export function createExampleItem(): Item {
    const itemExample = new Item()
    itemExample.itemDefinition = `//Exemplo:
function createItem() {
    let item = new ItemMapaProgramacao(); //<-- Substituir (Selecione o tipo da mecânica)
    // Substitua esse código:
    item.mapa = [
        ['chao','chao','chao'],
        ['chao','chao','chao'],
        ['chao','chao','chao'],
    ]
    item.obstaculos = [
        ['vazio','vazio','vazio'],
        ['bloco','bloco','vazio'],
        ['bloco','bloco','moeda'],
    ]
    // Retorne o item:
    return item;
}`;
    return itemExample;
}
