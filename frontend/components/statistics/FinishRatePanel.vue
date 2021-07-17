<template>
  <div>
    <color-panel
      :loading="loading"
      element-loading-text="Calculando taxa de finalização..."
      label="Taxa de finalização"
      textColor="#2CA02C"
      color="#AEDBAE"
      icon="done_all"
      :showInfo="true"
      :data="finishRate"
    >
      <template slot="info">
        A taxa de finalização indica até onde no teste os participantes
        chegaram. <br />
        Para um teste de 10 itens, caso a taxa de finalização seja 50%,
        significa que em média, os participantes responderam até a metade do
        teste (5 itens). Alguns participantes podem ter ido mais longe ou até
        finalizado todos os itens. Mas responder até 5 itens é o valor mais
        provável.
      </template>
    </color-panel>
    <r-script-runner ref="rScriptRunner" />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Action, Component, Prop, Ref, Watch } from "nuxt-property-decorator";
import ColorPanel from "~/components/ColorPanel.vue";
import { CsvData } from "~/types/CsvData";
import RScriptRunner from "./RScriptRunner.vue";
import Test from "~/types/Test";
import { ACTION_GET_TEST_BY_ID } from "~/store/tests";
@Component({
  components: {
    RScriptRunner,
    ColorPanel,
  },
})
export default class FinishRatePanel extends Vue {
  @Prop({}) testApplicationData!: CsvData;
  @Prop({ default: 1 }) test!: Test;
  @Ref() rScriptRunner!: RScriptRunner;

  loading = true;
  finishRate = "";
  totalTestItems: number = 0;

  async calculateFinishRate() {
    const testApplicationRows = this.testApplicationData.rows;

    const mapItemsIdsByUsers: Map<string, Set<number>> = new Map();
    testApplicationRows.forEach((row) => {
      const user = row["usuario"];
      if (!mapItemsIdsByUsers.get(user)) {
        mapItemsIdsByUsers.set(user, new Set<number>());
      }
      let itemsIds = mapItemsIdsByUsers.get(user);
      if (itemsIds) {
        itemsIds.add(row["item_id"]);
      }
    });

    let totalItemsAnswered = 0;
    mapItemsIdsByUsers.forEach((answeredItemsIds: Set<number>) => {
      totalItemsAnswered += answeredItemsIds.size;
    });

    this.finishRate =
      (
        (totalItemsAnswered / (mapItemsIdsByUsers.size * this.totalTestItems)) *
        100
      ).toFixed(2) + "%";
  }

  @Watch("testApplicationData", { immediate: true })
  onChangeData() {
    if (!this.testApplicationData) return;
    if (!this.testApplicationData.rows.length) return;
    this.callCalculateFinishRate();
  }

  async callCalculateFinishRate() {
    try {
      this.loading = true;
      await this.calculateFinishRate();
    } finally {
      this.loading = false;
    }
  }

  @Action(ACTION_GET_TEST_BY_ID)
  getTest!: (testId: number) => Promise<Test>;

  @Watch("test")
  async onChangeTest() {
    this.totalTestItems = (await this.getTest(this.test?.id)).items.length;
  }
}
</script>