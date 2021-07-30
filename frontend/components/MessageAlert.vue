<template>
  <div
    :class="`message-alert ${type}`"
    :style="{
      'flex-flow': !!label ? 'column' : 'row',
    }"
  >
    <div class="header-content">
      <i v-show="!label" class="icon" :class="`el-icon-warning-outline`"></i>
      <h3 class="message-label">
        {{ label }}
      </h3>
    </div>
    <div style="display: inline">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import { Prop } from "vue-property-decorator";

@Component
export default class MessageAlert extends Vue {
  @Prop({ default: "info" }) type!: string;
  @Prop() label!: string;
}
</script>
<style lang="scss">
.message-alert {
  border-radius: 5px;
  word-break: keep-all;
  text-align: justify;
  line-height: 1.3em;
  margin-bottom: 5px;
  padding: 15px;
  display: flex;
  font-size: 14pt;
  align-items: center;

  i.icon {
    margin-right: 10px;
    font-size: 20pt;
  }
}

.info {
  background: #f1faff;
  color: #11445c;
  border: 1px solid #11445c;
}
.warning {
  background: #fffbd8;
  color: #5c3a00;
  border: 1px solid #5c3a00;
}
.header-content {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  align-self: start;
}
.message-label {
  font-size: 13pt;
  margin-bottom: 15px;
}
</style>
