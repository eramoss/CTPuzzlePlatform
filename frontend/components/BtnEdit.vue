<template>
  <el-button
    icon="el-icon-edit"
    v-bind="$attrs"
    size="small"
    style="font-weight: bold; border: 1px solid #999"
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