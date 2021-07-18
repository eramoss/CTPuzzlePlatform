import { Parser } from 'json2csv';
import fs from 'fs'

export type CsvColumnType = "number" | "string" | "category"
export type CsvColumnSource = "userData" | "quiz" | "response"
export class CsvHeaderLabel {
    label!: string
    value!: string
    type?: CsvColumnType = "string"
    source?: CsvColumnSource
}

export class CsvData {
    labels: CsvHeaderLabel[] = []
    rows: any[] = [];
}

export function buildCsv(fields: CsvHeaderLabel[], data: any): string {
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(data);
    return csv;
}

export function writeCsv(path: string, data: CsvData) {
    fs.writeFileSync(path, buildCsv(data.labels, data.rows))
}

export function write(path: string, csv: string) {
    fs.writeFileSync(path, csv)
}