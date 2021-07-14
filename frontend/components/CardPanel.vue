<template>
  <div class="left panel shadow top-marged" v-loading="loading">
    <div class="flex-row">
      <h2 style="margin: 0">{{ header }}</h2>
      <el-tooltip placement="top">
        <div slot="content">
          <div style="max-width: 300px">
            <slot name="info" />
          </div>
        </div>
        <span>
          <icon name="info" class="info-icon" />
        </span>
      </el-tooltip>
    </div>
    <div class="panel-slot scrollbar">
      <slot />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "nuxt-property-decorator";
import { Context } from "@nuxt/types";
@Component
export default class CardPanel extends Vue {
  @Prop({}) header!: string;
  @Prop({}) loading!: boolean;
  @Prop({ default: undefined }) info!: string;
}
</script>
<style lang="scss">
.info-icon {
  color: #aaa;
  cursor: pointer;
}
.info-icon:hover {
  color: #999;
}
.panel-slot {
  max-height: 270px;
  overflow-y: scroll;
}
</style>