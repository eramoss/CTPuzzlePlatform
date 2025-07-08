import { getDeclaredClassesNames } from "~/utils/utils";
import { ItemTestCase } from "./ItemTestCase";
import ResearchGroup from "./ResearchGroup";
import User from "./User"

export default class Mechanic {
    id: number = 0
    name: string = ''
    baseUrl: string = ''
    description: string = ''
    thumbnail: string = ''
    classDefinition: string = ''
    responseClassDefinition: string = ''
    scoreFunction: string = ''
    itemInstantiation: string = ''
    responseInstantiation: string = ''
    user!: User
    researchGroup!: ResearchGroup
    itemTestCases: ItemTestCase[] = []
    createdAt!: Date
    deletedAt!: Date
    updatedAt!: Date

    constructor(name: string, description: string, classDefinition: string, responseClassDefinition: string, scoreFunction: string) {
        this.name = name;
        this.description = description;
        this.classDefinition = classDefinition;
        this.responseClassDefinition = responseClassDefinition;
        this.scoreFunction = scoreFunction;
    }
}

export function createMechanicExample(user: User): Mechanic {
    const classDefinitionExample = `class Item {
  esperado: string[] = [];
}`;

    const responseClassExample = `class RespostaItem {
  informado: string[] = []
}`;

    const mechanicExample = new Mechanic(
        '',
        '',
        classDefinitionExample,
        responseClassExample,
        ''
    );
    mechanicExample.user = user;
    mechanicExample.researchGroup = user.researchGroup
    return mechanicExample;

}

export function createScoreFunctionExampleIfUndefined(mechanic: Mechanic) {
    if (!mechanic.scoreFunction) {
        mechanic.scoreFunction = createScoreFunctionCode(mechanic.classDefinition, mechanic.responseClassDefinition)
    }
}

export const createScoreFunctionCode = function (classDefinition: string, responseDefinition: string) {
    let itemClassName = getDeclaredClassesNames(classDefinition)[0]
    let responseClassName = getDeclaredClassesNames(responseDefinition, 'resp')[0]
    return `function calcularEscore(item: ${itemClassName}, resposta: ${responseClassName}){
    
    // Escreva a função de escore
    
    // Exemplo

    //pesos
    //let peso_abstracao = 0.2
    //let peso_algoritmo = 0
    //let peso_reconhecimento_padroes = 0.4
    //let peso_decomposicao = 0.4

    //pilares 
    //let abstracao = 0
    //let algoritmo = 0
    //let reconhecimento_padroes = 0
    //let decomposicao = 0

    //respota obtida na fase
    //let contadorCliques = resposta.contadorCliques
    //let contadorGiros = resposta.contadorGiros
    //let tempoEmSegundos = resposta.tempoEmSegundos

    //valor minimo esperado
    //let contadorCliquesMinimo = item.contadorCliquesMinimo
    //let contadorGirosMinimo = item.contadorGirosMinimo

    //cálculo da fórmula em partes
    //let calc_cliques = ((contadorCliques - contadorCliquesMinimo) * 0.001)
    //let calc_giros = ((contadorGiros - contadorGirosMinimo) * 0.001)
    //let calc_tempo = (tempoEmSegundos * 0.01)

    //cálculo da fórmula final
    //let escore_final = 1 - calc_cliques - calc_giros - calc_tempo

    //cálculo por pilar do PC
    //abstracao = parseFloat((peso_abstracao * escore_final).toFixed(2))
    //algoritmo = parseFloat((peso_algoritmo * escore_final).toFixed(2))
    //reconhecimento_padroes = parseFloat((peso_reconhecimento_padroes * escore_final).toFixed(2))
    //decomposicao = parseFloat((peso_decomposicao * escore_final).toFixed(2))
    //escore_final = parseFloat(escore_final.toFixed(2))

    
    // Formato esperado com escore e escore máximo atingível
    //    return {score: escore_final,
    //       abstracao: abstracao, 
    //       peso_abstracao: peso_abstracao, 
    //       algoritmo: algoritmo, 
    //       peso_algoritmo: peso_algoritmo,
    //       reconhecimentoDePadroes: reconhecimento_padroes, 
    //       peso_reconhecimentoDePadroes: peso_reconhecimento_padroes,
    //       decomposicao: decomposicao, 
    //       peso_decomposicao: peso_decomposicao
    };
}`
}