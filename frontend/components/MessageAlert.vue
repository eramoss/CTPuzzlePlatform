<template>
  <div :class="`message-alert ${type}`">
    <i class="icon" :class="`el-icon-warning-outline`"></i>
    <slot></slot>
  </div>
</template>
<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";

@Component
export default class MessageAlert extends Vue {
  @Prop({ default: "info" }) type!: string;
}
</script>
<style lang="scss">
.message-alert {
  word-break: keep-all;
  text-align: justify;
  line-height: 1.3em;
  padding: 15px;
  display: flex;
  font-size: 12pt;
  align-items: center;

  i.icon {
    margin-right: 10px;
    font-size: 25pt;
  }
}

.info {
  background: #d9edf7;
  color: #2d779a;
}
.warning {
  background: #ffe5b8;
  color: #5c3a00;
}
</style>
