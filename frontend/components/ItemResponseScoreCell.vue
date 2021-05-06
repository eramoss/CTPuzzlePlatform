<template>
  <div class="score-cell">
    <el-tooltip
      popper-class="error-message-popper"
      effect="light"
      placement="left"
    >
      <div slot="content">
        <span style="small-tooltip-title">
          Execução do cálculo de escore:
        </span>
        <pre style="font-size:10pt">{{ score && score.message }}</pre>
      </div>
      <div>
        <b v-show="isError" class="error-indicator">
          <i class="el-icon-chat-line-square"></i>
          Mensagem
        </b>
        <span v-show="!isError" class="flex-row">
          <el-progress
            style="flex-grow: 1; font-weight: bold"
            :class="{ 'progress-empty': percentage == 0 }"
            :text-inside="true"
            :stroke-width="26"
            :color="`${percentage == 100 ? '#67c23a' : '#409eff'}`"
            :percentage="percentage"
            :format="format"
          ></el-progress>
          <i
            class="chat-icon el-icon-chat-line-square"
          ></i>
        </span>
      </div>
    </el-tooltip>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component, Prop } from "nuxt-property-decorator";
import Score from "~/types/Score";

@Component
export default class ItemResponseScoreCell extends Vue {
  @Prop() score!: Score;

  format() {
    let format = "";
    let score = this.score;
    if (score) {
      if (score.score && score.max) {
        format = `${score.score}/${score.max}`;
      }
    }
    return format;
  }

  get isError() {
    let isError = false;
    if (this.score) {
      if (this.score.max == -1) {
        isError = true;
      }
    }
    return isError;
  }

  get percentage() {
    let percent = 0;
    let score = this.score;
    if (score) {
      if (score.score && score.max) {
        percent = (score.score / score.max) * 100;
      }
    }
    return percent;
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
.chat-icon {
    color: #cc6633;
    font-size: 20pt;
}
.score-cell:hover{
    cursor:pointer;
    .chat-icon{
        color: red;
    }
}
</style>