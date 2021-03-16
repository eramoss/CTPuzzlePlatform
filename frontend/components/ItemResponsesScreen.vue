<template>
  <div>
    <el-table :data="participation.itemResponses" v-loading="loading">
      <el-table-column label="Código" prop="id" width="70"></el-table-column>
      <el-table-column label="Item" width="150">
        <template slot-scope="{ row }">
          <div>
            <nuxt-link
              target="_blank"
              :to="`/platform/items/${row.testItem.item.id}#instantiate`"
            >
              <el-button type="text">
                {{ row.testItem.item.name }}
              </el-button>
            </nuxt-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Resposta" prop="response" />
      <el-table-column label="Escore" prop="score" width="150">
        <template slot-scope="{ row }">
          <item-response-score-cell :item-response="row" />
        </template>
      </el-table-column>
      <el-table-column label="Ações" prop="response" width="180">
        <template slot-scope="{ row }">
          <div>
            <el-tooltip
              content="Recalcula o escore para esse item"
              :open-delay="400"
              effect="light"
            >
              <el-button
                size="small"
                icon="el-icon-video-play"
                type="warning"
                @click="calculateScore(row)"
                >Recalcular</el-button
              ></el-tooltip
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Action } from "nuxt-property-decorator";
import Participation from "~/types/Participation";
import ItemThumbnail from "~/components/ItemThumbnail.vue";
import ItemResponseScoreCell from "~/components/ItemResponseScoreCell";
import ItemResponse from "~/types/ItemResponse";

@Component({
  components: {
    ItemThumbnail,
    ItemResponseScoreCell,
  },
})
export default class ItemResponsesScreen extends Vue {
  @Prop() participation!: Participation;
  @Prop({ default: false }) loading!: boolean;

  @Action("item-responses/calculateScoreFromItem") calculateScoreFromItem!: (
    itemResponse: ItemResponse
  ) => Promise<string>;

  async calculateScore(itemResponse: ItemResponse) {
    await this.calculateScoreFromItem(itemResponse);
    this.$emit("request-update");
  }
}
</script>