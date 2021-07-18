<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/platform' }">
        Plataforma
      </el-breadcrumb-item>
      <el-breadcrumb-item>Estatísticas</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="left panel">
      <h2>Estatísticas</h2>

      <form-item-label label="Aplicação de teste" :required="true" />
      <select-test-application
        v-model="selectedTestApplication"
        @onLoadWithoutPreviousApplicationSelected="askForSelectTestApplication"
      />

      <div
        v-show="hasSelectedApplication"
        class="panel left top-marged"
        v-loading="loadingTestApplicationData"
        element-loading-text="Carregando dados..."
      >
        <h3>
          <span class="flex-row">
            <span>
              Respostas
              <span v-show="isContentLoaded"
                >({{ totalLoadedRows }}/{{ totalDataRows }})</span
              >
            </span>
            <el-tooltip
              effect="light"
              content="Download arquivo csv separado por ';'"
            >
              <el-button
                :disabled="!isContentLoaded"
                type="primary"
                @click="showDialogDownloadCsv"
                icon="el-icon-download"
                >Baixar</el-button
              >
            </el-tooltip>
            <download-csv-data-dialog
              :csvData="testApplicationData"
              ref="downloadCsvDialog"
            />
          </span>
        </h3>

        <el-table
          id="dataTable"
          highlight-current-row
          ref="dataTable"
          v-loading="loadingMoreRows"
          :element-loading-text="`Carregando mais ${quantityLinesToLoad} linhas...`"
          border
          stripe
          height="500"
          :data="getLoadedRows"
          empty-text="Não há dados carregados. Selecione uma aplicação de teste."
        >
          <el-table-column
            v-for="header in testApplicationData.labels"
            :label="header.label"
            :key="header.value"
            :width="calculateColumnWidth(header)"
            :prop="header.value"
            :fixed="calculateColumnFixPosition(header)"
          >
            <template slot-scope="{ row }">
              {{ columnToString(row[header.value]) }}
            </template>
          </el-table-column>
        </el-table>
        <summary-table :data="testApplicationData" v-show="isContentLoaded" />
      </div>

      <el-row :gutter="20" v-show="hasSelectedApplication" class="top-marged">
        <el-col :md="6">
          <cronbach-alpha-panel :testApplicationData="testApplicationData" />
        </el-col>
        <el-col :md="6">
          <panel-test-application-avg-score
            :testApplicationData="testApplicationData"
          />
        </el-col>
        <el-col :md="6">
          <advance-in-test-panel
            :test="selectedTestApplication.test"
            :testApplicationData="testApplicationData"
          />
        </el-col>
        <el-col :md="6">
          <finish-panel
            :test="selectedTestApplication.test"
            :testApplicationData="testApplicationData"
          />
        </el-col>
      </el-row>

      <graphics-page
        v-show="isContentLoaded"
        ref="graphicsChooserDialog"
        :testApplication="selectedTestApplication"
        :testApplicationData="testApplicationData"
      />

      <r-interpreter
        v-show="isContentLoaded"
        class="top-marged"
        :data="testApplicationData"
      ></r-interpreter>

      <open-responses-viewer
        v-show="isContentLoaded"
        class="top-marged"
        :data="testApplicationData"
      />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Action, Component, Ref, Watch } from "nuxt-property-decorator";

import TestApplication from "~/types/TestApplication";
import SelectTestApplication from "~/components/SelectTestApplication.vue";
import DownloadCsvDataDialog from "~/components/DownloadCsvDataDialog.vue";
import SummaryTable from "~/components/SummaryTable.vue";
import RInterpreter from "~/components/RInterpreter.vue";
import OpenResponsesViewer from "~/components/statistics/OpenResponsesViewer.vue";
import GraphicsPage from "~/components/graphics/GraphicsPage.vue";
import CronbachAlphaPanel from "~/components/statistics/CronbachAlphaPanel.vue";
import FinishPanel from "~/components/statistics/FinishPanel.vue";
import AdvanceInTestPanel from "~/components/statistics/AdvanceInTestPanel.vue";
import PanelTestApplicationAvgScore from "~/components/statistics/PanelTestApplicationAvgScore.vue";
import { ACTION_GET_CSV_DATA_TEST_APPLICATION } from "~/store/test-applications";
import {
  CsvData,
  CsvHeaderLabel,
  getColumnFixPosition,
  getColumnWidth,
  stringfyCsvColumnDataRow,
} from "~/types/CsvData";
import { ElTable } from "element-ui/types/table";

