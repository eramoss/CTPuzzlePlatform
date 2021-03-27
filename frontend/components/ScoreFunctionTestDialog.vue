<template>
  <el-dialog
    :visible.sync="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    top="10px"
    width="95%"
    id="score-fn-dialog"
    title="Playground para teste de função de escore"
  >
    <score-function-test-form v-model="mechanic" ref="scoreFunctionForm" />
    <template slot="footer">
      <div class="flex-row">
        <score-function-tests-summary
          ref="scoreFunctionTestsSummary"
          :mechanic="mechanic"
          :runningTests="runningTests"
          :fnRunTests="runTests"
        >
          <el-button
            title="Adiciona um caso de teste de item para validar função de escore"
            icon="el-icon-plus"
            class="add-item-btn"
            type="warning"
            @click="addItemTestCase"
          >
            Adicionar caso de teste
          </el-button>
        </score-function-tests-summary>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { Component, VModel, Ref } from "nuxt-property-decorator";
import Mechanic from "~/types/Mechanic";
import CodeEditor from "~/components/CodeEditor.vue";
import ScoreFunctionTestForm from "~/components/ScoreFunctionTestForm.vue";
import ScoreFunctionTestsSummary from "~/components/ScoreFunctionTestsSummary.vue";

import Vue from "vue";

@Component({
  components: {
    ScoreFunctionTestForm,
    ScoreFunctionTestsSummary,
    CodeEditor,
  },
})
export default class ScoreFunctionTestDialog extends Vue {
  @VModel() mechanic!: Mechanic;
  @Ref("scoreFunctionForm") scoreFunctionForm!: ScoreFunctionTestForm;
  @Ref("scoreFunctionTestsSummary")
  scoreFunctionTestsSummary!: ScoreFunctionTestsSummary;
  visible: boolean = false;
  runningTests = false;

  show() {
    this.visible = true;
  }

  addItemTestCase() {
    this.scoreFunctionForm.addItemTestCase();
  }

  allPassed() {
    return this.scoreFunctionTestsSummary?.allPassed;
  }

  qtdNotOk() {
    return this.scoreFunctionTestsSummary?.qtdErrorTests;
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
    max-height: 71vh;
    overflow-y: scroll;
  }
  .el-dialog__header {
      border-bottom: 1px solid #ccc;
  }
  .el-dialog__footer {
    border-top: 1px solid #ccc;
    padding: 10px 20px;
  }
}
</style>