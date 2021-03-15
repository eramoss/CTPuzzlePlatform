<template>
  <div>
    <el-table :data="participation.itemResponses">
      <el-table-column label="Código" prop="id" width="70"></el-table-column>
      <el-table-column label="Item" width="200" prop="testItem.item.name" />
      <el-table-column label="Resposta" prop="response" />
      <el-table-column label="Escore" prop="escore" />
      <el-table-column label="Resposta" prop="response" width="150">
        <template slot-scope="{ row }">
          <div>
            <el-button size="small" type="primary" @click="calculateScore(row)"
              >Calcular escore</el-button
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

  @Action("item-responses/calculateScoreFromItem") calculateScoreFromItem!: (
    itemResponse: ItemResponse
  ) => Promise<string>;

  async calculateScore(itemResponse: ItemResponse) {
    let score = await this.calculateScoreFromItem(itemResponse);
    alert(score);
  }
}
</script>