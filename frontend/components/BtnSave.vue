<template>
  <el-tooltip
    :open-delay="500"
    content="Salvar (Ctrl + Shift + S)"
    effect="light"
  >
    <el-button
      v-bind="$attrs"
      icon="el-icon-check"
      @click="onClick"
      type="success"
      >Salvar</el-button
    >
  </el-tooltip>
</template>
<script lang="ts">
import { Component } from "nuxt-property-decorator";
import Vue from "vue";
@Component
export default class BtnSave extends Vue {
  ctrlPlusSListener(evt: KeyboardEvent) {
    if (evt.ctrlKey) {
      if (evt.key == "s") {
        evt.preventDefault();
        this.$emit("click");
      }
    }
  }
  onClick() {
    this.$emit("click");
  }
  mounted() {
    window.addEventListener("keydown", this.ctrlPlusSListener);
  }
  destroyed() {
    window.removeEventListener("keydown", this.ctrlPlusSListener);
  }
}
</script>