import { ItemTestCase } from "./ItemTestCase";
import ResearchGroup from "./ResearchGroup";
import User from "./User"

export default class Mechanic {
    static newEmpty(): Mechanic {
        return new Mechanic('', '', '', '', '');
    }

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
    const classDefinitionExample = `
// Exemplo:
// class ItemProgramacao {
//  mapa: string[][];
//  obstaculos: string[][];
//  solucaoEsperada: Array<{x:number, y:number}>;
//  comandosEsperados: Array<string>;
//  face: string;
//  x: number;
//  y: number;
//}`;

    const responseClassExample = `
// Exemplo:
// class RespostaItem {
//  caminhoPercorrido: Array<{x:number, y:number}>
//  comandosUtilizados: string[]
//}`;

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
