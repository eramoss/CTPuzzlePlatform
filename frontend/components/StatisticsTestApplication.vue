<template>
  <div>
    <div class="panel shadow" v-if="testApplication">
      <div>
        <h3>Selecione a aplicação</h3>
        <el-select
          v-model="testApplication"
          placeholder="Selecione a aplicação para verificar as estatísticas"
          value-key="id"
          @change="loadCsv"
          filterable
          clearable
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
        <h3>Selecione a medida</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-select v-model="measure" @change="plotData" value-key="name">
              <el-option
                :key="m.name"
                :value="m"
                :label="m.name"
                v-for="m in availableMeasures"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="12">
            <el-select
              v-model="choosedLabel"
              @change="plotData"
              value-key="value"
            >
              <el-option
                :key="choosedLabel.value"
                :value="choosedLabel"
                :label="choosedLabel.label"
                v-for="choosedLabel in labels"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row class="top-marged">
          <el-col :span="12">
            <thumbnail
              v-loading="loading"
              width="500px"
              height="500px"
              :src="plotResponse.plotFileName"
            />
          </el-col>
          <el-col :span="12">
            {{ selectedData }}
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
import { CsvData, CsvHeaderLabel } from "~/types/CsvData";
import { Measure, availableMeasures } from "~/types/StatisticMeasures";
import { ACTION_GET_CSV_DATA_TEST_APPLICATION } from "~/store/test-applications";
import { ACTION_R_PLOT } from "~/store/r";
import { PlotRequest, PlotResponse } from "~/types/plot";

@Component
export default class StatisticsTestApplication extends Vue {
  @Prop() testApplications!: TestApplication[];
  testApplication: TestApplication = new TestApplication();
  measure: Measure = new Measure("", "");
  loading = false;
  choosedLabel: CsvHeaderLabel = new CsvHeaderLabel();
  csvData: CsvData = new CsvData();
  plotResponse: PlotResponse = new PlotResponse();

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

  get selectedData(): any[] {
    let selectedData = [];
    if (this.choosedLabel.value) {
      selectedData = this.csvData?.rows?.map(
        (row) => row[this.choosedLabel.value]
      );
    }
    return selectedData;
  }

  async plotData() {
    if (!this.measure.fn?.length || !this.choosedLabel.value) {
      return;
    }
    try {
      this.loading = true;
      const plotRequest = new PlotRequest();
      plotRequest.fn = this.measure.fn;

      let filteredCsvData = new CsvData();
      filteredCsvData.labels = [this.choosedLabel];
      filteredCsvData.rows = this.csvData.rows.map((row) => {
        let filteredRow: any = {};
        filteredRow[this.choosedLabel.value] = row[this.choosedLabel.value];
        return filteredRow;
      });

      plotRequest.data = filteredCsvData;
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

  async loadCsv(testApplication: TestApplication) {
    if (testApplication) {
      let csvData = await this.getCsvData(testApplication);
      this.csvData = csvData;
      this.plotData();
    }
  }
}
</script>