import { CleanInstantiationOptions, ItemTestCase } from "./ItemTestCase"
import { v4 as uuidV4 } from 'uuid';
import Score from "./Score";
import Mechanic from "./Mechanic";
import { createCleanInstantiationFunctionCode } from './ItemTestCase'

export class ResponseTestCase {
    id!: number
    responseInstantiation!: string
    itemTestCase!: ItemTestCase
    score!: Score
    expectedScore!: number
    position!:number

    constructor(mechanic: Mechanic) {
        const options = new CleanInstantiationOptions();
        options.classDefinition = mechanic.responseClassDefinition;
        options.fnName = 'criarResposta';
        options.objectName = 'resposta';
        options.classNamePart = 'resp';
        this.responseInstantiation = createCleanInstantiationFunctionCode(options);
    }
}