<template>
  <div class="filters-box">
    <legend style="margin-top: 20px">Filtros</legend>
    <fieldset class="inline-items">
      <slot />
    </fieldset>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component } from "nuxt-property-decorator";

@Component
export default class FiltersBox extends Vue {}
</script>
<style lang="scss">
.filters-box {
  .inline-items {
    display: flex;
    flex-flow: row nowrap;
  }
}
</style>