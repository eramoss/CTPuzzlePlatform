<template>
  <div>
    <span v-if="itemResponse.score.score > -1">
      <el-progress
        :class="{ 'progress-empty': percentage == 0 }"
        :text-inside="true"
        :stroke-width="26"
        :color="`${percentage == 100 ? '#67c23a' : '#409eff'}`"
        :percentage="percentage"
        :format="format"
      ></el-progress>
    </span>
    <span v-if="itemResponse.score.message">
      <el-tooltip
        popper-class="error-message-popper"
        effect="light"
        placement="left"
      >
        <div slot="content">
          <pre>{{ itemResponse.score.message }}</pre>
        </div>
        <b class="error-indicator"
          ><i class="el-icon-chat-line-square"></i> Mensagem</b
        >
      </el-tooltip>
    </span>
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