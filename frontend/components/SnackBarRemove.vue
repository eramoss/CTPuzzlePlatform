<template>
  <div>
    <snack-bar ref="snackBar">
      {{ text }}
      <btn-undo @click="restore" />
    </snack-bar>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Ref } from "nuxt-property-decorator";
import SnackBar from "./SnackBar.vue";

@Component
export default class SnackBarRemove extends Vue {
  @Ref() snackBar!: SnackBar;
  @Prop({ default: "Desfazer a exclusão?" }) text!: string;
  @Prop() restoreAction!: string;
  @Prop() removeAction!: string;
  deletedId!: number;

  async remove(id: number) {
    this.deletedId = id;
    await this.$store.dispatch(this.removeAction, id);
    this.snackBar.show();
    this.$emit("onRemove");
  }

  async restore() {
    await this.$store.dispatch(this.restoreAction, this.deletedId);
    this.$emit("onRestore", this.deletedId);
    this.snackBar.hide();
  }
}
</script>