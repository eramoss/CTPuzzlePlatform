<template>
  <div>
    <color-panel
      :loading="loading"
      element-loading-text="Calculando Alpha de Cronbach..."
      label="Alpha de Cronbach"
      textColor="#1F77B4"
      color="#BAD5E8"
      icon="font_download"
      :showInfo="true"
      :data="alpha"
    >
      <template slot="info">
        O alpha de Cronbach é uma medida de consistência interna. <br />
        Indica o quão relacionados são os itens do teste. <br />
        Varia de 0 a 1: quanto mais próximo de 1, maior a consistência interna
        do teste.
      </template>
    </color-panel>
    <r-script-runner ref="rScriptRunner" />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Ref, Watch } from "nuxt-property-decorator";
import ColorPanel from "~/components/ColorPanel.vue";
import { Context } from "@nuxt/types";
import {
  CsvData,
  csvDataToCsv,
  CsvHeaderLabel,
  CSV_SEPARATOR,
} from "~/types/CsvData";
import RScriptRunner from "./RScriptRunner.vue";
@Component({
  components: {
    RScriptRunner,
    ColorPanel,
  },
})
export default class CronbachAlphaPanel extends Vue {
  @Prop({}) testApplicationData!: CsvData;
  @Ref() rScriptRunner!: RScriptRunner;

  loading = true;
  alpha = "";

  async calculateAlpha() {
    const itemsCsvData = new CsvData();
    const itemsOrders: number[] = [];

    const testApplicationRows = this.testApplicationData.rows;

    testApplicationRows.forEach((row) => {
      let itemOrder = row["item_order"];
      if (itemsOrders.indexOf(itemOrder) == -1) {
        itemsOrders.push(itemOrder);
      }
    });
    itemsOrders.sort((a, b) => a - b);

    const headers = itemsOrders.map((itemOrder) => {
      const header = new CsvHeaderLabel();
      header.label = itemOrder + "";
      header.value = itemOrder + "";
      return header;
    });

    const rows: {}[] = [];

    const mapItemsScoresByUsers: Map<string, any> = new Map();
    testApplicationRows.forEach((row) => {
      const user = row["usuario"];
      const itemOrder = row["item_order"];
      const itemScore = row["escore_obtido"];
      if (!mapItemsScoresByUsers.get(user)) {
        mapItemsScoresByUsers.set(user, {});
      }
      let objectOfItemsScores = mapItemsScoresByUsers.get(user);
      objectOfItemsScores[itemOrder] = itemScore;
    });

    mapItemsScoresByUsers.forEach((rowOfScoresByItem) => {
      rows.push(rowOfScoresByItem);
    });

    itemsCsvData.labels = headers;
    itemsCsvData.rows = rows;

    const csv = csvDataToCsv(itemsCsvData);
    let output: string = await this.rScriptRunner?.run({
      script: `
      library(ltm)
      cronbach.alpha(items, na.rm=TRUE)`,
      csv: csv,
      separator: CSV_SEPARATOR,
      dataVarName: "items",
    });

    try {
      let match = output.match(/alpha: [0-9.]+/);
      if (match) {
        this.alpha = match[0].split(" ")[1];
      } else {
        this.alpha = "Indefinido";
      }
    } catch (e) {
      this.alpha = e;
    }
  }

  @Watch("testApplicationData", { immediate: true })
  async onChangeData() {
    if (!this.testApplicationData) return;
    if (!this.testApplicationData.rows.length) return;
    try {
      this.loading = true;
      await this.calculateAlpha();
    } finally {
      this.loading = false;
    }
  }
}
</script>