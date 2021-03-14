<template>
  <div class="copy-input">
    <el-input
      type="textarea"
      v-bind="$attrs"
      rows="3"
      :readonly="!editable"
      @click="onFocusCopyInput"
      @focus="onFocusCopyInput"
      ref="copyInput"
      v-model="text"
    ></el-input>
    <el-tooltip :content="copyBtnTitle" effect="light">
      <el-button
        style="margin-left: 10px"
        @click="onCopy"
        v-show="isBtnVisible"
        type="text"
        icon="el-icon-copy-document"
      >
        Copiar
      </el-button>
    </el-tooltip>
    <slot name="more-buttons"/>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Ref, VModel } from "nuxt-property-decorator";
import { ElInput } from "element-ui/types/input";
@Component
export default class CopyInput extends Vue {
  @VModel() text!: string;
  @Prop({ default: false }) editable!: boolean;

  get isBtnVisible() {
    return this.text.length > 0;
  }

  @Ref("copyInput") copyInput!: ElInput;
  copyBtnTitle: string = "Copiar link";

  onCopy() {
    this.onFocusCopyInput();
    document.execCommand("copy");
    this.copyBtnTitle = "O link foi copiado";
    setTimeout(() => {
      this.resetLinkTitle();
    }, 1000);
  }

  resetLinkTitle() {
    this.copyBtnTitle = "Copiar link";
  }

  onFocusCopyInput() {
    this.copyInput.select();
  }

  mounted() {
    this.resetLinkTitle();
  }
}
</script>
<style lang="scss">
.copy-input {
  display: flex;
  flex-flow: row nowrap;
}
</style>