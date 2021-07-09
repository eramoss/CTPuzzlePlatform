<template>
  <div>
    <el-row class="panel shadow top-marged">
      <el-col :md="12">
        <parameters-estimation-plot
          @onChangePlotParameters="updateParameters"
          :testApplication="testApplication"
          :testApplicationData="testApplicationData"
        />
      </el-col>
      <el-col :md="12">
        <item-response-theory-plot ref="itemResponseTheoryPlot" />
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
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Ref } from "nuxt-property-decorator";
import TestItemsBoxPlot from "./TestItemsBoxPlot.vue";
import ItemResponseTheoryPlot from "./ItemResponseTheoryPlot.vue";
import ParametersEstimationPlot from "./ParametersEstimationPlot.vue";
import TestApplication from "~/types/TestApplication";
import { CsvData } from "~/types/CsvData";
@Component({
  components: {
    TestItemsBoxPlot,
    ItemResponseTheoryPlot,
    ParametersEstimationPlot,
  },
})
export default class GraphicsPage extends Vue {
  @Prop() testApplication!: TestApplication;
  @Prop() testApplicationData!: CsvData;

  @Ref() itemResponseTheoryPlot!: ItemResponseTheoryPlot;

  updateParameters(parameters: { difficulty: number; discrimination: number }) {
    this.itemResponseTheoryPlot?.setParameters(parameters);
  }
  
}
</script>