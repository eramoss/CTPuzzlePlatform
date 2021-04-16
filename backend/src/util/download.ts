import { Parser } from 'json2csv';

export class CsvHeaderLabel {
    label!: string
    value!: string
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