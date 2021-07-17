<template>
  <div>
    <div class="flex-row">
      <h2>Análise de categorias</h2>
      <group-data-loader
        :testApplication="testApplication"
        @onSelectTestApplication="onSelectGroupToCompare"
      />
    </div>
    <el-row :gutter="20">
      <el-col :md="24">
        <select-variables
          :required="true"
          label="Variável categórica"
          type="category"
          defaultValue="tutorial"
          :testApplicationData="testApplicationData"
          :value="selectedCategory"
          @change="selectCategory"
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

  get plotLayout() {
    return {
      //title: this.selectedColumnValue,
      barmode: this.isGroupingPlot ? "group" : "",
      yaxis: {
        title: "Total",
        //type: "log",
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

  get selectedCategoricalVariable(): string {
    return this.selectedCategory.value;
  }

  get selectedCategoricalVariableLabel(): string {
    return this.selectedCategoricalVariable || "Itens";
  }

  get dataGroups(): { groupName: string; data: CsvData }[] {
    let dataGroups: { groupName: string; data: CsvData }[] = [];

    function reduceDataByUsers(csvDataByItems: CsvData): CsvData {
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

    if (this.testApplication) {
      dataGroups.push({
        groupName: this.testApplication.name,
        data: reduceDataByUsers(this.testApplicationData),
      });
    }

    if (this.comparisonTestApplication.id) {
      dataGroups.push({
        groupName: this.comparisonTestApplication.name,
        data: reduceDataByUsers(this.comparisonGroupData),
      });
    }

    return dataGroups;
  }

  updateData() {
    const traces: {
      x: string[];
      y: number[];
      name: string;
      type: string;
    }[] = [];

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

      dataGroup.data.rows
        .sort(
          (a, b) =>
            a[this.selectedCategoricalVariable] -
            b[this.selectedCategoricalVariable]
        )
        .forEach((row) => {
          let xCategoryLabel = "";
          if (this.selectedCategoricalVariable) {
            xCategoryLabel =
              row[this.selectedCategoricalVariable] || "Não informado";
          }
          if (!categoryDataByUser.get(xCategoryLabel)) {
            categoryDataByUser.set(xCategoryLabel, {
              total: 0,
            });
          }
          let item = categoryDataByUser.get(xCategoryLabel);
          item!.total++;
        });

      categoryDataByUser.forEach(
        (value: { total: number }, category: string) => {
          trace.x.push(category);
          trace.y.push(value.total);
        }
      );
      traces.push(trace);
    });

    this.data = traces;
  }

  @Watch("testApplicationData", { immediate: true })
  onChangeTestApplicationData() {
    this.updateData();
  }

  @Action(ACTION_GET_CSV_DATA_TEST_APPLICATION) getCsvData!: (
    testApplication: TestApplication
  ) => Promise<CsvData>;

  async onSelectGroupToCompare(testApplication: TestApplication) {
    this.comparisonTestApplication = testApplication;
    if (this.comparisonTestApplication.id) {
      this.comparisonGroupData = await this.getCsvData(testApplication);
    }
    this.updateData();
  }
}
</script>