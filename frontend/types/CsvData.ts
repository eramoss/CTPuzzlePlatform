import { groupByKey, OperationOnGroup } from "./StatisticMeasures";

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
    let maxLength = csvHeader.label.length;
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

export function groupCsvData(csvData: CsvData, groupBy: string, groupWhat: string, operationAfterGroup: OperationOnGroup<number[], number>): CsvData {
    let csvDataGrouped = new CsvData()
    let labelGroupBy = new CsvHeaderLabel()
    let labelGroupWhat = new CsvHeaderLabel()

    labelGroupBy.value = groupBy
    labelGroupBy.label = groupBy

    labelGroupWhat.value = groupWhat
    labelGroupWhat.label = groupWhat

    csvDataGrouped.labels.push(labelGroupBy)
    csvDataGrouped.labels.push(labelGroupWhat)

    let groups = groupByKey(groupWhat, groupBy, csvData.rows)
    groups.forEach((value: Object[], key: string) => {
        let row: any = {}
        row[groupBy] = key
        row[groupWhat] = operationAfterGroup?.fn(value as number[])
        csvDataGrouped.rows.push(row)
    })
    return csvDataGrouped;
}

export function getCsvHeaders(csv: string) {
    return csv.split("\n")[0].split(CSV_SEPARATOR)
}