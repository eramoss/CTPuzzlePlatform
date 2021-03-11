<template>
  <el-dialog
    :visible.sync="visible"
    top="10px"
    width="90%"
    :title="`Respostas`"
  >
    <nuxt-link :to="newTab" target="_blank">
      <el-button type="text">Abrir em nova aba</el-button>
    </nuxt-link>
    <item-responses-screen :participation="participation" />
  </el-dialog>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "nuxt-property-decorator";
import Participation from "~/types/Participation";
import ItemResponsesScreen from "~/components/ItemResponsesScreen.vue";

@Component({
  components: {
    ItemResponsesScreen,
  },
})
export default class ItemResponsesDialog extends Vue {
  visible = false;
  participation: Participation = new Participation();
  open(participation: Participation) {
    this.participation = participation;
    this.visible = true;
  }
  get newTab() {
    let participationId = this.participation.id;
    return this.$route.path + "/responses/" + participationId;
  }
}
</script>