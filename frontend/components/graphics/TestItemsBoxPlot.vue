<template>
  <div>
    <select-numeric-variables
      defaultValue='escore_obtido'
      :testApplicationData="testApplicationData"
      @change="selectColumn"
    />
    <plot :data="data" :layout="plotLayout" />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "nuxt-property-decorator";
import Plot from "./Plot.vue";
import { CsvData, CsvHeaderLabel } from "~/types/CsvData";
import SelectNumericVariables from "~/components/SelectNumericVariables.vue";

@Component({
  components: {
    Plot,
    SelectNumericVariables,
  },
})
export default class TestItemsBoxPlot extends Vue {
  @Prop() testApplicationData!: CsvData;

  data: any[] = [];
  selectedColumn = new CsvHeaderLabel();

  get plotLayout() {
    return {
      title: this.selectedColumnValue,
      yaxis: {
        title: this.selectedColumnValue,
      },
      xaxis: {
        title: "itens do teste",
      },
    };
  }

  selectColumn(csvHeaderLabel: CsvHeaderLabel) {
    this.selectedColumn = csvHeaderLabel;
    this.updateData();
  }

  get selectedColumnValue() {
    return this.selectedColumn?.value;
  }

  updateData() {
    let scoresByItems: Map<string, { scores: number[] }> = new Map<
      string,
      { scores: [] }
    >();

    this.testApplicationData?.rows
      .sort((a, b) => a["item_order"] - b["item_order"])
      .forEach((row) => {
        let itemLabelInGraphic = `Item ${row["item_order"] + 1}`;
        if (!scoresByItems.get(itemLabelInGraphic)) {
          scoresByItems.set(itemLabelInGraphic, {
            scores: [],
          });
        }
        scoresByItems
          .get(itemLabelInGraphic)
          ?.scores.push(row[this.selectedColumnValue]);
      });
    const data: any[] = [];
    scoresByItems.forEach((value: { scores: number[] }, itemName: string) => {
      data.push({
        y: value.scores,
        type: "box",
        name: itemName,
      });
    });
    this.data = data;
  }

  @Watch("testApplicationData", { immediate: true })
  onChangeTestApplicationData() {
    this.updateData();
  }
}
</script>