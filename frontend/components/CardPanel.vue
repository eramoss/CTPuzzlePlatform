<template>
  <div class="left panel shadow">
    <div class="flex-row">
      <h2 style="margin: 0">{{ header }}</h2>
      <el-tooltip :content="info" placement="top" v-show="info">
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