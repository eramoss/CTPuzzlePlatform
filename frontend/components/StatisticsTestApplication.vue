<template>
  <div>
    <div class="panel big-shadow">
      <div>
        <div class="flex-row">
          <h3>Aplicação</h3>
          <el-button @click="$emit('onRemove')" type="text" size="large">
            <i class="el-icon-close" style="font-size: 20pt"></i>
          </el-button>
        </div>
        <el-select
          v-model="panel.testApplication"
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
            :appliedFilters="panel.filters"
            ref="statisticsFilter"
            button-text="Filtrar"
            :disabled="!panel.testApplication"
            :headers="csvHeaders"
            :csv="csv"
            @onUpdateCsvData="onUpdateCsvData"
            @onUpdateFilters="saveFilters"
            @reload="reloadAndFilter"
          />
          <statistics-transform
            :appliedTransforms="panel.transforms"
            ref="statisticsTransform"
            button-text="Agrupar"
            :disabled="!panel.testApplication"
            :headers="csvHeaders"
            :csv="csv"
            @onUpdateCsvData="onUpdateCsvData"
            @onUpdateTransforms="saveTransforms"
            @reload="reloadAndFilter"
          />
          <el-button
            :disabled="!panel.testApplication"
            @click="resetCsv"
            :loading="reseting"
          >
            Desfazer filtros e agrupamentos
          </el-button>
        </div>
        <spread-sheet
          v-loading="loading"
          ref="spreadSheet"
          phraseWhenZeroLines="(Selecione uma aplicação ou restaure os dados)"
          class="top-marged"
          v-model="csv"
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
                  v-model="panel.selectedHeaders"
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
                placeholder="Selecione o gráfico"
                v-model="panel.measure"
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
import {
  Action,
  Component,
  Prop,
  Ref,
  VModel,
  Watch,
} from "nuxt-property-decorator";
import TestApplication from "~/types/TestApplication";
import {
  CsvData,
  csvDataToCsvFormatted,
  CsvHeaderLabel,
  CSV_SEPARATOR,
  getCsvHeaders,
  trimCsvData,
} from "~/types/CsvData";
import { Measure, availableMeasures } from "~/types/StatisticMeasures";
import { ACTION_GET_CSV_DATA_TEST_APPLICATION } from "~/store/test-applications";
import { ACTION_R_PLOT } from "~/store/r";
import { PlotRequest, PlotResponse } from "~/types/plot";
import SpreadSheet from "~/components/SpreadSheet.vue";
import StatisticsFilter from "./StatisticsFilter.vue";
import StatisticsTransform from "./StatisticsTransform.vue";
import StatisticsPanel from "~/types/StatisticsPanel";
import LogicFilter from "~/types/LogicFilter";
import { TransformOperation } from "~/types/TransformOperation";

@Component({
  components: {
    StatisticsFilter,
    StatisticsTransform,
    SpreadSheet,
  },
})
export default class StatisticsTestApplication extends Vue {
  @Prop() testApplications!: TestApplication[];
  @Prop() value!: StatisticsPanel;

  panel: StatisticsPanel = new StatisticsPanel();

  @Watch("value", { immediate: true })
  onChangeValue() {
    if (this.value.testApplication) {
      Vue.set(this, "panel", this.value);
      /* if (!this.panel.selectedHeaders) {
        this.panel.selectedHeaders = [];
      } */
    }
  }

  @Watch("panel", { deep: true }) onUpdatePanel() {
    this.$emit("input", this.panel);
  }

  loading = false;
  reseting = false;
  csvData: CsvData = new CsvData();
  plotResponse: PlotResponse = new PlotResponse();
  csv: string = "";
  selectedData: string = "";

  @Ref() statisticsFilter!: StatisticsFilter;
  @Ref() statisticsTransform!: StatisticsTransform;
  @Ref() spreadSheet!: SpreadSheet;

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
    let hasChoosedLabels = this.panel.selectedHeaders.length;
    if (hasChoosedLabels) {
      let lines = this.csv.split("\n");
      let headers = lines[0]
        .split(CSV_SEPARATOR)
        .map((header) => header.trim());

      let columnsIndexes = this.panel.selectedHeaders
        .map((header) => headers.indexOf(header))
        .filter((index) => index != -1);

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

  async resetCsv() {
    try {
      this.reseting = true;
      this.loadCsv(this.panel.testApplication);
      try {
        let action = await this.$alert(
          "Limpar os filtros e agrupamentos? Pode ser útil mantê-los para aplicar novamente depois.",
          "Limpar filtros?",
          {
            confirmButtonText: "Limpar",
            cancelButtonText: "Manter",
            showCancelButton: true,
          }
        );
        if (action == "confirm") {
          this.undoFilterAndTransform();
        }
      } catch (e) {}
    } finally {
      this.reseting = false;
    }
  }

  undoFilterAndTransform() {
    this.statisticsFilter?.undoFilter();
    this.statisticsFilter?.filter();
    this.statisticsTransform?.undoTransform();
    this.statisticsTransform?.transform();
  }

  async plotData() {
    if (
      !this.panel?.measure.id?.length ||
      !this.panel?.selectedHeaders?.length
    ) {
      return;
    }
    try {
      this.loading = true;
      const plotRequest = new PlotRequest();
      plotRequest.id = this.panel.measure.id;
      plotRequest.csv = trimCsvData(this.selectedData);
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
    this.updateAndPlot();
    this.spreadSheet?.scrollToStart();
  }

  saveFilters(filters: LogicFilter[]) {
    this.$emit("saveFilters", this.panel, filters);
  }

  saveTransforms(transforms: TransformOperation[]) {
    this.$emit("saveTransforms", this.panel, transforms);
  }

  async loadCsv(testApplication: TestApplication) {
    this.loading = true;
    try {
      if (testApplication) {
        let csvData = await this.getCsvData(testApplication);
        this.onUpdateCsvData(csvData);
      }
    } catch (e) {
      this.$notify.error("Não foi possível carregar os dados");
    } finally {
      this.loading = false;
    }
  }

  async reloadAndFilter() {
    await this.loadCsv(this.panel.testApplication);
    this.statisticsFilter?.filter();
    this.$nextTick(() => {
      this.statisticsTransform?.transform();
    });
  }

  async mounted() {
    if (this.panel) {
      this.reloadAndFilter();
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