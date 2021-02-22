<template>
  <div style="background: white">
    <select
      class="selector el-input__inner"
      :class="className"
      @change="change"
      v-model="selectedValue"
    >
      <option v-show="placeholder" value="" disabled selected>
        {{placeholder}}
      </option>
      <slot />
    </select>
  </div>
</template>
<script lang="ts">
import { Component, Emit, Prop, VModel } from "nuxt-property-decorator";
import Vue from "vue";
@Component
export default class Selector extends Vue {
  className: string = "";
  @Prop({ default: "Selecione" }) placeholder!: string;
  @VModel() selectedValue!: Object;

  @Emit("change")
  emitChange() {
    return this.selectedValue;
  }

  change() {
    this.className = "has-value";
    this.emitChange();
  }
}
</script>
<style lang="scss">
.selector.has-value {
  //background: none;
}
.selector {
  border: 1px solid #ddd;
  padding-left: 6px;
  color: rgb(96, 98, 102);
  border-radius: 3px;
  appearance: none;
  background: url("/arrow-down-select.png") no-repeat;
  background-position: right;

  .el-form-item.is-error {
    .selector {
      border: 1px solid red;
    }
  }
}
</style>
