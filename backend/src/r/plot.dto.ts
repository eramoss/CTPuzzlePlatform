import { CsvData } from "src/util/download";

export class PlotRequest {
    fn!: string;
    data: CsvData;
    csv: string;
}

export class PlotResponse {
    data: any;
    err: any;
    plotFileName: string;
}