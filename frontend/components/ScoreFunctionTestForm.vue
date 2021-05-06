<template>
  <div>
    <!-- <MessageAlert type="info">
        Para testar a função de escore, instancie e retorne um objeto de item e
        um objeto de resposta resposta seguindo as funções de exemplo.
      </MessageAlert> -->
    <el-button
      v-show="showTestFunction"
      icon="el-icon-video-play"
      style="margin-bottom: 10px"
      type="success"
      size="small"
      @click="executeScoreFunction"
      title="Executar função de cálculo de escore"
    >
      Executar
    </el-button>
    <el-row>
      <code-editor
        :uniqueId="`scoreFunction${mechanic.id}`"
        editorTitle="Função de escore"
        :useHeightControls="true"
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

    <el-dialog
      width="80%"
      top="20px"
      title="Resultado do teste da função de escore"
      :visible.sync="responseDialogVisible"
      append-to-body
    >
      <code-editor
        language="none"
        v-model="response"
        height="500px"
        :readonly="true"
      />
    </el-dialog>

    <div>
      <div
        class="test-case"
        :gutter="20"
        :key="itemTestCase.id"
        v-for="(itemTestCase, index) in mechanic.itemTestCases"
      >
        <el-row>
          <div class="flex-row expand-row">
            <div>
              <b>Caso de teste {{ index + 1 }}</b>
              <b>
                <span class="green" v-if="isPassed(itemTestCase)"
                  >Passou nos testes</span
                >
                <span class="red" v-else>Não passou no teste</span>
              </b>
            </div>
            <div>
              <el-button type="text" @click="toggleExpanded(itemTestCase)"
                ><b>{{ itemTestCase.expanded ? "Encolher" : "Expandir" }}</b>
              </el-button>
            </div>
          </div>
        </el-row>
        <el-row v-show="itemTestCase.expanded" :gutter="20">
          <el-col :span="12">
            <code-editor
              :uniqueId="`itemInstantiation${itemTestCase.id}_${mechanic.id}`"
              :editorTitle="`Função de item ${index + 1}`"
              height="250px"
              :fontSize="15"
              language="typescript"
              v-model="itemTestCase.itemInstantiation"
            >
              <div slot="bar">
                <el-button
                  type="danger"
                  icon="el-icon-close"
                  title="Remover caso de teste"
                  @click="removeItemTestCase(index)"
                  >Remover</el-button
                >
              </div>
            </code-editor>
          </el-col>
          <el-col :span="12">
            <div
              :key="itemResponseTestCase.id"
              v-for="(
                itemResponseTestCase, itemRespIndex
              ) in itemTestCase.responseTestCases"
            >
              <el-row :gutter="20">
                <el-col :span="18">
                  <code-editor
                    :uniqueId="`responseInstantiation${mechanic.id}`"
                    :editorTitle="`Função de resposta ${itemRespIndex + 1}`"
                    height="250px"
                    :fontSize="15"
                    language="typescript"
                    v-model="itemResponseTestCase.responseInstantiation"
                  >
                    <div slot="bar">
                      <el-button
                        type="danger"
                        icon="el-icon-close"
                        title="Remover função de resposta do caso de teste"
                        @click="
                          removeResponseTestCase(itemTestCase, itemRespIndex)
                        "
                        >Remover</el-button
                      >
                    </div>
                  </code-editor>
                </el-col>
                <el-col :span="6" class="score-area">
                  <div>
                    <div class="item">
                      <form-item-label label="Valor esperado" />
                      <el-input
                        size="large"
                        v-model="itemResponseTestCase.expectedScore"
                      ></el-input>
                    </div>
                    <div class="item">
                      <form-item-label label="Valor obtido" />
                      <item-response-score-cell
                        :score="itemResponseTestCase.score"
                      />
                    </div>

                    <div
                      v-if="itemResponseTestCase.score"
                      class="item score-test-indicator"
                    >
                      <form-item-label label="Passou no teste?" />
                      <div
                        v-if="
                          itemResponseTestCase.score.score ==
                          itemResponseTestCase.expectedScore
                        "
                      >
                        <el-tooltip content="Passou no teste">
                          <i class="el-icon-success green"></i>
                        </el-tooltip>
                      </div>
                      <div v-else>
                        <el-tooltip content="Não passou no teste">
                          <i class="el-icon-error red"></i>
                        </el-tooltip>
                      </div>
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
  VModel,
  Watch,
} from "nuxt-property-decorator";
import Mechanic from "~/types/Mechanic";
import { createScoreFunctionCode, ItemTestCase } from "~/types/ItemTestCase";
import { ResponseTestCase } from "~/types/ResponseTestCase";
import { isTestPassed } from "./ScoreFunctionTestsSummary.vue";
import eventBus, { emitResize } from "~/utils/eventBus";

@Component({
  components: {
    CodeEditor,
    ItemResponseScoreCell,
  },
})
export default class ScoreFunctionTestForm extends Vue {
  responseDialogVisible = false;
  @Prop({ default: false }) showTestFunction!: boolean;

  response: string = "";
  @VModel() mechanic!: Mechanic;
  runningTests = false;

  addItemTestCase() {
    let index = this.mechanic.itemTestCases.length;
    this.mechanic.itemTestCases.push(new ItemTestCase(this.mechanic));
    this.showItemTestHelp();
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

  removeItemTestCase(index: number) {
    this.mechanic.itemTestCases.splice(index, 1);
  }

  removeResponseTestCase(itemTestCase: ItemTestCase, responseIndex: number) {
    itemTestCase.responseTestCases.splice(responseIndex, 1);
  }

  addResponseTestCase(itemTestCase: ItemTestCase) {
    const responseTestCase = new ResponseTestCase(this.mechanic);
    itemTestCase.responseTestCases.push(responseTestCase);
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

  async executeScoreFunction() {
    let scoreFunctionTestDto = {
      mechanic: this.mechanic,
    } as ScoreFunctionTestDto;
    try {
      let result = await this.runScoreFunction(scoreFunctionTestDto);
      this.response = result.response;
      this.responseDialogVisible = true;
    } catch (e) {
      this.response = e;
    }
  }

  clearSampleScoreFunction() {
    this.mechanic.scoreFunction = createScoreFunctionCode(
      this.mechanic.classDefinition,
      this.mechanic.responseClassDefinition
    );
  }

  isPassed(itemTestCase: ItemTestCase) {
    return (
      itemTestCase.responseTestCases.filter((response) =>
        isTestPassed(response)
      ).length == itemTestCase.responseTestCases.length
    );
  }

  @Watch("mechanic", { immediate: true })
  onChangeMechanic() {
    if (!this.mechanic.scoreFunction) {
      this.clearSampleScoreFunction();
    }
  }

  toggleExpanded(itemTestCase: ItemTestCase) {
    itemTestCase.expanded = !itemTestCase.expanded;
    let index = this.mechanic.itemTestCases.indexOf(itemTestCase);
    this.mechanic.itemTestCases.splice(index, 1, itemTestCase);
    emitResize();
  }

  addCodeToExistentScoreFunction(fn: { name: string; code: string }) {
    this.mechanic.scoreFunction = `${this.mechanic.scoreFunction}
//${fn.name}
${fn.code}`;
  }
}
</script>
<style lang="scss">
.add-item-btn {
  margin: 10px 0;
  font-weight: bold;
}
.test-case {
  margin: 20px 0;
}
.score-area {
  display: flex;
  flex-flow: column nowrap;
  padding: 10px;

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
  padding: 4px;
  background: #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
}
</style>