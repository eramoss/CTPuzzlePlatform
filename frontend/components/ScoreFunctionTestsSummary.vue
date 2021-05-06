<template>
  <div class="flex-row fill">
    <slot></slot>
    <div class="flex-row">
      <span>
          <span>
            <b class="green">{{ qtdOkTests }} testes passaram </b>
          </span>
          <span>
            <b class="red">{{ qtdErrorTests }} testes falharam</b>
          </span>
      </span>
    </div>
    <div>
      <el-tooltip
        effect="light"
        content="Rodar casos de teste"
        :open-delay="500"
      >
        <el-button
          icon="el-icon-video-play"
          style="font-weight: bold"
          type="primary"
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

  

  get qtdOkTests(): number {
    return this.responses.filter((response) => isTestPassed(response))
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
    });
  }

  get hasTests() {
    return this.qtdOkTests || this.qtdErrorTests;
  }

  get qtdErrorTests(): number {
    return this.responses.length - this.qtdOkTests;
  }
}

export function isTestPassed(itemResponse: ResponseTestCase): boolean {
    let passed = false;
    if (itemResponse.score) {
      if (itemResponse.expectedScore != undefined) {
        passed = itemResponse.score.score == itemResponse.expectedScore;
      }
    }
    return passed;
  }
</script>