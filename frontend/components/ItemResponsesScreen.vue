<template>
  <div>
    <el-table :data="participation.itemResponses" v-loading="loading">
      <el-table-column label="Código" prop="id" width="70"></el-table-column>
      <el-table-column label="Item" width="150" prop="testItem.item.name" />
      <el-table-column label="Resposta" prop="response" />
      <el-table-column label="Escore" prop="score" width="250">
        <template slot-scope="{ row }">
          <div>
            {{ row.score }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Resposta" prop="response" width="180">
        <template slot-scope="{ row }">
          <div>
            <el-tooltip
              content="Recalcula o escore para esse item"
              open-delay="400"
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
import ItemResponse from "~/types/ItemResponse";

@Component({
  components: {
    ItemThumbnail,
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