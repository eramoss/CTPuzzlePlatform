<template>
  <div>
    <card-panel :header="header" v-loading="loading">
      <template slot="info">
        Mostra o escore médio obtido em itens, exceto os de tipo tutorial. Os
        valores são calculados em porcentagem do valor de escore obtido em
        relação ao valor máximo.
      </template>
      <el-table
        :data="items"
        :default-sort="{ prop: 'avgScore', order: 'descending' }"
      >
        <el-table-column label="Item" prop="itemName">
          <template slot-scope="{ row }">
            <nuxt-link
              :to="`/platform/items/${row.itemId}`"
              title="Abrir página do item"
            >
              <el-button type="text" style="padding: 0">{{
                row.itemName
              }}</el-button>
            </nuxt-link>
          </template>
        </el-table-column>
        <el-table-column
          align="right"
          label="Escore médio"
          prop="avgScore"
          width="150"
          sortable
        >
          <template slot-scope="{ row }"> {{ row.avgScore }}% </template>
        </el-table-column>
      </el-table>
    </card-panel>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Action, Component, Prop } from "nuxt-property-decorator";
import TestItemDifficulty from "~/types/TestItemDifficulty";
import CardPanel from "~/components/CardPanel.vue";
import { ACTION_GET_AVG_SCORE_BY_ITEM } from "~/store/tests";

@Component({
  components: { CardPanel },
})
export default class PanelItemsAvgScore extends Vue {
  items: TestItemDifficulty[] = [];
  loading = true;

  @Prop({ default: "Escore médio por item" }) header!: string;
  @Prop({ default: undefined }) maxRows!: number;

  @Action(ACTION_GET_AVG_SCORE_BY_ITEM)
  getAvgScoreByItem!: () => Promise<TestItemDifficulty[]>;

  async mounted() {
    try {
      this.loading = true;
      this.items = await this.getAvgScoreByItem();
      if (this.maxRows) {
        this.items = this.items.slice(0, this.maxRows);
      }
    } catch (e) {
      this.items = [];
    } finally {
      this.loading = false;
    }
  }
}
</script>