<template>
  <div>
    <div class="panel shadow">
      <div>
        <h3>Selecione a aplicação</h3>
        <el-select
          v-model="testApplication"
          placeholder="Selecione a aplicação para verificar as estatísticas"
          hasChoosedLabels-key="id"
          @change="loadCsv"
          filterable
          clearable
          value-key="id"
        >
          <el-option
            v-for="application in testApplications"
            :key="application.id"
            :value="application"
            :label="application.name"
          >
          </el-option>
        </el-select>
      </div>

      <div class="top-marged">
        <div class="left flex-row">
          <statistics-filter
            :disabled="!testApplication.id"
            :csvData="csvData"
            @onUpdateCsvData="onUpdateCsvData"
          />
          <statistics-transform
            :disabled="!testApplication.id"
            :csvData="csvData"
            @onUpdateCsvData="onUpdateCsvData"
          />
          <el-button :disabled="!testApplication.id" @click="resetCsv"
            >Restaurar</el-button
          >
        </div>
        <spread-sheet
          class="top-marged"
          v-model="csv"
          @input="updateAndPlot"
          :cols="170"
        />
      </div>

      <div class="top-marged">
        <h3>Selecione a medida</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-row>
              <el-select
                v-model="measure"
                @change="updateAndPlot"
                value-key="name"
              >
                <el-option
                  :key="m.name"
                  :value="m"
                  :label="m.name"
                  v-for="m in availableMeasures"
                >
                </el-option>
              </el-select>
            </el-row>
            <el-row class="top-marged">
              <thumbnail
                v-loading="loading"
                width="500px"
                height="500px"
                :src="plotResponse.plotFileName"
              />
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-checkbox-group
                v-model="selectedHeaders"
                @change="updateAndPlot"
              >
                <el-checkbox
                  v-for="header in csvHeaders"
                  :key="header"
                  :label="header"
                ></el-checkbox>
              </el-checkbox-group>
            </el-row>
            <el-row class="top-marged">
              <spread-sheet v-model="selectedData" :cols="70" />
              <el-button
                :disabled="loading"
                @click="plotData"
                icon="el-icon-arrow-left"
                >Atualizar gráfico</el-button
              >
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Action, Component, Prop } from "nuxt-property-decorator";
import TestApplication from "~/types/TestApplication";
import {
  CsvData,
  csvDataToCsv,
  CsvHeaderLabel,
  CSV_SEPARATOR,
  getCsvHeaders,
} from "~/types/CsvData";
import { Measure, availableMeasures } from "~/types/StatisticMeasures";
import { ACTION_GET_CSV_DATA_TEST_APPLICATION } from "~/store/test-applications";
import { ACTION_R_PLOT } from "~/store/r";
import { PlotRequest, PlotResponse } from "~/types/plot";
import SpreadSheet from "~/components/SpreadSheet.vue";
import StatisticsFilter from "./StatisticsFilter.vue";
import StatisticsTransform from "./StatisticsTransform.vue";

@Component({
  components: {
    StatisticsFilter,
    StatisticsTransform,
    SpreadSheet,
  },
})
export default class StatisticsTestApplication extends Vue {
  @Prop() testApplications!: TestApplication[];

  testApplication: TestApplication = new TestApplication();
  measure: Measure = new Measure("", "");
  loading = false;
  csvData: CsvData = new CsvData();
  plotResponse: PlotResponse = new PlotResponse();
  csv: string = "";
  selectedData: string = "";
  selectedHeaders: string[] = [];

  get csvHeaders(): string[] {
    return getCsvHeaders(this.csv);
  }

  @Action(ACTION_GET_CSV_DATA_TEST_APPLICATION) getCsvData!: (
    testApplication: TestApplication
  ) => Promise<CsvData>;

  @Action(ACTION_R_PLOT) plot!: (
    plotRequest: PlotRequest
  ) => Promise<PlotResponse>;

  get availableMeasures(): Measure[] {
    return availableMeasures;
  }

  get labels(): CsvHeaderLabel[] {
    return this.csvData?.labels;
  }

  updateAndPlot() {
    this.updateSelectedData();
    this.plotData();
  }

  updateSelectedData() {
    let selectedData = "";
    let hasChoosedLabels = this.selectedHeaders.length;
    if (hasChoosedLabels) {
      let lines = this.csv.split("\n");
      let headers = lines[0].split(CSV_SEPARATOR);

      let columnsIndexes = this.selectedHeaders.map((header) =>
        headers.indexOf(header)
      );

      lines.forEach((line: string) => {
        let columns = line.split(CSV_SEPARATOR);
        let row = columnsIndexes
          .map((index) => columns[index])
          .join(CSV_SEPARATOR);
        selectedData += row + "\n";
      });
    }
    this.selectedData = selectedData;
  }

  resetCsv() {
    this.loadCsv(this.testApplication);
  }

  async plotData() {
    if (!this.measure.id?.length || !this.selectedHeaders.length) {
      return;
    }
    try {
      this.loading = true;
      const plotRequest = new PlotRequest();
      plotRequest.id = this.measure.id;
      plotRequest.csv = this.selectedData;
      let plotResponse = await this.plot(plotRequest);
      plotResponse.plotFileName += "?" + new Date().getTime();
      this.plotResponse = plotResponse;
    } catch (e) {
      console.error(e);
      this.$notify.error("Não foi possível plotar");
    } finally {
      this.loading = false;
    }
  }

  onUpdateCsvData(csvData: CsvData) {
    this.csvData = csvData;
    this.csv = csvDataToCsv(this.csvData);
  }

  async loadCsv(testApplication: TestApplication) {
    if (testApplication) {
      let csvData = await this.getCsvData(testApplication);
      this.csvData = csvData;
      this.csv = csvDataToCsv(csvData);
      this.plotData();
    }
  }
}
</script>