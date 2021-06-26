import { groupByKey, LogicOperation, OperationOnGroup } from "./StatisticMeasures";

export const CSV_SEPARATOR = "|"

export class CsvHeaderLabel {
    label!: string
    value!: string
}

export class CsvData {
    labels: CsvHeaderLabel[] = []
    rows: any[] = [];
}

export function csvDataToCsv(csvData: CsvData): string {
    let keys = csvData.labels.map(l => l.value)
    let header = csvData.labels.map(label => label.value).join(CSV_SEPARATOR)
    let body = csvData.rows.map(row =>
        keys.map(key => {
            let columnValue = row[key]
            if (typeof row[key] == "object") {
                columnValue = JSON.stringify(row[key])
            }
            return columnValue?.toString().replaceAll('\n', ' ')
        }).join(CSV_SEPARATOR)
    ).join('\n')
    return `${header}\n${body}`
}

export function csvToCsvData(csv: string): CsvData {
    let csvData = new CsvData()

    let lines = csv.split('\n')
    let headers = lines[0].split(CSV_SEPARATOR).map(h => h.trim())

    csvData.labels = headers.map((h) => {
        let label = new CsvHeaderLabel()
        label.label = h
        label.value = h
        return label
    })

    let rows: any[] = []

    for (let i = 1; i < lines.length; i++) {
        let row: any = {}
        let line = lines[i].split(CSV_SEPARATOR).map(v => v.trim())
        headers.forEach((h, index) => {
            row[h] = line[index]
        })
        rows.push(row)
    }
    csvData.rows = rows
    return csvData;
}

export function csvDataToCsvFormatted(csvData: CsvData): string {
    let keys = csvData.labels.map(l => l.value)

    let maxLengths = csvData.labels.map(label => getLengthOfBigLengthValue(csvData, label))

    let header = csvData.labels.map((label, index) => {
        return rightPadBlank(label.value, maxLengths[index])
    }).join(CSV_SEPARATOR)


    let body = csvData.rows.map(row =>
        keys.map((key, index) => {
            let columnValue = row[key]
            if (typeof row[key] == "object") {
                columnValue = JSON.stringify(row[key])
            }
            columnValue = columnValue?.toString().replaceAll('\n', ' ')
            columnValue = rightPadBlank(columnValue, maxLengths[index])
            return columnValue;
        }).join(CSV_SEPARATOR)
    ).join('\n')


    return `${header}\n${body}`
}


export function getLengthOfBigLengthValue(csvData: CsvData, csvHeader: CsvHeaderLabel) {
    let key = csvHeader.value
    let maxLength = csvHeader.value.length;
    csvData.rows.map(row => JSON.stringify(row[key])).map(value => value?.length)
        .forEach(length => {
            if (length > maxLength) {
                maxLength = length
            }
        })
    return maxLength
}

export function rightPadBlank(value: string, size: number): string {
    if (!value) {
        value = ""
    }
    let totalSpacesToAdd = size - value.length;
    let totalSpacesAdded = 0;
    let spaces = "";
    while (totalSpacesAdded < totalSpacesToAdd) {
        spaces += " ";
        totalSpacesAdded++;
    }
    return value + spaces;

}

export const availableLogicalOperations = [
    new LogicOperation<any>("==", (leftOperand: any, rightOperand: any) => leftOperand == rightOperand),
    new LogicOperation<number>("!=", (leftOperand: number, rightOperand: number) => leftOperand != rightOperand),
    new LogicOperation<number>(">", (leftOperand: number, rightOperand: number) => leftOperand > rightOperand),
    new LogicOperation<number>(">=", (leftOperand: number, rightOperand: number) => leftOperand >= rightOperand),
    new LogicOperation<number>("<", (leftOperand: number, rightOperand: number) => leftOperand < rightOperand),
    new LogicOperation<number>("<=", (leftOperand: number, rightOperand: number) => leftOperand <= rightOperand),
    new LogicOperation<any>("não é vazio", (uniqueOperand: number) => (uniqueOperand + "").length > 0, 1),
]

export function filterCsvData(csvData: CsvData, leftOperandFilterVariable: any, logicalOperationFilter: string, rightOperandFilterValue: any): CsvData {
    let applyLogicalOperation = availableLogicalOperations.find(operation => operation.name == logicalOperationFilter)?.fn
    csvData.rows = csvData.rows.filter(row => {
        let logicalOperationResult = true
        if (applyLogicalOperation) {
            logicalOperationResult = applyLogicalOperation(row[leftOperandFilterVariable], rightOperandFilterValue)
        }
        return logicalOperationResult
    })
    return csvData;
}

