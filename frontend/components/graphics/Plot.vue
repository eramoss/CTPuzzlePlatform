<template>
  <div>
    <div :ref="randomId"></div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "nuxt-property-decorator";
import { v4 as uuidv4 } from "uuid";

function generateExampleData() {
  var y0 = [];
  var y1 = [];
  for (var i = 0; i < 50; i++) {
    y0[i] = Math.random();
    y1[i] = Math.random() + 1;
  }

  var trace1 = {
    y: y0,
    type: "box",
    name: "Item 1",
  };

  var trace2 = {
    y: y1,
    type: "box",
    name: "Item 2",
  };

  return [trace1, trace2];
}

@Component({
  components: {},
})
export default class Plot extends Vue {
  @Prop({}) propName!: string;

  randomId: string = uuidv4();

  @Prop({
    default: () => {
      return generateExampleData();
    },
  })
  data!: any[];

  @Prop({
    default: {
      title: "Título",
    },
  })
  layout!: {};

  plotly: any;

  async initializePlotly() {
    this.plotly = await import("plotly.js-dist-min");
  }

  async plot() {
    if (process.browser) {
      await this.initializePlotly();
      this.plotly.newPlot(this.plotDiv, this.data, this.layout, this.config);
    }
  }

  get config(){
      return {
          responsive: true
      }
  }

  get plotDiv() {
    return this.$refs[this.randomId];
  }

  @Watch("data", { immediate: true })
  onChangeData() {
    this.plot();
  }
}
</script>