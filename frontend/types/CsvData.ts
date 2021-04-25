export const CSV_SEPARATOR = "|"

export class CsvHeaderLabel {
    label!: string
    value!: string
}

export class CsvData {
    labels!: CsvHeaderLabel[]
    rows!: any[];


}

export function csvDataToCsv(csvData: CsvData): string {
    let keys = csvData.labels.map(l => l.value)
    let header = csvData.labels.map(label => label.value).join(CSV_SEPARATOR)
    let body = csvData.rows.map(row =>
        keys.map(key => {
            if (typeof row[key] == "object") {
                return JSON.stringify(row[key])
            }
            return row[key]
        }).join(CSV_SEPARATOR)
    ).join('\n')
    return `${header}\n${body}`
}

export function filterCsvData(csvData: CsvData, leftOperandFilterVariable: string, logicalOperationFilter: string, rightOperandFilterValue: string): CsvData {
    let fn: (value: any) => boolean = () => false
    if (logicalOperationFilter == '==') {
        fn = (value) => (value == rightOperandFilterValue)
    }
    if (logicalOperationFilter == '!=') {
        fn = (value) => (value != rightOperandFilterValue)
    }
    if (logicalOperationFilter == '>') {
        fn = (value) => (value > rightOperandFilterValue)
    }
    if (logicalOperationFilter == '>=') {
        fn = (value) => (value >= rightOperandFilterValue)
    }
    if (logicalOperationFilter == '<') {
        fn = (value) => (value < rightOperandFilterValue)
    }
    if (logicalOperationFilter == '<=') {
        fn = (value) => (value <= rightOperandFilterValue)
    }
    let filteredRows = csvData.rows.filter(row => {
        return fn(row[leftOperandFilterVariable])
    })
    csvData.rows = filteredRows
    return csvData;
}

export function transformCsvData(csvData: CsvData): CsvData {
    return csvData;
}