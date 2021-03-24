<template>
  <div>
    <!-- <MessageAlert type="info">
        Para testar a função de escore, instancie e retorne um objeto de item e
        um objeto de resposta resposta seguindo as funções de exemplo.
      </MessageAlert> -->
    <el-button
      icon="el-icon-video-play"
      style="margin-bottom: 10px"
      type="success"
      size="small"
      @click="executeScoreFunction"
      title="Executar função de cálculo de escore"
      >Executar</el-button
    >
    <el-row>
      <code-editor
        :uniqueId="`scoreFunction${mechanic.id}`"
        editorTitle="Função de escore"
        height="300px"
        v-model="mechanic.scoreFunction"
      >
        <template slot="bar">
          <el-button
            type="text"
            title="Resetar para exemplo inicial"
            @click="clearSampleScoreFunction"
            >Exemplo</el-button
          >
          <el-button
            type="text"
            title="Versão editada"
            :disabled="!bkpScoreFunction"
            @click="redoSampleScoreFunction"
            >Versão editada</el-button
          >
        </template>
      </code-editor>
    </el-row>

    <el-row
      :gutter="20"
      v-if="mechanic"
      style="margin-top: 20px; margin-bottom: 20px"
    >
      <el-col :span="12">
        <code-editor
          :uniqueId="`itemInstantiation${mechanic.id}`"
          editorTitle="Função de item"
          height="250px"
          :fontSize="15"
          language="typescript"
          v-model="mechanic.itemInstantiation"
        >
          <template slot="bar">
            <el-tooltip
              effect="light"
              :open-delay="300"
              content="Testar item no ambiente do puzzzle"
            >
              <el-button
                type="success"
                icon="el-icon-video-play"
                @click="testItem"
                >Testar</el-button
              >
            </el-tooltip>
            <el-button
              type="text"
              title="Resetar para exemplo inicial"
              @click="clearSampleItem"
              >Exemplo</el-button
            >
            <el-button
              type="text"
              title="Versão editada"
              :disabled="!bkpItem"
              @click="redoSampleItem"
              >Versão editada</el-button
            >
          </template>
        </code-editor>
      </el-col>
      <el-col :span="12">
        <code-editor
          :uniqueId="`responseInstantiation${mechanic.id}`"
          editorTitle="Função de resposta"
          height="250px"
          :fontSize="15"
          language="typescript"
          v-model="mechanic.responseInstantiation"
        >
          <template slot="bar">
            <el-button
              type="text"
              title="Resetar para exemplo inicial"
              @click="clearSampleResponse"
              >Exemplo</el-button
            >
            <el-button
              type="text"
              title="Versão editada"
              :disabled="!bkpResponse"
              @click="redoSampleResponse"
              >Versão editada</el-button
            >
          </template>
        </code-editor>
      </el-col>
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
      <!-- <el-input type="textarea" v-model="response" rows="20"></el-input> -->
      <!-- <template slot="footer">
        <div>
            <el-button
            @click="responseDialogVisible = false"
            type="primary"
            icon="el-icon-close"
            >Fechar</el-button
            >
        </div>
        </template> -->
    </el-dialog>

    <div v-if="showTestCases">
      <el-button
        icon="el-icon-video-play"
        style="margin-bottom: 10px"
        type="success"
        size="small"
        @click="runTests"
        :loading="runningTests"
        title="Rodar casos de teste"
        >Rodar casos de teste</el-button
      >
      <el-row
        class="test-case"
        :key="itemTestCase.id"
        v-for="(itemTestCase, index) in mechanic.itemTestCases"
        :gutter="20"
      >
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
              <el-col :span="16">
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
              <el-col :span="8" class="score-area">
                <div class="item">
                  <form-item-label class="label" label="Valor esperado" />
                  <el-input
                    size="large"
                    v-model="itemResponseTestCase.expectedScore"
                  ></el-input>
                </div>
                <div class="item">
                  <form-item-label class="label" label="Valor obtido" />
                  <item-response-score-cell
                    :score="itemResponseTestCase.score"
                  />
                </div>

                <div
                  v-if="itemResponseTestCase.score"
                  class="item score-test-indicator"
                >
                  <form-item-label class="label" label="Passou no teste?" />
                  <div
                    v-if="
                      itemResponseTestCase.score.score ==
                      itemResponseTestCase.expectedScore
                    "
                  >
                    <i
                      title="Passou no teste"
                      class="el-icon-success green"
                    ></i>
                  </div>
                  <div v-else>
                    <i
                      title="Não passou no teste"
                      class="el-icon-error red"
                    ></i>
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
        <el-col> </el-col>
      </el-row>
      <div>
        <el-tooltip
          effect="light"
          :open-delay="400"
          content="Adiciona um caso de teste de item para validar função de escore"
        >
          <el-button
            icon="el-icon-plus"
            class="add-item-btn"
            type="primary"
            @click="addItemTestCase"
            >Adicionar caso de teste</el-button
          >
        </el-tooltip>
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
import queryString from "~/utils/utils";
import { itemInstantiationExample, ItemTestCase } from "~/types/ItemTestCase";
import {
  responseInstantiationExample,
  ResponseTestCase,
} from "~/types/ResponseTestCase";

