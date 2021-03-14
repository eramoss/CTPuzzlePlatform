<template>
  <div>
    <el-table :data="participation.itemResponses">
      <el-table-column label="Código" prop="id" width="70"></el-table-column>
      <el-table-column label="Item" width="400">
        <template slot-scope="{ row }">
          <div>
            <item-thumbnail :item="row.testItem.item" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Resposta" prop="response"></el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "nuxt-property-decorator";
import Participation from "~/types/Participation";
import ItemThumbnail from "~/components/ItemThumbnail.vue";

@Component({
  components: {
    ItemThumbnail,
  },
})
export default class ItemResponsesScreen extends Vue {
  @Prop() participation!: Participation;
}
</script>