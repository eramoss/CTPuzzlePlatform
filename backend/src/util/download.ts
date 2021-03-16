import { Parser } from 'json2csv';

export function buildCsv(fields: { label: string, value: string }[], data: any): string {
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(data);
    return csv;
}