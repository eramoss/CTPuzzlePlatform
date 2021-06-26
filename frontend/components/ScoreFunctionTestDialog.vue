<template>
  <el-dialog
    :visible.sync="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    fullscreen
    id="score-fn-dialog"
    title="Playground para teste de função de escore"
  >
    <score-function-test-form
      v-model="mechanic"
      ref="scoreFunctionForm"
      @onSave="save"
    />
  </el-dialog>
</template>
<script lang="ts">
import { Component, VModel, Ref } from "nuxt-property-decorator";
import Mechanic from "~/types/Mechanic";
import CodeEditor from "~/components/CodeEditor.vue";
import ScoreFunctionTestForm from "~/components/ScoreFunctionTestForm.vue";

import Vue from "vue";

@Component({
  components: {
    ScoreFunctionTestForm,
    CodeEditor,
  },
})
export default class ScoreFunctionTestDialog extends Vue {
  @VModel() mechanic!: Mechanic;
  @Ref("scoreFunctionForm") scoreFunctionForm!: ScoreFunctionTestForm;

  visible: boolean = false;
  runningTests = false;

  show() {
    this.visible = true;
  }

  save() {
    this.$emit("onSave");
  }

  get hasTests() {
    return !!this.mechanic.itemTestCases.length;
  }

  async runTests() {
    this.runningTests = true;
    try {
      await this.scoreFunctionForm.runTests();
    } finally {
      this.runningTests = false;
    }
  }
}
</script>
<style lang="scss">
#score-fn-dialog {
  .el-dialog__body {
    overflow-y: scroll;
  }
  .el-dialog__header {
    border-bottom: 1px solid #ccc;
  }
}
</style>