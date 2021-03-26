<template>
  <el-dialog
    :show-close="false"
    :visible.sync="visible"
    top="10px"
    width="95%"
    id="score-fn-dialog"
    title="Playground para teste de função de escore"
  >
    <div style="height: 10px; width: 100px"></div>
    <score-function-test-form
      v-model="mechanic"
      :showTestCases="true"
      ref="scoreFunctionForm"
    />
    <template slot="title">
      <div class="fill flex-row">
        <span>Função de cálculo de escore</span>
        <score-function-tests-summary
          ref="scoreFunctionTestsSummary"
          :mechanic="mechanic"
          :runningTests="runningTests"
          :fnRunTests="runTests"
        />
        <div class="flex-row">
          <span class="green label" v-show="allPassed()">
            Todos os testes passaram!
          </span>
          <span class="red label" v-show="hasTests && !allPassed()">
            {{qtdNotOk()}} teste(s) não passaram
          </span>
          <span class="yellow label" v-show="!hasTests">
            Não há testes declarados
          </span>
          <el-button size="small" class="bold" @click="visible = false">Fechar</el-button
          >
        </div>
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

  allPassed() {
    return this.scoreFunctionTestsSummary?.allPassed;
  }

  qtdNotOk(){
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
  //border: 1px solid green;
  .el-dialog__header {
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px 0px !important;
    z-index: 1;
  }
  .el-dialog__body {
    max-height: 77vh;
    overflow-y: scroll;
  }
}
</style>