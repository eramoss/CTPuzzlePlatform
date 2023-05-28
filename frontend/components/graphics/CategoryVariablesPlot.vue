<template>
  <div>
    <div class="flex-row">
      <h2>Análise de categorias</h2>
      <div class="flex-row">
        <span class="right-marged">
          <el-checkbox v-model="useLogScale"
            >Usar escala logarítmica</el-checkbox
          >
        </span>
        <div class="right-marged">
          <el-checkbox v-model="showValuesInPercent">
            Usar porcentagem
          </el-checkbox>
        </div>
        <group-data-loader
          :disabled="selectedSecondCategoricalVariable"
          :testApplication="testApplication"
          @onSelectTestApplication="onSelectGroupToCompare"
        />
      </div>
    </div>
    <el-row :gutter="20">
      <el-col :md="12">
        <select-variables
          :required="true"
          label="Variável categórica principal"
          noDataText="Sem dados. O questionário do teste não foi aplicado ou não possui perguntas de opções."
          type="category"
          defaultValue="tutorial"
          :testApplicationData="testApplicationData"
          :value="selectedCategory"
          @change="selectCategory"
        />
      </el-col>
      <el-col :md="12">
        <select-variables
          label="Variável categórica secundária"
          noDataText="Sem dados. O questionário do teste não foi aplicado ou não possui perguntas de opções."
          type="category"
          defaultValue="tutorial"
          :testApplicationData="testApplicationData"
          :value="selectedSecondCategory"
          @change="selectSecondCategory"
        />
      </el-col>
    </el-row>

    <plot :data="data" :layout="plotLayout" />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Action, Component, Prop, Watch } from "nuxt-property-decorator";
import Plot from "./Plot.vue";
import { CsvData, CsvHeaderLabel } from "~/types/CsvData";
import SelectVariables from "~/components/SelectVariables.vue";
import GroupDataLoader from "~/components/GroupDataLoader.vue";
import TestApplication from "~/types/TestApplication";
import Trace from "~/types/Trace";
import { ACTION_GET_CSV_DATA_TEST_APPLICATION } from "~/store/test-applications";

@Component({
  components: {
    Plot,
    SelectVariables,
    GroupDataLoader,
  },
})
export default class CaregoricalVariablesPlot extends Vue {
  @Prop() testApplication!: TestApplication;
  @Prop() testApplicationData!: CsvData;

  splitByItems = false;
  comparisonGroupData: CsvData = new CsvData();
  comparisonTestApplication: TestApplication = new TestApplication();
  data: any[] = [];
  selectedColumn = new CsvHeaderLabel();
  selectedCategory = new CsvHeaderLabel();
  selectedSecondCategory = new CsvHeaderLabel();
  hideNonInformedCases = true;
  showValuesInPercent = false;
  useLogScale = false;

  get plotLayout() {
    return {
      //title: this.selectedColumnValue,
      barmode: this.isGroupingPlot ? "group" : "",
      yaxis: {
        title: this.showValuesInPercent ? "Porcentagem" : "Total",
        type: this.useLogScale ? "log" : "",
        autorange: true,
      },
      xaxis: {
        title: this.selectedCategoricalVariableLabel,
      },
    };
  }

  get isGroupingPlot() {
    return this.dataGroups.length > 1;
  }

  selectCategory(csvHeaderLabel: CsvHeaderLabel) {
    this.selectedCategory = csvHeaderLabel;
    this.updateData();
  }

  selectSecondCategory(csvHeaderLabel: CsvHeaderLabel) {
    this.selectedSecondCategory = csvHeaderLabel;
    this.updateData();
  }

  get selectedCategoricalVariable(): string {
    return this.selectedCategory.value;
  }

  get selectedSecondCategoricalVariable(): string {
    return this.selectedSecondCategory.value;
  }

  get selectedCategoricalVariableLabel(): string {
    return this.selectedCategoricalVariable || "Itens";
  }

  getDiferentValues(column: CsvHeaderLabel, data: CsvData): string[] {
    let values: string[] = [];
    data.rows.forEach((row) => {
      let value = row[column.value];
      if (values.indexOf(value) == -1) {
        values.push(value);
      }
    });
    return values;
  }

