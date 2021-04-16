export class PlotRequest {
    fn!: string;
    data: any;
}

export class PlotResponse {
    data: any;
    err: any
    plotFileName!: string;
}