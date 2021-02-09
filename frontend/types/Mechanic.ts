import User from "./User"

export default class Mechanic {
    id: number = 0
    name: string = ''
    description: string = ''
    thumbnail: string = ''
    classDefinition: string = ''
    responseClassDefinition: string = ''
    scoreFunction: string = ''
    user!: User

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
// Exemplo de classe de mecânica
class MecanicaRope {
  // mapa: string[][];
  // obstaculos: string[][];
  // solucaoEsperada: Array<{x:number, y:number}>;
  // comandosEsperados: Array<string>;
  // face: string;
  // x: number;
  // y: number;
}`;

    const responseClassExample = `
// Exemplo de classe de resposta
class RespostaItem {
  caminhoPercorrido: Array<{x:number, y:number}>
  comandosUtilizados: string[]
}`;

    const scoreFunctionExample = `
// Exemplo de cálculo de nota
function calculaScore(resposta: ItemProgramacaoRope){
   // implementar cálculo da nota...
   let nota = 9
   return nota;
}`;

    const mechanicExample = new Mechanic(
        '',
        '',
        classDefinitionExample,
        responseClassExample,
        scoreFunctionExample
    );
    mechanicExample.user = user;
    return mechanicExample;

}
