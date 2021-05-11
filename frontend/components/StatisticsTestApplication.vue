<template>
  <div>
    <div class="panel shadow">
      <div>
        <div class="flex-row">
          <h3>Aplicação</h3>
          <el-button
            title="Remover painel"
            @click="$emit('onRemove')"
            type="text"
            size="large"
            >Remover painel</el-button
          >
        </div>
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
            button-text="Filtrar"
            :disabled="!testApplication.id"
            :csvData="csvData"
            @onUpdateCsvData="onUpdateCsvData"
          />
          <statistics-transform
            button-text="Agrupar"
            :disabled="!testApplication.id"
            :csvData="csvData"
            @onUpdateCsvData="onUpdateCsvData"
          />
          <el-button :disabled="!testApplication.id" @click="resetCsv">
            Desfazer filtros e agrupamentos
          </el-button>
        </div>
        <spread-sheet
          phraseWhenZeroLines="(Selecione uma aplicação ou restaure os dados)"
          class="top-marged"
          v-model="csv"
          @input="updateAndPlot"
          :cols="170"
        />
      </div>

      <div class="top-marged">
        <el-row :gutter="20">
          <el-col :span="12">
            <h3>Colunas</h3>
            <el-row>
              <el-col>
                <el-checkbox-group
                  v-model="selectedHeaders"
                  @change="updateAndPlot"
                >
                  <el-checkbox
                    class="checkbox-column"
                    :title="header"
                    style="
                      width: 200px;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    "
                    v-for="header in csvHeaders"
                    :key="header"
                    :label="header"
                  ></el-checkbox>
                </el-checkbox-group>
              </el-col>
              <el-col>
                <spread-sheet v-model="selectedData" :cols="70" />
                <el-col align="end">
                  <el-button
                    :disabled="loading"
                    @click="plotData"
                    type="primary"
                    >Atualizar gráfico</el-button
                  >
                </el-col>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <h3>Gráfico</h3>
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
              <el-col align="center">
                <thumbnail
                  v-loading="loading"
                  width="400px"
                  height="400px"
                  :src="plotResponse.plotFileName"
                />
              </el-col>
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
  csvDataToCsvFormatted,
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
      let headers = lines[0].split(CSV_SEPARATOR).map(header=>header.trim());

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
    this.csv = csvDataToCsvFormatted(this.csvData);
  }

  async loadCsv(testApplication: TestApplication) {
    if (testApplication) {
      let csvData = await this.getCsvData(testApplication);
      this.csvData = csvData;
      this.csv = csvDataToCsvFormatted(csvData);
      this.plotData();
    }
  }
}
</script>
<style lang="scss">
.checkbox-column {
  .el-checkbox__label {
    display: inline;
  }
}
</style>