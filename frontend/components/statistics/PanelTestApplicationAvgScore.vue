<template>
  <div class="top-marged">
    <color-panel
      :showInfo="true"
      icon="score"
      label="Escore médio"
      :loading="loading"
      element-loading-text="Calculando escore médio..."
      :data="avgScore"
      textColor="#FF7F0E"
      color="#FFDAB9"
    >
      <template slot="info">
        Média dos escores obtidos em todas as respostas.
      </template>
    </color-panel>
    <r-script-runner ref="rScriptRunner" />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Ref, Watch } from "nuxt-property-decorator";
import ColorPanel from "~/components/ColorPanel.vue";
import { CsvData, csvDataToCsv, CSV_SEPARATOR } from "~/types/CsvData";
import RScriptRunner from "./RScriptRunner.vue";
@Component({
  components: {
    ColorPanel,
    RScriptRunner,
  },
})
export default class PanelTestApplicationAvgScore extends Vue {
  avgScore: any = "...";
  @Prop() testApplicationData!: CsvData;
  @Ref() rScriptRunner!: RScriptRunner;
  loading = true;

  async calculateAvgScore() {
    let scoreObtidoHeader = this.testApplicationData.labels.filter(
      (it) => it.value == "escore_obtido"
    )[0];

    let output = await this.rScriptRunner.run({
      script: `round(mean(items$escore_obtido),3)`,
      csv: csvDataToCsv(this.testApplicationData, [scoreObtidoHeader]),
      separator: CSV_SEPARATOR,
      dataVarName: "items",
    });

    try {
      let match = output.match(/[\d]+[.][\d]*/);
      if (match) {
        this.avgScore = match[0];
      } else {
        this.avgScore = "Indefinido";
      }
    } catch (e) {
      this.avgScore = e;
    } finally {
      this.loading = false;
    }
  }

  @Watch("testApplicationData", { immediate: true })
  async onChangeTestApplicationData() {
    if (!this.testApplicationData) return;
    if (!this.testApplicationData.rows.length) return;
    try {
      this.loading = true;
      await this.calculateAvgScore();
      this.loading = false;
    } finally {
      this.loading = false;
    }
  }
}
</script>