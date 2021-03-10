<template>
  <el-button
    title="Editar"
    icon="el-icon-edit"
    v-bind="$attrs"
    size="small"
    type="default"
    :loading="loading"
    @click="onClick"
    >Editar</el-button
  >
</template>
<script>
import { Component } from "nuxt-property-decorator";
import Vue from "vue";

@Component
export default class BtnEdit extends Vue {
  loading = false;
  onClick() {
    this.$emit("click");
    this.loading = true;
    setTimeout((_) => {
      this.loading = false;
    }, 4000);
  }
}
</script>