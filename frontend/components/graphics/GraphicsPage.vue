<template>
  <div>
    <el-row class="panel shadow top-marged">
      <el-col :md="12">
        <parameters-estimation-plot
          :testApplicationData="testApplicationData"
        />
      </el-col>
      <el-col :md="12">
        <item-response-theory-plot :testApplicationData="testApplicationData" />
      </el-col>
    </el-row>
    <el-row class="panel shadow top-marged">
      <el-col :span="24">
        <test-items-box-plot
          :testApplicationData="testApplicationData"
        ></test-items-box-plot>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "nuxt-property-decorator";
import TestItemsBoxPlot from "./TestItemsBoxPlot.vue";
import ItemResponseTheoryPlot from "./ItemResponseTheoryPlot.vue";
import ParametersEstimationPlot from "./ParametersEstimationPlot.vue";
import { CsvData } from "~/types/CsvData";
@Component({
  components: {
    TestItemsBoxPlot,
    ItemResponseTheoryPlot,
    ParametersEstimationPlot,
  },
})
export default class GraphicsPage extends Vue {
  @Prop() testApplicationData!: CsvData;
}
</script>