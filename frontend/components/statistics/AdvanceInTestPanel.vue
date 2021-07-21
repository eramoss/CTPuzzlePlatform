<template>
  <div>
    <color-panel
      :loading="loading"
      element-loading-text="Calculando avanço médio..."
      label="Avanço médio no teste"
      textColor="#2CA02C"
      color="#AEDBAE"
      icon="directions_run"
      :showInfo="true"
      :data="calculatedAdvance"
    >
      <template slot="info">
        A taxa de avanço mostra até que ponto do teste os participantes chegaram
        em média.
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
export default class AdvanceInTestPanel extends Vue {
  @Prop({}) testApplicationData!: CsvData;
  @Prop({ default: 1 }) test!: Test;
  @Ref() rScriptRunner!: RScriptRunner;

  loading = true;
  advanceInTest = "";
  loadedTest: Test = new Test();

  get calculatedAdvance() {
    if (this.totalItems == 0) return "...";
    return `${this.advanceInTest}/${this.totalItems}`;
  }

  get totalItems() {
    return this.loadedTest?.items?.length;
  }

  async calculateAdvance() {
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

    this.advanceInTest = (totalItemsAnswered / mapItemsIdsByUsers.size).toFixed(
      0
    );
  }

  @Watch("testApplicationData", { immediate: true })
  onChangeData() {
    this.callCalculateAdvance();
  }

  async callCalculateAdvance() {
    try {
      if (!this.testApplicationData) return;
      if (!this.testApplicationData.rows.length) return;
      if (!this.test?.id) return;
      this.loadedTest = await this.getTest(this.test?.id);
      this.loading = true;
      await this.calculateAdvance();
    } finally {
      this.loading = false;
    }
  }

  @Action(ACTION_GET_TEST_BY_ID)
  getTest!: (testId: number) => Promise<Test>;
}
</script>