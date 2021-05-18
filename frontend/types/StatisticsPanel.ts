import LogicFilter from "./LogicFilter";
import { Measure } from "./StatisticMeasures";
import TestApplication from "./TestApplication";

export default class StatisticsPanel {
    id!: string;
    testApplication!: TestApplication 
    selectedHeaders: string[] = []
    measure: Measure = new Measure("", "");
    filters: LogicFilter[] = []
}