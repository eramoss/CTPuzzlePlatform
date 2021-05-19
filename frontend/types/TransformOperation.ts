import { OperationOnGroup } from "./StatisticMeasures";

export class TransformOperation {
    id: string = ''
    groupBy = "";
    groupWhat = "";
    onGroupDoWhat: OperationOnGroup<number[], number> = new OperationOnGroup();

}