@Component({
  components: {
    SelectTestApplication,
    DownloadCsvDataDialog,
    SummaryTable,
    GraphicsPage,
    RInterpreter,
    CronbachAlphaPanel,
    FinishPanel,
    AdvanceInTestPanel,
    PanelTestApplicationAvgScore,
    OpenResponsesViewer,
  },
})
export default class StatisticsPage extends Vue {
  selectedTestApplication: TestApplication = new TestApplication();
  testApplicationData: CsvData = new CsvData();
  totalLoadedRows = 10;
  loadingMoreRows = true;
  loadingTestApplicationData = true;

  @Ref() dataTable!: ElTable;
  @Ref() downloadCsvDialog!: DownloadCsvDataDialog;

  columnToString(value: any) {
    return stringfyCsvColumnDataRow(value);
  }

  @Action(ACTION_GET_CSV_DATA_TEST_APPLICATION) getCsvData!: (
    testApplication: TestApplication
  ) => Promise<CsvData>;

  @Watch("selectedTestApplication")
  async loadTestApplicationData() {
    if (this.selectedTestApplication) {
      this.loadingTestApplicationData = true;
      try {
        this.testApplicationData = await this.getCsvData(
          this.selectedTestApplication
        );
        this.totalLoadedRows = this.quantityLinesToLoad;
      } catch (e) {
        console.error(e);
        this.$notify({
          type: "error",
          title: "Falha ao carregar",
          message: "Não foi possível carregar os dados da aplicação de teste",
        });
      } finally {
        this.loadingTestApplicationData = false;
        this.loadingMoreRows = false;
      }
    }
  }

  get quantityLinesToLoad() {
    return 20;
  }

  calculateColumnWidth(header: CsvHeaderLabel) {
    return getColumnWidth(this.testApplicationData, header);
  }

  calculateColumnFixPosition(header: CsvHeaderLabel): string | boolean {
    return getColumnFixPosition(header);
  }

  get isContentLoaded() {
    return !!this.totalDataRows;
  }

  get totalDataRows() {
    return this.testApplicationData?.rows?.length;
  }

  get getLoadedRows() {
    return this.testApplicationData?.rows.slice(0, this.totalLoadedRows);
  }

  loadMoreRows(countRowsToLoad: number) {
    this.totalLoadedRows += countRowsToLoad;
    this.loadingMoreRows = true;
    if (this.loadedAllRows) {
      this.totalLoadedRows = this.totalDataRows;
    }
    setTimeout(() => {
      this.loadingMoreRows = false;
    }, 1500);
  }

  get loadedAllRows() {
    return this.totalLoadedRows >= this.totalDataRows;
  }

  get hasSelectedApplication() {
    return this.selectedTestApplication.id;
  }

  configureTableScrollEventListener() {
    const dataTableBody = this.dataTable.$el.getElementsByClassName(
      "el-table__body-wrapper"
    )[0];
    dataTableBody.addEventListener("scroll", () => {
      this.loadMoreRowsIfIsOnEndOfScroll(dataTableBody);
    });
  }

  loadMoreRowsIfIsOnEndOfScroll(dataTableBody: Element) {
    if (this.detectEndOfScroll(dataTableBody)) {
      if (!this.loadedAllRows) {
        this.loadMoreRows(this.quantityLinesToLoad);
      }
    }
  }

  detectEndOfScroll(dataTableBody: Element): boolean {
    return (
      //@ts-ignore
      dataTableBody.offsetHeight + dataTableBody.scrollTop >=
      dataTableBody.scrollHeight
    );
  }

  showDialogDownloadCsv() {
    this.downloadCsvDialog.show();
  }

  askForSelectTestApplication() {
    if (!this.hasSelectedApplication) {
      this.$alert(
        "É necessário selecionar uma aplicação de teste para iniciar as análises",
        "Selecione uma aplicação de teste",
        {
          confirmButtonText: "Entendi",
        }
      );
    }
  }

  mounted() {
    this.configureTableScrollEventListener();
  }
}
</script>
<style lang="scss">
#dataTable {
  margin-top: 0;
  padding-top: 0;
}
</style>