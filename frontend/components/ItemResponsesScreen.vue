<template>
  <div>
    <el-table :data="participation.itemResponses">
      <el-table-column label="Código" prop="id" width="70"></el-table-column>
      <el-table-column label="Item" width="150">
        <template slot-scope="{ row }">
          <div v-if="row.testItem">
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
      <el-table-column label="Ações" prop="response" width="280">
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
    <snack-bar ref="snackBar">
      <span>Desfazer exclusão?</span>
      <el-button type="danger" @click="restoreSoftRemovedItem">
        Desfazer
      </el-button>
    </snack-bar>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Action, Ref } from "nuxt-property-decorator";
import Participation from "~/types/Participation";
import ItemThumbnail from "~/components/ItemThumbnail.vue";
import ItemResponseScoreCell from "~/components/ItemResponseScoreCell.vue";
import SnackBar from "~/components/SnackBar.vue";
import ItemResponse from "~/types/ItemResponse";

@Component({
  components: {
    ItemThumbnail,
    SnackBar,
    ItemResponseScoreCell,
  },
})
export default class ItemResponsesScreen extends Vue {
  @Prop() participation!: Participation;
  @Ref("snackBar") snackBar!: SnackBar;
  @Prop({ default: false }) loading!: boolean;
  removedIds: number[] = [];

  @Action("item-responses/calculateScoreFromItem") calculateScoreFromItem!: (
    itemResponse: ItemResponse
  ) => Promise<string>;

  @Action("item-responses/removeById") removeItemResponse!: (
    id: number
  ) => Promise<string>;

  @Action("item-responses/restoreById") restoreItemResponse!: (
    id: number
  ) => Promise<string>;

  requestUpdate() {
    this.$emit("request-update");
  }

  async calculateScore(itemResponse: ItemResponse) {
    await this.calculateScoreFromItem(itemResponse);
    this.requestUpdate();
  }

  async removeResponse(itemResponse: ItemResponse) {
    this.removedIds.push(itemResponse.id);
    await this.removeItemResponse(this.removedIds[this.removedIds.length - 1]);
    this.requestUpdate();
    this.showUndoRemoveMessage();
  }

  showUndoRemoveMessage() {
    this.snackBar.show();
  }

  async restoreSoftRemovedItem() {
    let id = this.removedIds.pop();
    if (id) {
      await this.restoreItemResponse(id);
      this.requestUpdate();
    }
  }
}
</script>