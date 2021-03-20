<template>
  <el-dialog
    :visible.sync="visible"
    top="10px"
    width="95%"
    title="Playground para teste de função de escore"
  >
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
            uniqueId="scoreFunction"
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
           uniqueId="itemInstantiation"
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
           uniqueId="responseInstantiation"
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
      <el-row>
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
      </el-row>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import Vue from "vue";
import CodeEditor from "~/components/CodeEditor.vue";
import ScoreFunctionTestDto from "~/types/ScoreFunctionTestDto";
import ScoreFunctionTestResult from "~/types/ScoreFunctionTestResult";
import {
  Action,
  Component,
  Prop,
  VModel,
  Watch,
} from "nuxt-property-decorator";
import Mechanic from "~/types/Mechanic";
import queryString from "~/utils/utils";

@Component({
  components: {
    CodeEditor,
  },
})
export default class ScoreFunctionTestForm extends Vue {
  visible: boolean = false;
  bkpResponse: string = "";
  bkpItem: string = "";
  bkpScoreFunction: string = "";
  responseDialogVisible = false;

  response: string = "";
  @VModel() mechanic!: Mechanic;

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

  show() {
    this.visible = true;
  }

  redoSampleResponse() {
    this.mechanic.responseInstantiation = this.bkpResponse;
    this.bkpResponse = "";
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
    this.mechanic.itemInstantiation = `// Este tutorial é bem curto. Então leia.
// Codifique uma função para criar o item do teste. Exemplo:
function criarItem(): MeuItem {//<-- Erro de sintaxe
    let item = new MeuItem(); //<-- Erro de sintaxe
    //Informe os atributos do item. Exemplo:
    //item.tempoMaximoParaResponder = 60
    return item; //<-- retorne o item!
}
// Há erros de sintaxe porque a classe MeuItem 
// não é igual à definida na tela anterior.
// Substitua "MeuItem" pelo nome da sua classe de item
// e informe os atributos de acordo.`;
  }

  clearSampleResponse() {
    this.bkpResponse = this.mechanic.responseInstantiation;
    this.mechanic.responseInstantiation = `// Esse exemplo é muito parecido com o anterior (do item). Veja:
// Você precisa codificar uma função como esta, para retornar a resposta a ser testada:
function criarResposta(): MinhaReposta { //<-- Erro de sintaxe
    let resposta = new MinhaReposta(); //<-- Erro de sintaxe
    //Informe os atributos da resposta. Exemplo:
    //resposta.tempoQueLevouParaResponder = 55
    return resposta; //<-- retorne a resposta!
}
// Se no exemplo há erros de sintaxe, é porque a classe 
// não é igual às definidas na mecânica.
// Por isso, substitua "MinhaReposta" pelo nome da sua classe de resposta
// e informe valores para os atributos definidos lá.
`;
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
</style>