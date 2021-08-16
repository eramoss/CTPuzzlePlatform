<template>
  <div>
    <color-panel
      :loading="loading"
      element-loading-text="Calculando taxa de finalização..."
      label="Taxa de finalização"
      textColor="#D62728"
      color="#F5CACA"
      icon="sports_score"
      :showInfo="true"
      :data="finishRate"
    >
      <template slot="info">
        A taxa de finalização indica a porcentagem de usuários que responderam
        aos {{ totalItems }} itens do teste
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
export default class FinishPanel extends Vue {
  @Prop({}) testApplicationData!: CsvData;
  @Prop({ default: 1 }) test!: Test;
  @Ref() rScriptRunner!: RScriptRunner;

  loading = true;
  finishRate = "...";
  loadedTest: Test = new Test();

  get totalItems() {
    return this.loadedTest?.items?.length;
  }

  async calculateFinish() {
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

    let finisherCount = 0;
    mapItemsIdsByUsers.forEach((answeredItemsIds: Set<number>) => {
      if (answeredItemsIds.size >= this.totalItems) {
        finisherCount++;
      }
    });

    let finishRate = (finisherCount / (mapItemsIdsByUsers.size)) * 100;
    if (finisherCount == 0) {
      finishRate = 0;
    }
    
    this.finishRate = `${finishRate.toFixed(2)}%`;
  }

  async callCalculateFinish() {
    try {
      if (!this.testApplicationData) return;
      if (!this.testApplicationData.rows.length) return;
      if (!this.test.id) return;
      this.loading = true;
      this.loadedTest = await this.getTest(this.test?.id);
      await this.calculateFinish();
    } finally {
      this.loading = false;
    }
  }

  @Action(ACTION_GET_TEST_BY_ID)
  getTest!: (testId: number) => Promise<Test>;

  @Watch("testApplicationData", { immediate: true })
  async onChangeTestApplicationData() {
    this.callCalculateFinish();
  }
}
</script>