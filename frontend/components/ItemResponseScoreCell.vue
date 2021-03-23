<template>
  <div>
    <el-tooltip
      popper-class="error-message-popper"
      effect="light"
      placement="left"
    >
      <div slot="content">
        <span style="padding-bottom: 20px; color: red">
          <i>Execução da função de cálculo do escore: </i>
        </span>
        <pre>{{ itemResponse.score.message }}</pre>
      </div>
      <b v-if="isError" class="error-indicator">
        <i class="el-icon-chat-line-square"></i>
        Mensagem
      </b>
      <span v-if="!isError">
        <el-progress
          :class="{ 'progress-empty': percentage == 0 }"
          :text-inside="true"
          :stroke-width="26"
          :color="`${percentage == 100 ? '#67c23a' : '#409eff'}`"
          :percentage="percentage"
          :format="format"
        ></el-progress>
      </span>
    </el-tooltip>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component, Prop } from "nuxt-property-decorator";
import ItemResponse from "~/types/ItemResponse";

@Component
export default class ItemResponseScoreCell extends Vue {
  @Prop() itemResponse!: ItemResponse;

  format() {
    let score = this.itemResponse.score;
    return `${score.score}/${score.max}`;
  }

  get isError() {
    let isError = false;
    if (this.itemResponse) {
      if (this.itemResponse.score) {
        if (this.itemResponse.score.max == -1) {
          isError = true;
        }
      }
    }
    return isError;
  }

  get percentage() {
    let score = this.itemResponse.score;
    return (score.score / score.max) * 100;
  }
}
</script>
<style lang="scss">
.error-message-popper {
  //border: 1px solid red;
  font-size: 13pt;
}
.error-indicator {
  color: red;
}
.progress-empty {
  .el-progress-bar__innerText {
    color: red;
  }
}
</style>