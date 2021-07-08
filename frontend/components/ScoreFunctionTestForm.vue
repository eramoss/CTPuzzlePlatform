<template>
  <div>
    <div class="panel big-shadow top-marged">
      <el-row>
        <code-editor
          @onSave="save"
          :openOnClick="true"
          :uniqueId="`scoreFunction${mechanic.id}`"
          editorTitle="Função de escore"
          :useHeightControls.sync="useHeightControls"
          :forceShowBigTitle="true"
          :fontSize="18"
          height="300px"
          v-model="mechanic.scoreFunction"
        >
          <template slot="bar">
            <helper-functions
              @onSelectFunction="addCodeToExistentScoreFunction"
            />
          </template>
        </code-editor>
      </el-row>
    </div>

    <div class="panel big-shadow top-marged">
      <h2>Casos de teste</h2>
      <div>
        <score-function-tests-summary
          ref="scoreFunctionTestsSummary"
          :mechanic="mechanic"
          :runningTests="runningTests"
          :fnRunTests="runTests"
        >
        </score-function-tests-summary>
      </div>
      <div>
        <div
          class="test-case shadow"
          :gutter="20"
          :key="itemTestCase.id"
          v-for="(itemTestCase, index) in mechanic.itemTestCases"
        >
          <div>
            <div class="flex-row">
              <div class="left flex-row expand-row">
                <div>
                  <el-button
                    type="text"
                    @click="toggleExpanded(itemTestCase)"
                    style="padding: 1px"
                    ><b
                      ><i
                        style="font-size: 15pt"
                        :class="
                          itemTestCase.expanded
                            ? 'el-icon-arrow-down'
                            : 'el-icon-arrow-right'
                        "
                      ></i
                    ></b>
                  </el-button>
                </div>
                <div :id="`test-case-${index}`">
                  <b style="color: black">Caso de teste {{ index + 1 }}</b>
                  <b>
                    <span class="green" v-if="isPassed(itemTestCase)"
                      >Passou nos testes</span
                    >
                    <span class="red" v-else>Não passou no teste</span>
                  </b>
                </div>
              </div>
              <el-button
                icon="el-icon-close"
                type="text"
                v-show="itemTestCase.expanded"
                style="font-size: 15pt; padding: 0"
                title="Remover caso de teste"
                @click="removeItemTestCase(index)"
              ></el-button>
            </div>
          </div>
          <div v-show="itemTestCase.expanded">
            <el-row :gutter="20" style="padding: 0 10px 10px 10px">
              <el-col :span="10">
                <code-editor
                  @onSave="save"
                  :uniqueId="`itemInstantiation${itemTestCase.id}_${mechanic.id}`"
                  height="250px"
                  :fontSize="15"
                  language="typescript"
                  v-model="itemTestCase.itemInstantiation"
                >
                </code-editor>
              </el-col>
              <el-col :span="14">
                <div
                  :key="itemResponseTestCase.id"
                  v-for="(
                    itemResponseTestCase, itemRespIndex
                  ) in itemTestCase.responseTestCases"
                >
                  <el-row
                    :gutter="20"
                    class="responses-test-case"
                    :class="{
                      fail: !isTestPassed(itemResponseTestCase),
                      success: isTestPassed(itemResponseTestCase),
                    }"
                  >
                    <el-col :span="18">
                      <div
                        v-if="itemResponseTestCase.score"
                        class="item score-test-indicator"
                      >
                        <div v-if="isTestPassed(itemResponseTestCase)">
                          <el-tooltip content="Passou no teste">
                            <i class="el-icon-success green"></i>
                          </el-tooltip>
                          Passou no teste
                        </div>
                        <div v-else>
                          <el-tooltip content="Não passou no teste">
                            <i class="el-icon-error red"></i>
                          </el-tooltip>
                          Não passou no teste
                        </div>
                      </div>
                      <code-editor
                        @onSave="save"
                        :uniqueId="`responseInstantiation${mechanic.id}`"
                        height="250px"
                        :fontSize="15"
                        language="typescript"
                        v-model="itemResponseTestCase.responseInstantiation"
                      >
                      </code-editor>
                    </el-col>
                    <el-col :span="6" class="score-area">
                      <div>
                        <el-button
                          type="text"
                          icon="el-icon-close"
                          class="icon-remove-response-test-case"
                          title="Remover teste?"
                          @click="
                            removeResponseTestCase(itemTestCase, itemRespIndex)
                          "
                        ></el-button>
                        <div class="item">
                          <form-item-label label="Escore esperado" />
                          <el-input
                            size="large"
                            v-model="itemResponseTestCase.expectedScore"
                          ></el-input>
                        </div>
                        <div class="item">
                          <form-item-label label="Escore obtido" />
                          <item-response-score-cell
                            :score="itemResponseTestCase.score"
                          />
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <el-tooltip
                  effect="light"
                  :open-delay="400"
                  content="Adiciona uma resposta ao caso de teste"
                >
                  <el-button
                    icon="el-icon-plus"
                    class="add-item-btn"
                    type="primary"
                    size="small"
                    @click="addResponseTestCase(itemTestCase)"
                  >
                    Adicionar resposta
                  </el-button>
                </el-tooltip>
              </el-col>
            </el-row>
          </div>
        </div>
        <el-button
          title="Adiciona um caso de teste de item para validar função de escore"
          icon="el-icon-plus"
          class="add-item-btn shadow"
          type="primary"
          size="small"
          @click="addItemTestCase"
        >
          Adicionar caso de teste
        </el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import CodeEditor from "~/components/CodeEditor.vue";
