import { ItemTestCase } from "./ItemTestCase"
import { v4 as uuidV4 } from 'uuid';
import Score from "./Score";

export class ResponseTestCase {
    id!: number
    responseInstantiation!: string
    itemTestCase!: ItemTestCase
    score!: Score
    expectedScore!: number

    constructor() {
        this.responseInstantiation = responseInstantiationExample()
    }
}

export const responseInstantiationExample = function (uniqueId: any = uuidV4().substr(0, 4)) {
    return `// Esse exemplo é muito parecido com o anterior (do item). Veja:
// Você precisa codificar uma função como esta, para retornar a resposta a ser testada:
function criarResposta_${uniqueId}(): MinhaReposta { //<-- Erro de sintaxe
    let resposta = new MinhaReposta(); //<-- Erro de sintaxe
    //Informe os atributos da resposta. Exemplo:
    //resposta.tempoQueLevouParaResponder = 55
    return resposta; //<-- retorne a resposta!
}
// Se no exemplo há erros de sintaxe, é porque a classe 
// não é igual às definidas na mecânica.
// Por isso, substitua "MinhaReposta" pelo nome da sua classe de resposta
// e informe valores para os atributos definidos lá.
`
}