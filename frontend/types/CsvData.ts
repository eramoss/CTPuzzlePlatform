export class CsvHeaderLabel {
    label!: string
    value!: string
}

export class CsvData {
    labels!: CsvHeaderLabel[]
    rows!: any[];
}