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
      <div class="flex-row">
        <el-select
          :filterable="true"
          v-model="selectedTestApplication"
          value-key="id"
          placeholder="Selecione a aplicação"
        >
          <el-option
            v-for="testApplication in testApplications"
            :key="testApplication.id"
            :label="testApplication.name"
            :value="testApplication"
          ></el-option>
        </el-select>
      </div>

      <div
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

      <graphics-page
        v-show="isContentLoaded"
        ref="graphicsChooserDialog"
        :testApplicationData="testApplicationData"
      />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import {
  Action,
  Component,
  namespace,
  Ref,
  Watch,
} from "nuxt-property-decorator";
import { Context } from "@nuxt/types";
import TestApplication from "~/types/TestApplication";
import StatisticsTestApplication from "~/components/StatisticsTestApplication.vue";
import { PageRequest, PageResponse } from "~/types/pagination";
import DownloadCsvDataDialog from "~/components/DownloadCsvDataDialog.vue";
import SummaryTable from "~/components/SummaryTable.vue";
import GraphicsPage from "~/components/graphics/GraphicsPage.vue";
import {
  ACTION_GET_CSV_DATA_TEST_APPLICATION,
  ACTION_PAGINATE_APPLICATIONS,
} from "~/store/test-applications";
import {
  CsvData,
  CsvHeaderLabel,
  getColumnFixPosition,
  getColumnWidth,
  stringfyCsvColumnDataRow,
} from "~/types/CsvData";
import { ElTable } from "element-ui/types/table";

const TOKEN_LOCAL_STORAGE_TEST_APPLICATION_ID = "TEST_APPLICATION_ID";
const statistics = namespace("statistics");

@Component({
  components: {
    StatisticsTestApplication,
    DownloadCsvDataDialog,
    SummaryTable,
    GraphicsPage,
  },
})
export default class StatisticsPage extends Vue {
  testApplications!: TestApplication[];
  selectedTestApplication: TestApplication = new TestApplication();
  testApplicationData: CsvData = new CsvData();
  totalLoadedRows = 10;
  loadingMoreRows = false;
  loadingTestApplicationData = false;

  @Ref() dataTable!: ElTable;
  @Ref() downloadCsvDialog!: DownloadCsvDataDialog;

  @statistics.Mutation setTest!: (value: string) => void;

  async asyncData(ctx: Context) {
    let pageRequest = new PageRequest({});
    let researchGroup = ctx.$auth.user?.researchGroup;
    if (ctx.$auth.user?.researchGroup) {
      //@ts-ignore
      pageRequest.andWhere = "test.researchGroup.id = " + researchGroup.id;
    }
    let pageResponse: PageResponse<TestApplication> = await ctx.store.dispatch(
      ACTION_PAGINATE_APPLICATIONS,
      pageRequest
    );
    let testApplications = pageResponse.data;
    return {
      testApplications,
    };
  }

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
        this.registerLoadedTestApplicationId();
        this.totalLoadedRows = this.quantityLinesToLoad;
      } catch (e) {
        this.$notify({
          type: "error",
          title: "Falha ao carregar",
          message: "Não foi possível carregar os dados da aplicação de teste",
        });
      } finally {
        this.loadingTestApplicationData = false;
      }
    }
  }

  get quantityLinesToLoad() {
    return 20;
  }

  registerLoadedTestApplicationId() {
    localStorage.setItem(
      TOKEN_LOCAL_STORAGE_TEST_APPLICATION_ID,
      this.selectedTestApplication?.id + ""
    );
  }

  loadPreviousSelectedTestApplicationId(): number | null {
    let applicationId = undefined;
    applicationId = localStorage.getItem(
      TOKEN_LOCAL_STORAGE_TEST_APPLICATION_ID
    );
    applicationId = parseInt("0" + applicationId);
    return applicationId;
  }

  selectTestApplicationById(testApplicationId: number) {
    let testApplication = this.testApplications.find(
      (testApplication) => testApplication.id == testApplicationId
    );
    if (testApplication) {
      this.selectedTestApplication = testApplication;
    }
  }

  loadSavedTestApplication() {
    let testApplicationId = this.loadPreviousSelectedTestApplicationId();
    if (testApplicationId) {
      this.selectTestApplicationById(testApplicationId);
    }
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

  mounted() {
    this.configureTableScrollEventListener();
    this.loadSavedTestApplication();
  }
}
</script>
<style lang="scss">
#dataTable {
  margin-top: 0;
  padding-top: 0;
}
</style>