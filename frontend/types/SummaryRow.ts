import { CsvHeaderLabel } from "./CsvData"

export class SummaryRow {
    summaryOperationName!: string
    rowObject: any = {}
    headers: CsvHeaderLabel[] = []
}