  reduceDataByUsers(csvDataByItems: CsvData): CsvData {
    const csvDataByUsers = new CsvData();
    csvDataByUsers.labels = csvDataByItems.labels;
    let usersIds: any[] = [];
    csvDataByItems.rows.forEach((row) => {
      let userId = row["usuario"];
      if (usersIds.indexOf(userId) == -1) {
        usersIds.push(userId);
        csvDataByUsers.rows.push(row);
      }
    });
    return csvDataByUsers;
  }

  getDataRowsWithVariableEqual(
    csvData: CsvData,
    column: CsvHeaderLabel,
    filter: string
  ): CsvData {
    const filteredCsvData = new CsvData();
    filteredCsvData.labels = csvData.labels;
    csvData.rows.forEach((row) => {
      if (row[column.value] == filter) {
        filteredCsvData.rows.push(row);
      }
    });
    return filteredCsvData;
  }

  get dataGroups(): { groupName: string; data: CsvData }[] {
    let dataGroups: { groupName: string; data: CsvData }[] = [];
    const dataRowsParticipations = this.reduceDataByUsers(
      this.testApplicationData
    );
    if (this.testApplication) {
      dataGroups.push({
        groupName: this.testApplication.name,
        data: dataRowsParticipations,
      });
    }

    if (this.comparisonTestApplication?.id) {
      dataGroups.push({
        groupName: this.comparisonTestApplication.name,
        data: this.reduceDataByUsers(this.comparisonGroupData),
      });
    }

    if (this.selectedSecondCategoricalVariable) {
      dataGroups.splice(0);
      let categories = this.getDiferentValues(
        this.selectedSecondCategory,
        dataRowsParticipations
      ).filter((category) => this.hideNonInformedCases && !!category);

      categories.forEach((category) => {
        dataGroups.push({
          groupName: category,
          data: this.getDataRowsWithVariableEqual(
            dataRowsParticipations,
            this.selectedSecondCategory,
            category
          ),
        });
      });
    }

    return dataGroups;
  }

  updateData() {
    const traces: Trace[] = [];

    if (!this.selectedCategoricalVariable) {
      let firstCaregoricVariable = this.testApplicationData.labels.find(
        (label) => label.type == "category"
      );
      if (firstCaregoricVariable) {
        this.selectedCategory = firstCaregoricVariable;
      }
    }

    this.dataGroups.forEach((dataGroup) => {
      let trace: { name: string; x: string[]; y: number[]; type: string } = {
        name: dataGroup.groupName,
        x: [],
        y: [],
        type: "bar",
      };

      let categoryDataByUser: Map<string, { total: number }> = new Map<
        string,
        { total: number }
      >();

      const question = this.testApplication?.test?.userDataToRequest?.find(
        (it) => it.name == this.selectedCategoricalVariable
      );
      question?.options.forEach((category) => {
        categoryDataByUser.set(category.name, {
          total: 0,
        });
      });

      dataGroup.data.rows
        .filter((row) => {
          return (
            this.hideNonInformedCases && !!row[this.selectedCategoricalVariable]
          );
        })
        .forEach((row) => {
          let xCategoryLabel = row[this.selectedCategoricalVariable];
          let item = categoryDataByUser.get(xCategoryLabel);
          item!.total++;
        });

      let totalOfTotals = 0;
      categoryDataByUser.forEach((value: { total: number }) => {
        totalOfTotals += value.total;
      });

      categoryDataByUser.forEach(
        (value: { total: number }, category: string) => {
          let y = value.total;
          if (this.showValuesInPercent) {
            y = (value.total / totalOfTotals) * 100;
          }
          trace.x.push(category);
          trace.y.push(y);
        }
      );
      traces.push(trace);
    });

    this.data = this.sortLabels(traces);
  }

  sortLabels(traces: Trace[]): Trace[] {
    return traces;
  }

  @Watch("testApplicationData", { immediate: true })
  onChangeTestApplicationData() {
    this.updateData();
  }

  @Watch("showValuesInPercent")
  onChangeShowValuesInPercent() {
    this.updateData();
  }

  @Watch("useLogScale")
  onChangeUseLogScale() {
    this.updateData();
  }

  @Action(ACTION_GET_CSV_DATA_TEST_APPLICATION) getCsvData!: (
    testApplication: TestApplication
  ) => Promise<CsvData>;

  async onSelectGroupToCompare(testApplication: TestApplication) {
    this.comparisonTestApplication = testApplication;
    if (this.comparisonTestApplication?.id) {
      this.comparisonGroupData = await this.getCsvData(testApplication);
    }
    this.updateData();
  }
}
</script>