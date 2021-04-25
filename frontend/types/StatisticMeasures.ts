
export class Measure {
    fn?: string
    name?: string
    numVarsNeededToCalculate?: number

    constructor(fn: string, name: string, numVarsNeededToCalculate: number = 1) {
        this.fn = fn
        this.name = name
        this.numVarsNeededToCalculate = numVarsNeededToCalculate
    }
}

const average = new Measure('boxplot', 'Boxplot', 1)
const median = new Measure('histogram', 'Histograma', 1)
const regression = new Measure('regression', 'Regressão linear', 1)
export const availableMeasures = [
    average,
    median,
    regression
]