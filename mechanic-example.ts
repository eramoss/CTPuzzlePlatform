// Exemplo de classe de mecânica
class ItemMecanicaProgramacao {
    mapa!: string[][];
    obstaculos!: string[][];
    solucaoEsperada!: Array<{x:number, y:number}>;
    comandosEsperados!: Array<string>;
    face!: string;
    x!: number;
    y!: number;
}

// Exemplo de classe de resposta
class RespostaItemProgramacao {
    caminhoPercorrido!: Array<{x:number, y:number}>
    comandosUtilizados!: string[]
}

// Exemplo de cálculo de nota
function calculaScore(resposta: RespostaItemProgramacao, item: ItemMecanicaProgramacao){
    // implementar cálculo da nota...
    let nota = 9
    return nota;
 }

 let resposta = new RespostaItemProgramacao();
 let item = new ItemMecanicaProgramacao();
 let score = calculaScore(resposta, item);
 console.log(score);