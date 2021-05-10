<template>
  <div>
    <el-tooltip :content="tooltip">
      <el-button type="text" icon="el-icon-info">{{ label }}</el-button>
    </el-tooltip>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "nuxt-property-decorator";
@Component
export default class TooltipInfo extends Vue {
  @Prop({}) tooltip!: string;
  @Prop({}) label!: string;
}
</script>