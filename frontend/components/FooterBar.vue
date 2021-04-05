<template>
  <div class="footer-bar"></div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "nuxt-property-decorator";
import { Context } from "@nuxt/types";
@Component
export default class FooterBar extends Vue {
  async asyncData(ctx: Context) {}
}
</script>
<style lang="scss">
.footer-bar {
  background: #ddd;
  width: 100%;
  height: 200px;
  margin-top: 120px;
}
</style>