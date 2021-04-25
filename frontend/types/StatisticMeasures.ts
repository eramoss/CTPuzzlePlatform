
export class Measure {
    id?: string
    name?: string
    numVarsNeededToCalculate?: number

    constructor(id: string, name: string, numVarsNeededToCalculate: number = 1) {
        this.id = id
        this.name = name
        this.numVarsNeededToCalculate = numVarsNeededToCalculate
    }
}

const average = new Measure('boxplot', 'Boxplot', 1)
const histogram = new Measure('histogram', 'Histograma', 1)
const regression = new Measure('regression', 'Regressão linear', 2)
const avg = new Measure('avg_by', 'Média X por Y', 2)

export const availableMeasures = [
    average,
    histogram,
    regression,
    avg
]