@Component({
  components: {
    CodeEditor,
    ItemResponseScoreCell,
  },
})
export default class ScoreFunctionTestForm extends Vue {
  bkpResponse: string = "";
  bkpItem: string = "";
  bkpScoreFunction: string = "";
  responseDialogVisible = false;
  showTestCases: boolean = true;

  response: string = "";
  @VModel() mechanic!: Mechanic;
  runningTests = false;

  @Watch("mechanic", { immediate: true })
  onChangeMechanic() {
    if (!this.mechanic.itemInstantiation) {
      this.clearSampleItem();
    }
    if (!this.mechanic.responseInstantiation) {
      this.clearSampleResponse();
    }
    if (!this.mechanic.scoreFunction) {
      this.clearSampleScoreFunction();
    }
  }

  addItemTestCase() {
    this.mechanic.itemTestCases.push(new ItemTestCase());
    this.showItemTestHelp();
  }

  showItemTestHelp() {
    this.$alert(
      "Um novo caso de teste foi adicionado. Agora você precisa ajustar a função do item de teste e adicionar respostas para validar o resultado da função de escore.",
      "Edite o caso de teste",
      {
        confirmButtonText: "Entendi",
        type: "warning",
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
    let lastResponse =
      itemTestCase.responseTestCases[itemTestCase.responseTestCases.length - 1];
    let responseInstantiation = undefined;
    if (lastResponse) {
      responseInstantiation = lastResponse.responseInstantiation;
    }
    const responseTestCase = new ResponseTestCase();
    if (responseInstantiation) {
      responseTestCase.responseInstantiation = `//Cópia. Alterar!
${responseInstantiation}`;
    }
    itemTestCase.responseTestCases.push(responseTestCase);
  }

  redoSampleResponse() {
    this.mechanic.responseInstantiation = this.bkpResponse;
    this.bkpResponse = "";
  }

  async runTests() {
    this.runningTests = true;
    try {
      const testCases = await this.runTestCases(this.mechanic);
      this.mechanic.itemTestCases = testCases;
    } catch (e) {
      this.$notify.error("Não foi possível rodar os casos de teste");
    } finally {
      this.runningTests = false;
    }
  }

  redoSampleItem() {
    this.mechanic.itemInstantiation = this.bkpItem;
    this.bkpItem = "";
  }

  redoSampleScoreFunction() {
    this.mechanic.scoreFunction = this.bkpScoreFunction;
    this.bkpScoreFunction = "";
  }

  clearSampleItem() {
    this.bkpItem = this.mechanic.itemInstantiation;
    this.mechanic.itemInstantiation = itemInstantiationExample();
  }

  clearSampleResponse() {
    this.bkpResponse = this.mechanic.responseInstantiation;
    this.mechanic.responseInstantiation = responseInstantiationExample();
  }

  clearSampleScoreFunction() {
    this.bkpScoreFunction = this.mechanic.scoreFunction;
    this.mechanic.scoreFunction = `// Defina a função de cálculo com os parâmetros de item e resposta:
function calculaScore(item: MeuItem, resposta: MinhaReposta){ //<-- Substitua os tipos dos parâmetros com os tipos definidos na mecânica
//  Implemente o cálculo da nota
    let nota = 0;
    if(item.respostaEsperada == resposta.valorInformado){
        if(item.tempoParaResponser == 2 * resposta.tempoMaximo){
            nota = 5;
        }
    }
   return { score: nota, max: 10 }; //<-- O retorno deve ser nesse formato: { score: nota, max: nota máxima }
}`;
  }

  testItem() {
    let appBaseUrl = this.mechanic.baseUrl;
    let serverBaseUrl = this.$axios.defaults.baseURL;
    let mechanicId = this.mechanic.id;
    let urlToInstantiateItem = `${serverBaseUrl}/mechanics/public/instantiate/${mechanicId}`;
    let qs = queryString({ op: "playground", urlToInstantiateItem });
    window.open(`${appBaseUrl}?${qs}`, "_blank");
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
}
</script>
<style lang="scss">
.add-item-btn {
  margin: 10px 0;
  font-weight: bold;
}
.test-case {
  border: 1px solid #ccc;
  padding: 10px;
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
</style>