import ScoreFunctionTestDto from "~/types/ScoreFunctionTestDto";
import ScoreFunctionTestResult from "~/types/ScoreFunctionTestResult";
import ItemResponseScoreCell from "~/components/ItemResponseScoreCell.vue";
import {
  Action,
  Component,
  Prop,
  Ref,
  VModel,
  Watch,
} from "nuxt-property-decorator";
import Mechanic from "~/types/Mechanic";
import { ItemTestCase } from "~/types/ItemTestCase";
import { ResponseTestCase } from "~/types/ResponseTestCase";
import { isTestPassed } from "./ScoreFunctionTestsSummary.vue";
import ScoreFunctionTestsSummary from "./ScoreFunctionTestsSummary.vue";
import eventBus, { emitResize } from "~/utils/eventBus";

@Component({
  components: {
    CodeEditor,
    ItemResponseScoreCell,
    ScoreFunctionTestsSummary,
  },
})
export default class ScoreFunctionTestForm extends Vue {
  response: string = "";
  @VModel() mechanic!: Mechanic;
  runningTests = false;
  useHeightControls = true;

  @Ref("scoreFunctionTestsSummary")
  scoreFunctionTestsSummary!: ScoreFunctionTestsSummary;

  allPassed() {
    return this.scoreFunctionTestsSummary?.allPassed;
  }

  isTestPassed(responseTestCase: ResponseTestCase) {
    return isTestPassed(responseTestCase);
  }

  qtdNotOk() {
    return this.scoreFunctionTestsSummary?.qtdErrorTests;
  }

  addItemTestCase() {
    let itemTestCase = new ItemTestCase(this.mechanic);
    this.mechanic.itemTestCases.push(itemTestCase);
    this.showItemTestHelp();
    this.unexpandAllExcept(itemTestCase);
    this.updateIndexes();
  }

  showItemTestHelp() {
    this.$alert(
      "Um novo caso de teste foi adicionado. Ajuste as funções de itens e de respostas para validar o cálculo de escore",
      "Edite o caso de teste",
      {
        confirmButtonText: "Entendi!",
      }
    );
  }

  save() {
    this.$emit("onSave");
  }

