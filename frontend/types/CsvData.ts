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
        keys.map(key => row[key]).join(CSV_SEPARATOR)
    ).join('\n')
    return `${header}\n${body}`
}