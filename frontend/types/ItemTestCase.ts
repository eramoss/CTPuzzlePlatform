import Mechanic from "./Mechanic"
import { ResponseTestCase } from "./ResponseTestCase"
import { getDeclaredClassesNames, randWord } from "~/utils/utils";

export class ItemTestCase {

    id!: number
    itemInstantiation!: string
    mechanic!: Mechanic
    responseTestCases: ResponseTestCase[] = []

    constructor(mechanic: Mechanic) {
        const options = new CleanInstantiationOptions();
        options.classDefinition = mechanic.classDefinition;
        this.itemInstantiation = createCleanInstantiationFunctionCode(options);
        this.responseTestCases.push(new ResponseTestCase(mechanic));
    }
}

export class CleanInstantiationOptions {
    classDefinition: string = '';
    fnName: string = 'criarItem';
    suffixFnName: string = '';
    objectName: string = 'item';
    classNamePart: string = ''
    encloseInParentesis: boolean = true
}

export const createCleanInstantiationFunctionCode = function (options: CleanInstantiationOptions) {
    let clazz = getDeclaredClassesNames(options.classDefinition, options.classNamePart)[0]
    let fn = `function ${options.fnName}${options.suffixFnName}(): ${clazz} {
    let ${options.objectName} = new ${clazz}();
    ${options.objectName}.atributo = "valor";
    return ${options.objectName};
}`
    if (options.encloseInParentesis) {
        fn = `(${fn})`
    }
    return fn;
}

export const createScoreFunctionCode = function (classDefinition: string, responseDefinition: string) {
    let itemClassName = getDeclaredClassesNames(classDefinition)[0]
    let responseClassName = getDeclaredClassesNames(responseDefinition, 'resp')[0]
    return `function calcularEscore(item: ${itemClassName}, resposta: ${responseClassName}){
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
