
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
const bargraph = new Measure('bargraph', 'Gráfico de barras', 2)

export class LogicOperation<INPUT> {
    name: string
    fn!: (value1: INPUT, value2:INPUT) => boolean
    qtdOperands:number = 2
    constructor(name: string = "", fn: (value1: INPUT, value2:INPUT) => boolean, qtdOperands:number = 2) {
        this.name = name;
        this.fn = fn
        this.qtdOperands = qtdOperands
    }
}

export class OperationOnGroup<INPUT, OUTPUT> {
    name: string
    fn: (array: INPUT) => OUTPUT = (array: INPUT) => ({} as OUTPUT)
    constructor(name: string = "", fn: (array: INPUT) => OUTPUT = (array: INPUT) => ({} as OUTPUT)) {
        this.name = name;
        this.fn = fn
    }
}

export function groupByKey(groupWhat: string, groupBy: string, arrayOfObjects: any[]): Map<string, Array<Object>> {
    let groups: Map<string, Array<Object>> = new Map<string, Array<Object>>()
    arrayOfObjects.forEach(object => {
        let groupName = object[groupBy]
        let groupElements = groups.get(groupName)
        if (!groupElements) {
            groupElements = []
            groups.set(groupName, groupElements)
        }
        groupElements.push(object[groupWhat])
    })
    return groups
}

export const availableMeasures = [
    average,
    histogram,
    regression,
    bargraph
]