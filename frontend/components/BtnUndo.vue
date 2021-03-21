<template>
  <el-button
    style="font-weight: bold"
    size="small"
    v-bind="$attrs"
    type="danger"
    @click="$emit('click')"
  >
    <slot><icon style="font-size: 10pt" name="undo"></icon> {{ title }}</slot>
  </el-button>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "nuxt-property-decorator";
@Component
export default class BtnUndo extends Vue {
  @Prop({ default: "Desfazer" }) title!: string;
}
</script>