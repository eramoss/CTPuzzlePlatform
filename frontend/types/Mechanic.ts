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
    // let nota = 0;
    // if(resposta.tempo == item.tempoEsperado / 2){
    //    nota = 5
    //}
    
    // Formato esperado com escore e escore máximo atingível
    return { score: nota, max: 10 };
}`
}