<template>
  <div :class="`message-alert ${type}`">
    <i :class="`el-icon-warning-outline`"></i>
    <slot></slot>
  </div>
</template>
<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import {Prop} from "vue-property-decorator";

@Component
export default class MessageAlert extends Vue {
  @Prop({default: 'info'}) type!: string
}
</script>
<style lang="scss">
.message-alert{
  padding: 15px;
  display: flex;
  align-items: center;
}
.info {
  background: #d9edf7;
  color: #2d779a;
  font-size: 13pt;
  i {
    margin-right: 10px;
    font-size: 25pt;
  }
}
</style>
