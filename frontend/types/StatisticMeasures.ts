
export class Measure {
    fn?: string
    name?: string

    constructor(fn: string, name: string) {
        this.fn = fn
        this.name = name
    }
}

const average = new Measure('boxplot', 'Boxplot')
const median = new Measure('histogram', 'Histograma')
// const squareDeviation = new Measure('squareDeviation', 'Desvio padrão')
export const availableMeasures = [
    average,
    median
    //squareDeviation
]