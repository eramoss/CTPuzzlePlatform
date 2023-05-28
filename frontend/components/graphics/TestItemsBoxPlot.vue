<template>
  <div>
    <div class="flex-row">
      <h2>Box plots</h2>
      <div class="flex-row left">
        <span class="right-marged">
          <el-checkbox v-model="useLogScale"
            >Usar escala logarítmica</el-checkbox
          >
        </span>
        <span class="right-marged">
          <el-checkbox v-model="splitByItems">Separar por itens</el-checkbox>
        </span>
        <group-data-loader
          :testApplication="testApplication"
          @onSelectTestApplication="onSelectGroupToCompare"
        />
      </div>
    </div>
    <el-row :gutter="20">
      <el-col :md="12">
        <select-variables
          :required="true"
          label="Variável numérica"
          defaultValue="escore_obtido"
          :testApplicationData="testApplicationData"
          @change="selectColumn"
        />
      </el-col>
      <el-col :md="12">
        <select-variables
          label="Variável categórica"
          type="category"
          defaultValue="tutorial"
          :testApplicationData="testApplicationData"
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
import BoxItem from "~/types/BoxItem";
import { ACTION_GET_CSV_DATA_TEST_APPLICATION } from "~/store/test-applications";

@Component({
  components: {
    Plot,
    SelectVariables,
    GroupDataLoader,
  },
})
export default class TestItemsBoxPlot extends Vue {
  @Prop() testApplication!: TestApplication;
  @Prop() testApplicationData!: CsvData;

  splitByItems = true;
  useLogScale = false;
  comparisonGroupData: CsvData = new CsvData();
  comparisonTestApplication: TestApplication = new TestApplication();
  data: any[] = [];
  selectedColumn = new CsvHeaderLabel();
  selectedCategory = new CsvHeaderLabel();

  get plotLayout() {
    return {
      //title: this.selectedColumnValue,
      boxmode: this.isGroupingPlot ? "group" : "",
      yaxis: {
        title: this.selectedColumnValue,
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

  selectColumn(csvHeaderLabel: CsvHeaderLabel) {
    this.selectedColumn = csvHeaderLabel;
    this.updateData();
  }

  selectCategory(csvHeaderLabel: CsvHeaderLabel) {
    this.selectedCategory = csvHeaderLabel;
    this.updateData();
  }

  get selectedColumnValue() {
    return this.selectedColumn?.value;
  }

  get selectedCategoricalVariable(): string {
    return this.selectedCategory.value;
  }

  get selectedCategoricalVariableLabel(): string {
    return this.selectedCategoricalVariable || "Itens";
  }

  get dataGroups(): { groupName: string; data: CsvData }[] {
    let dataGroups: { groupName: string; data: CsvData }[] = [];

    if (this.testApplication) {
      dataGroups.push({
        groupName: this.testApplication.name,
        data: this.testApplicationData,
      });
    }

    if (this.comparisonTestApplication.id) {
      dataGroups.push({
        groupName: this.comparisonTestApplication.name,
        data: this.comparisonGroupData,
      });
    }

    return dataGroups;
  }

  updateData() {
    const traces: any[] = [];

    let scoresByItems: BoxItem[] = [];

    this.dataGroups.forEach((dataGroup) => {
      dataGroup.data.rows.forEach((row) => {
        let itemName = "";
        if (this.splitByItems) {
          itemName = `Item ${row["item_order"] + 1}`;
        }
        let category = "";
        if (this.selectedCategoricalVariable) {
          category = row[this.selectedCategoricalVariable] || "Não informado";
        }

        let newBox = new BoxItem();
        newBox.category = category;
        newBox.itemName = itemName;

        let box = scoresByItems.find((it) => it.isEquals(newBox));

        if (!box) {
          box = newBox;
          scoresByItems.push(box);
        }

        box?.scores.push(row[this.selectedColumnValue]);
        box?.groupNames.push(dataGroup.groupName);
      });
    });

    scoresByItems
      .sort((a, b) => a.compareItemNumber(b))
      .sort((a, b) => a.compareCategory(b, this.categories))
      .forEach((value: BoxItem) => {
        const trace: any = {
          y: value.scores,
          name: value.getLabel(),
          type: "box",
        };
        if (this.isGroupingPlot) {
          trace.x = value.groupNames;
        }
        traces.push(trace);
      });
    this.data = traces;
  }

  get categories() {
    const question = this.testApplication?.test?.userDataToRequest?.find(
      (it) => it.name == this.selectedCategoricalVariable
    );
    const categories: string[] = [];
    question?.options?.forEach((option) => {
      categories.push(option.name);
    });
    return categories;
  }

  @Watch("testApplicationData", { immediate: true })
  onChangeTestApplicationData() {
    this.updateData();
  }

  @Watch("splitByItems")
  onChangeSplitByItems() {
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
    if (this.comparisonTestApplication.id) {
      this.comparisonGroupData = await this.getCsvData(testApplication);
    }
    this.updateData();
  }
}
</script>