<template>
  <div class="flex-row start">
    <h2 class="dashboard-title"><slot></slot></h2>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component } from "nuxt-property-decorator";
@Component
export default class DashboardTitle extends Vue {
  /* @Prop({}) propName!: Type;
  async asyncData(ctx: Context) {} */
}
</script>
<style lang="scss">
.dashboard-title {
  text-align: left;
  color: #68798c;
  font-size: 1.7em;
  margin-bottom: 0;
}
</style>