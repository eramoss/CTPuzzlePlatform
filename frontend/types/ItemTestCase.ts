import Mechanic from "./Mechanic"
import { ResponseTestCase } from "./ResponseTestCase"
import { getDeclaredClassesNames } from "~/utils/utils";

export class ItemTestCase {

    id!: number
    itemInstantiation!: string
    mechanic!: Mechanic
    responseTestCases: ResponseTestCase[] = []

    constructor(mechanic: Mechanic) {
        this.itemInstantiation = createCleanInstantiationFunctionCode(mechanic.classDefinition, 'resp');
        this.responseTestCases.push(new ResponseTestCase(mechanic));
    }
}

export const createCleanInstantiationFunctionCode = function (classDefinition: string, fnName: string = 'criarItem', objectName: string = 'item', classNamePart: string = '') {
    let clazz = getDeclaredClassesNames(classDefinition, classNamePart)[0]
    return `function ${fnName}(): ${clazz} {
    let ${objectName} = new ${clazz}();
    ${objectName}.atributo = "valor";
    return ${objectName};
}`
}

export const createScoreFunctionCode = function (classDefinition: string, responseDefinition: string) {
    let itemClassName = getDeclaredClassesNames(classDefinition)[0]
    let responseClassName = getDeclaredClassesNames(responseDefinition, 'resp')[0]
    return `function calculaScore(item: ${itemClassName}, resposta: ${responseClassName}){
    let nota = 0;
    // Exemplos com atributos X e Y
    if(resposta.atributoInformadoX == item.atributoEsperadoX){
        nota++;
        if(resposta.atributoInformadoY == item.atributoEsperadoY){
            nota++;
        }
    }
    // Formato esperado: { score, max }
    return { score: nota, max: 2 };
}`
}
