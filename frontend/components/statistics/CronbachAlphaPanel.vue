<template>
  <div>
    <color-panel
      :loading="loading"
      element-loading-text="Calculando Alpha de Cronbach..."
      label="Alpha de Cronbach"
      textColor="#1F77B4"
      color="#BAD5E8"
      icon="motion_photos_auto"
      :showInfo="true"
      :data="alpha"
    >
      <template slot="icons">
        <el-popover
          placement="top"
          :width="400"
          trigger="click"
          v-model="itemsDialogVisible"
        >
          <template #reference>
            <icon
              @click="showItemsDialog"
              style="
                color: #1f77b4;
                margin-right: 10px;
                cursor: pointer;
                display: block;
              "
              name="settings"
            />
          </template>
          <div v-loading="loading">
            <div style="text-align: center; margin-bottom: 10px">
              <b>Itens para cálculo do alpha</b>
            </div>
            <el-checkbox
              style="min-width: 90px"
              v-for="item in itemsSelecteds"
              :key="item.itemOrder"
              v-model="item.selected"
            >
              Item {{ item.itemOrder + 1 }}
            </el-checkbox>
            <div style="text-align: center; margin-top: 10px">
              <el-button size="mini" @click="closeItemsDialog"
                >Fechar</el-button
              >
              <el-button type="primary" size="mini" @click="callCalculateAlpha"
                >Calcular alpha</el-button
              >
            </div>
          </div>
        </el-popover>
      </template>
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

  itemsOrders: number[] = [];
  itemsSelecteds: { itemOrder: number; selected: boolean }[] = [];

  itemsDialogVisible = false;

  showItemsDialog() {
    if (this.itemsDialogVisible) {
      this.closeItemsDialog();
      return;
    }
    this.itemsDialogVisible = true;
  }

  closeItemsDialog() {
    this.itemsDialogVisible = false;
  }

  updateItemsList() {
    this.itemsSelecteds.splice(0);
    const itemsOrders: number[] = [];
    const testApplicationRows = this.testApplicationData.rows;
    testApplicationRows.forEach((row) => {
      let itemOrder = row["item_order"];
      if (itemsOrders.indexOf(itemOrder) == -1) {
        itemsOrders.push(itemOrder);
      }
    });

    itemsOrders.sort((a, b) => a - b);
    itemsOrders.forEach((itemOrder) => {
      this.itemsSelecteds.push({ itemOrder, selected: true });
    });
    this.itemsOrders = itemsOrders;
  }

  isSelected(itemOrder: number) {
    const selectedItem = this.itemsSelecteds.find(
      (it) => it.itemOrder == itemOrder
    );
    return selectedItem && selectedItem.selected;
  }

  async calculateAlpha() {
    const itemsCsvData = new CsvData();
    const testApplicationRows = this.testApplicationData.rows;

    const itemOrders: number[] = this.itemsOrders.filter((itemOrder) =>
      this.isSelected(itemOrder)
    );

    const headers = itemOrders.map((itemOrder) => {
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
      if (this.isSelected(itemOrder)) {
        const itemScore = row["escore_obtido"];
        if (!mapItemsScoresByUsers.get(user)) {
          mapItemsScoresByUsers.set(user, {});
        }
        let objectOfItemsScores = mapItemsScoresByUsers.get(user);
        objectOfItemsScores[itemOrder] = itemScore;
      }
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
      let match = output.match(/alpha: [-0-9.]+/);
      if (match) {
        this.alpha = match[0].split(" ")[1];
      } else {
        this.alpha = "Indefinido";
      }
    } catch (e) {
      console.error(e);
      this.alpha = "0";
    }
  }

  @Watch("testApplicationData", { immediate: true })
  onChangeData() {
    if (!this.testApplicationData) return;
    if (!this.testApplicationData.rows.length) return;
    this.updateItemsList();
    this.callCalculateAlpha();
  }

  async callCalculateAlpha() {
    try {
      this.loading = true;
      await this.calculateAlpha();
    } finally {
      this.loading = false;
    }
  }
}
</script>