  async removeItemTestCase(index: number) {
    try {
      let action = await this.$confirm(
        "Deseja remover o caso de teste?",
        "Confirmar exclusão",
        {
          confirmButtonText: "Excluir",
          cancelButtonText: "Cancelar",
          confirmButtonClass: "el-button--danger",
        }
      );
      if (action == "confirm") {
        this.mechanic.itemTestCases.splice(index, 1);
        this.updateIndexes();
      }
    } catch (e) {}
  }

  removeResponseTestCase(itemTestCase: ItemTestCase, responseIndex: number) {
    itemTestCase.responseTestCases.splice(responseIndex, 1);
    this.updateIndexes();
  }

  addResponseTestCase(itemTestCase: ItemTestCase) {
    const responseTestCase = new ResponseTestCase(this.mechanic);
    itemTestCase.responseTestCases.push(responseTestCase);
    this.updateIndexes();
  }

  updateIndexes() {
    this.mechanic?.itemTestCases.forEach((itemTestCase, index) => {
      itemTestCase.position = index;
      itemTestCase.responseTestCases.forEach((response, index) => {
        response.position = index;
      });
    });
  }

  async runTests() {
    this.runningTests = true;
    try {
      const testCases = await this.runTestCases(this.mechanic);
      this.mechanic.itemTestCases = testCases;
      this.$emit("requestSave");
    } catch (e) {
      this.$notify.error("Não foi possível rodar os casos de teste");
    } finally {
      this.runningTests = false;
    }
  }

  @Action("score-function-test/execute") runScoreFunction!: (
    scoreFunctionTestDto: ScoreFunctionTestDto
  ) => Promise<ScoreFunctionTestResult>;

  @Action("score-function-test/runTestCases") runTestCases!: (
    mechanic: Mechanic
  ) => Promise<ItemTestCase[]>;

  isPassed(itemTestCase: ItemTestCase) {
    return (
      itemTestCase.responseTestCases.filter((response) =>
        isTestPassed(response)
      ).length == itemTestCase.responseTestCases.length
    );
  }

  unexpandAllExcept(itemTestCase: ItemTestCase) {
    this.mechanic.itemTestCases.forEach((t) => {
      if (t != itemTestCase) {
        t.expanded = false;
      }
    });
    this.focusTestCase(itemTestCase);
  }

  focusTestCase(itemTestCase: ItemTestCase) {
    let index = this.mechanic.itemTestCases.indexOf(itemTestCase);
    this.$nextTick(() => {
      document.getElementById(`test-case-${index}`)?.scrollIntoView();
    });
  }

  toggleExpanded(itemTestCase: ItemTestCase) {
    this.unexpandAllExcept(itemTestCase);
    itemTestCase.expanded = !itemTestCase.expanded;
    let index = this.mechanic.itemTestCases.indexOf(itemTestCase);
    this.mechanic.itemTestCases.splice(index, 1, itemTestCase);
    if (itemTestCase.expanded) {
      this.focusTestCase(itemTestCase);
    }
    emitResize();
  }

  addCodeToExistentScoreFunction(fn: { name: string; code: string }) {
    this.mechanic.scoreFunction = `${this.mechanic.scoreFunction}
//${fn.name}
${fn.code}`;
  }

  mounted() {
    this.updateIndexes();
  }
}
</script>
<style lang="scss">
.add-item-btn {
  margin: 10px 0;
  font-weight: bold;
}
.test-case {
  border-radius: 5px;
  margin: 10px 0;

  .responses-test-case {
    padding: 15px 0;
    //border-radius: 0 40px 0 40px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    //margin-bottom: 8px;
  }
  .responses-test-case.fail {
    background: rgba(255, 0, 0, 0.2);
  }
  .responses-test-case.success {
    background: rgba(0, 255, 0, 0.2);
  }

  .icon-remove-response-test-case {
    width: 100%;
    text-align: right;
  }
}
.score-area {
  display: flex;
  flex-flow: column nowrap;

  div.item {
    padding-bottom: 10px;
  }
  .score-test-indicator {
    i {
      font-size: 20pt;
    }
  }
}
.expand-row {
  padding: 3px;
  border-radius: 5px;
}
</style>