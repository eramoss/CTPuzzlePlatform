<template>
  <div>
    <div>
      <b>Testes</b>
      <el-tooltip content="Testes OK!">
        <span>
          <i title="Passou no teste" class="el-icon-success green"></i>
          {{ qtdOkTests }}
        </span>
      </el-tooltip>
      <el-tooltip content="Testes com falha">
        <span>
          <i title="Não passou no teste" class="el-icon-error red"></i>
          {{ qtdErrorTests }}
        </span>
      </el-tooltip>
      <el-tooltip
        effect="light"
        content="Rodar casos de teste"
        :open-delay="500"
      >
        <el-button
          icon="el-icon-video-play"
          class="bold"
          type="success"
          @click="runTests"
          :loading="runningTests"
        >
          Rodar casos de teste
        </el-button>
      </el-tooltip>
    </div>
    <!-- <div>
      <span
        class="fill green label"
        v-show="allPassed"
      >
        Todos os testes passaram!
      </span>
    </div> -->
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component, Prop } from "nuxt-property-decorator";
import Mechanic from "~/types/Mechanic";
import { ResponseTestCase } from "~/types/ResponseTestCase";

@Component
export default class ScoreFunctionTestsSummary extends Vue {
  @Prop({ default: false }) runningTests!: boolean;
  @Prop() mechanic!: Mechanic;
  @Prop() fnRunTests!: Function;

  get responses(): ResponseTestCase[] {
    return this.mechanic.itemTestCases.flatMap(
      (testCase) => testCase.responseTestCases
    );
  }

  get allPassed() {
    return this.qtdOkTests > 0 && this.qtdErrorTests == 0;
  }

  isTestPassed(itemResponse: ResponseTestCase): boolean {
    let passed = false;
    if (itemResponse.score) {
      if (itemResponse.expectedScore) {
        passed = itemResponse.score.score == itemResponse.expectedScore;
      }
    }
    return passed;
  }

  get qtdOkTests(): number {
    return this.responses.filter((response) => this.isTestPassed(response))
      .length;
  }

  async runTests() {
    await this.fnRunTests();
    this.$notify({
      title: "Os testes foram executados",
      message:
        this.qtdErrorTests > 0
          ? "Alguns testes falharam"
          : "Todos os testes passaram",
      type: this.qtdErrorTests > 0 ? "error" : "success",
      position: "bottom-right",
    });
  }

  get qtdErrorTests(): number {
    return this.responses.length - this.qtdOkTests;
  }
}
</script>