export const availableGroupOperations = [

    new OperationOnGroup<number[], number>("Total", (numbers: any[]) => {
        numbers = numbers.map(n => parseFloat(n))
        return numbers.reduce(
            (previousValue: number, currentValue: number) => previousValue + currentValue
        );
    }),
    /* new OperationOnGroup<number[], number>("Correlação", (numbers: any[]) => {
        numbers = numbers.map(n => parseFloat(n))
        return numbers.reduce(
            (previousValue: number, currentValue: number) => previousValue + currentValue
        );
    }), */
    new OperationOnGroup<number[], number>("Média", (numbers: any[]) => {
        numbers = numbers.map(n => parseFloat(n))
        return parseFloat(
            (
                numbers.reduce(
                    (previousValue: number, currentValue: number) =>
                        previousValue + currentValue
                ) / numbers.length
            ).toFixed(2)
        );
    }),
    new OperationOnGroup<number[], number>("Mediana", (numbers: any[]) => {
        numbers = numbers.map(n => parseFloat(n)).sort((a, b) => a - b)
        if (numbers.length % 2 == 0) {
            return (numbers[numbers.length / 2 -1] + numbers[numbers.length / 2]) / 2
        }
        if (numbers.length % 2 == 1) {
            return numbers[(numbers.length-1)/2]
        }
    }),
    new OperationOnGroup<number[], number>("Desvio padrão", (numbers: any[]) => {
        const totalElements = numbers.length;
        numbers = numbers.map(n => parseFloat(n))
        // https://www.todamateria.com.br/desvio-padrao/
        // Raiz quadrada da soma dos elementos - a média elevado ao quadrado divivido pelo nr de elementos

        let media =
            numbers.reduce(
                (previousValue: number, currentValue: number) =>
                    previousValue + currentValue
            ) / totalElements

        let elementos = numbers.map(n => Math.pow(Math.abs(n - media), 2))

        let somaDiffElementoMenosMedia = elementos.reduce(
            (previousValue: number, currentValue: number) =>
                previousValue + currentValue
        )
        return parseFloat(Math.sqrt(somaDiffElementoMenosMedia / totalElements).toFixed(2))
    }),
    new OperationOnGroup<number[], number>("Maior valor", (numbers: any[]) => {
        numbers = numbers.map(n => parseFloat(n))
        return numbers.reduce((previousValue: number, currentValue: number) => {
            return currentValue > previousValue ? currentValue : previousValue;
        });
    }),
    new OperationOnGroup<number[], number>("Menor valor", (numbers: any[]) => {
        numbers = numbers.map(n => parseFloat(n))
        return numbers.reduce((previousValue: number, currentValue: number) => {
            return currentValue < previousValue ? currentValue : previousValue;
        });
    }),
]

export function groupCsvData(csvData: CsvData, groupBy: string, groupWhat: string, operationAfterGroup: OperationOnGroup<number[], number>): CsvData {
    let csvTransformOperation = new CsvData()
    let labelGroupBy = new CsvHeaderLabel()
    let labelGroupWhat = new CsvHeaderLabel()

    if(groupBy.length){
        labelGroupBy.value = groupBy
        labelGroupBy.label = groupBy
        csvTransformOperation.labels.push(labelGroupBy)
    }

    labelGroupWhat.value = groupWhat
    labelGroupWhat.label = groupWhat
    csvTransformOperation.labels.push(labelGroupWhat)

    let groups = groupByKey(groupWhat, groupBy, csvData.rows)
    groups.forEach((value: Object[], key: string) => {
        let row: any = {}
        row[groupBy] = key
        let groupFunction = availableGroupOperations.find(op => op.name == operationAfterGroup.name)?.fn
        if (groupFunction) {
            row[groupWhat] = groupFunction(value as number[])
            csvTransformOperation.rows.push(row)
        }
    })
    return csvTransformOperation;
}

export function getCsvHeaders(csv: string) {
    return csv.split("\n")[0].split(CSV_SEPARATOR).map(header => header.trim())
}

export function trimCsvData(csv: string) {
    return csv
        .split("\n")
        .map(line => line
            .split(CSV_SEPARATOR)
            .map(value => (value + "").trim())
            .join(CSV_SEPARATOR))
        .join("\n")
}