import { ItemTestCase } from "./ItemTestCase"
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

    constructor(mechanic: Mechanic) {
        this.responseInstantiation = createCleanInstantiationFunctionCode(mechanic.responseClassDefinition, 'criarResposta', 'resposta')
    }
}