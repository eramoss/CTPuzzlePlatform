<template>
  <div>
    <el-table :data="participation.itemResponses">
      <el-table-column label="Código" prop="id" width="70"></el-table-column>
      <el-table-column label="Hora" prop="createdAt" width="120">
        <template slot-scope="{ row }">
          <div>
            {{ dateFormat.fromNow(row.createdAt) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Item">
        <template slot-scope="{ row }">
          <div v-if="row.testItem">
            <nuxt-link
              :to="`/platform/items/${row.testItem.item.id}#instantiate`"
            >
              <el-button type="text" :title="row.testItem.item.name">
                {{ row.testItem.item.name }}
              </el-button>
            </nuxt-link>
            <tutorial-label :item="row.testItem.item" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Resposta" prop="response" width="400">
        <template slot-scope="{ row }">
          <div>
            <json-tree :title="row.response" :json="JSON.parse(row.response)" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Escore" prop="score" width="150">
        <template slot-scope="{ row }">
          <item-response-score-cell :score="row.score" />
        </template>
      </el-table-column>
      <el-table-column label="Ações" prop="response" width="250">
        <template slot-scope="{ row }">
          <div>
            <btn-remove
              @click="removeResponse(row)"
              title="Remover item da participação"
            ></btn-remove>
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
              >
                Recalcular
              </el-button>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <snack-bar-remove
      @onRestore="requestUpdate"
      ref="snackBar"
      remove-action="item-responses/removeById"
      restore-action="item-responses/restoreById"
    >
    </snack-bar-remove>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Action, Ref } from "nuxt-property-decorator";
import Participation from "~/types/Participation";
import ItemThumbnail from "~/components/ItemThumbnail.vue";
import ItemResponseScoreCell from "~/components/ItemResponseScoreCell.vue";
import ItemResponse from "~/types/ItemResponse";
import SnackBarRemove from "./SnackBarRemove.vue";
import { DateFormat } from "~/utils/DateFormat";
import JsonTree from "~/components/JsonTree.vue";

@Component({
  components: {
    JsonTree,
    ItemThumbnail,
    SnackBarRemove,
    ItemResponseScoreCell,
  },
})
export default class ItemResponsesScreen extends Vue {
  @Prop() participation!: Participation;
  @Ref("snackBar") snackBar!: SnackBarRemove;
  @Prop({ default: false }) loading!: boolean;
  dateFormat = new DateFormat();

  @Action("item-responses/calculateScoreFromItem") calculateScoreFromItem!: (
    itemResponse: ItemResponse
  ) => Promise<string>;

  requestUpdate() {
    this.$emit("request-update");
  }

  async calculateScore(itemResponse: ItemResponse) {
    await this.calculateScoreFromItem(itemResponse);
    this.requestUpdate();
  }

  async removeResponse(itemResponse: ItemResponse) {
    await this.snackBar.remove(itemResponse.id);
    this.requestUpdate();
  }
}
</script>