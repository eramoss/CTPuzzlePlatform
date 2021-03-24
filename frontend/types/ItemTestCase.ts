import Mechanic from "./Mechanic"
import { ResponseTestCase } from "./ResponseTestCase"
import { v4 as uuidV4 } from 'uuid';

export class ItemTestCase {


    id!: number
    itemInstantiation!: string
    mechanic!: Mechanic
    responseTestCases: ResponseTestCase[] = []

    constructor() {
        this.itemInstantiation = itemInstantiationExample()
        this.responseTestCases.push(new ResponseTestCase());
    }

}

export const itemInstantiationExample = function (uniqueId: any = uuidV4().substr(0, 4)) {
    return `// Este tutorial é bem curto. Então leia.
// Codifique uma função para criar o item do teste. Exemplo:
function criarItem_${uniqueId}(): MeuItem {//<-- Erro de sintaxe
    let item = new MeuItem(); //<-- Erro de sintaxe
    //Informe os atributos do item. Exemplo:
    //item.tempoMaximoParaResponder = 60
    return item; //<-- retorne o item!
}
// Há erros de sintaxe porque a classe MeuItem 
// não é igual à definida na tela anterior.
// Substitua "MeuItem" pelo nome da sua classe de item
// e informe os atributos de acordo.`
}