<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/platform' }"
        >Plataforma</el-breadcrumb-item
      >
      <el-breadcrumb-item>Estatísticas</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="left panel">
      <h2>Estatísticas</h2>

      <el-select
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

      <div class="flex-row end">
        <el-tooltip
          effect="light"
          content="Download arquivo csv separado por ';'"
        >
          <el-button
            :disabled="!totalDataRows"
            type="text"
            @click="showDialogDownloadCsv"
            icon="el-icon-download"
            >Baixar</el-button
          >
        </el-tooltip>
      </div>
      <el-table
        id="dataTable"
        v-loading="loadingTestApplicationData"
        element-loading-text="Carregando dados..."
        highlight-current-row
        ref="dataTable"
        size="small"
        border
        stripe
        height="500"
        :data="getLoadedRows"
        empty-text="Não há dados carregados. Selecione uma aplicação de teste."
      >
        <el-table-column
          v-for="header in testApplicationData.labels"
          :label="header.label"
          :key="header.label"
          :width="calculateColumnWidth(header)"
          :prop="header.value"
          :fixed="calculateColumnFixPosition(header)"
        >
          <template slot-scope="{ row }">
            {{ columnToString(row[header.value]) }}
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-table>
          <el-table-column></el-table-column>
      </el-table> -->
      <div class="flex-row">
        <div v-show="totalDataRows">
          Mostrando {{ totalLoadedRows }} linhas de {{ totalDataRows }}
        </div>
        <div class="loading-indicator" :class="{ visible: loadingMoreRows }">
          <i class="el-icon-loading"></i> Carregando mais linhas...
        </div>
      </div>
      <download-csv-data-dialog :csvData="testApplicationData" ref="downloadCsvDialog" />
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
import {
  ACTION_GET_CSV_DATA_TEST_APPLICATION,
  ACTION_PAGINATE_APPLICATIONS,
} from "~/store/test-applications";
import {
  CsvData,
  CsvHeaderLabel,
  getLengthOfBigLengthValue,
  stringfyCsvColumnDataRow,
} from "~/types/CsvData";
import { ElTable } from "element-ui/types/table";

const TOKEN_LOCAL_STORAGE_TEST_APPLICATION_ID = "TEST_APPLICATION_ID";
const statistics = namespace("statistics");

@Component({
  components: {
    StatisticsTestApplication,
    DownloadCsvDataDialog,
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
        this.totalLoadedRows = 20;
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
    let columnWidth =
      getLengthOfBigLengthValue(this.testApplicationData, header, 10) * 8;
    if (columnWidth < 100) {
      columnWidth = 100;
    }
    return columnWidth;
  }

  calculateColumnFixPosition(header: CsvHeaderLabel): string | boolean {
    let fixed: string | boolean = false;
    if (header.value == "escore_obtido") {
      fixed = "right";
    }
    return fixed;
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
    }, 500);
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
        this.loadMoreRows(10);
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
.loading-indicator {
  opacity: 0;
  transition: opacity 500ms ease-out;
}
.loading-indicator.visible {
  opacity: 1;
}
#dataTable {
  margin-top: 0;
  padding-top: 0;
}
</style>