import Mechanic from "./Mechanic"
import { ResponseTestCase } from "./ResponseTestCase"
import { getDeclaredClassesNames, randWord } from "~/utils/utils";

export class ItemTestCase {

    id!: number
    itemInstantiation!: string
    mechanic!: Mechanic
    expanded: boolean = false
    responseTestCases: ResponseTestCase[] = []
    position!:number

    constructor(mechanic: Mechanic) {
        const options = new CleanInstantiationOptions();
        options.classDefinition = mechanic.classDefinition;
        this.itemInstantiation = createCleanInstantiationFunctionCode(options);
        this.responseTestCases.push(new ResponseTestCase(mechanic));
        this.expanded = true;
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

