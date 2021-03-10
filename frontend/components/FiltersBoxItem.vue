<template>
  <div class="filter-box-item" style="flex-grow: 1">
    <span class="filter-box-item-label">{{ label }}</span>
    <slot />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "nuxt-property-decorator";

@Component
export default class FiltersBoxItem extends Vue {
  @Prop() label!: string;
}
</script>
<style lang="scss">
.filter-box-item {
  margin-right: 10px;
  .filter-box-item-label {
    font-size: 9.5pt;
    color: #062f4a;
    font-weight: bold;
  }
}
</style>