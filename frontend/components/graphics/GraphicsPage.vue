<template>
  <div>
    <el-row class="panel shadow top-marged">
      <el-col :span="24">
        <category-variables-plot
          :testApplication="testApplication"
          :testApplicationData="testApplicationData"
        ></category-variables-plot>
      </el-col>
    </el-row>
    <el-row class="panel shadow top-marged">
      <el-col :span="24">
        <test-items-box-plot
          :testApplication="testApplication"
          :testApplicationData="testApplicationData"
        ></test-items-box-plot>
      </el-col>
    </el-row>
    <el-row class="panel shadow top-marged">
      <el-col :span="24">
        <el-checkbox v-model="showEstimationInputs"
          >Mostrar campos de parâmetros</el-checkbox
        >
      </el-col>
      <el-col :md="12">
        <parameters-estimation-plot
          :showInputs="showEstimationInputs"
          @onChangePlotParameters="updateParameters"
          @onStartEstimate="clearItemResponseTheoryPlot"
          :testApplication="testApplication"
          :testApplicationData="testApplicationData"
        />
      </el-col>
      <el-col :md="12">
        <item-response-theory-plot
          :showInputs="showEstimationInputs"
          ref="itemResponseTheoryPlot"
        />
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Ref, Watch } from "nuxt-property-decorator";
import TestItemsBoxPlot from "./TestItemsBoxPlot.vue";
import ItemResponseTheoryPlot from "./ItemResponseTheoryPlot.vue";
import ParametersEstimationPlot from "./ParametersEstimationPlot.vue";
import CategoryVariablesPlot from "./CategoryVariablesPlot.vue";
import TestApplication from "~/types/TestApplication";
import { CsvData } from "~/types/CsvData";
import CciPlotParameters from "~/types/CciPlotParameters";
@Component({
  components: {
    TestItemsBoxPlot,
    ItemResponseTheoryPlot,
    ParametersEstimationPlot,
    CategoryVariablesPlot,
  },
})
export default class GraphicsPage extends Vue {
  @Prop() testApplication!: TestApplication;
  @Prop() testApplicationData!: CsvData;

  showEstimationInputs = false;

  @Ref() itemResponseTheoryPlot!: ItemResponseTheoryPlot;

  updateParameters(parameters: CciPlotParameters) {
    this.itemResponseTheoryPlot?.setParameters(parameters);
  }

  clearItemResponseTheoryPlot() {
    this.itemResponseTheoryPlot?.clear();
  }

  @Watch("testApplicationData") onChangeData() {
    this.itemResponseTheoryPlot?.clear();
  }
}
</script>