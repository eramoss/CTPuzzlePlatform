<template>
  <el-dialog
    :visible.sync="visible"
    top="10px"
    width="90%"
    title="Playground para teste de função de escore"
  >
    <div>
      <MessageAlert type="info">
        Para testar a função de escore, instancie e retorne um objeto de item e
        um objeto de resposta resposta seguindo as funções de exemplo.
      </MessageAlert>

      <el-row :gutter="20" v-if="mechanic">
        <el-col :span="12">
          <form-item-label label="Instanciação do item" />

          <code-editor
            editorTitle="Função que retorna o item (siga o exemplo)"
            height="200px"
            language="typescript"
            v-model="mechanic.itemInstantiation"
          >
            <template slot="bar">
              <el-button
                type="text"
                size="small"
                title="Resetar para exemplo inicial"
                icon="el-icon-refresh-left"
                @click="clearSampleItem"
              ></el-button>
              <el-button
                type="text"
                title="Refazer"
                size="small"
                icon="el-icon-refresh-right"
                :disabled="!bkpItem"
                @click="redoSampleItem"
              ></el-button>
            </template>
          </code-editor>
        </el-col>
        <el-col :span="12">
          <form-item-label label="Instanciação da resposta " />
          <el-button
            type="text"
            title="Resetar para exemplo inicial"
            icon="el-icon-refresh-left"
            @click="clearSampleResponse"
          ></el-button>
          <el-button
            type="text"
            title="Refazer"
            icon="el-icon-refresh-right"
            :disabled="!bkpResponse"
            @click="redoSampleResponse"
          ></el-button>
          <code-editor
            editorTitle="Função que retorna a resposta (siga o exemplo)"
            height="200px"
            language="typescript"
            v-model="mechanic.responseInstantiation"
          ></code-editor>
        </el-col>
      </el-row>
      <el-row>
        <el-button
          icon="el-icon-video-play"
          type="success"
          size="small"
          @click="executeScoreFunction"
          title="Executar função de cálculo de escore"
          >Executar</el-button
        >
        <br />
        <form-item-label label="Resposta" />
        <el-input
          type="textarea"
          rows="10"
          placeholder="A resposta aparecerá aqui..."
          v-model="response"
        />
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

@Component({
  components: {
    CodeEditor,
  },
})
export default class ScoreFunctionTestForm extends Vue {
  visible: boolean = false;
  bkpResponse: string = "";
  bkpItem: string = "";

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

  clearSampleItem() {
    this.bkpItem = this.mechanic.itemInstantiation;
    this.mechanic.itemInstantiation = `// function criarItem(): Item {
//  let item = new Item();
//  item.respostaEsperada = 'aaaa';
//  ...
//  return item;
//}`;
  }

  clearSampleResponse() {
    this.bkpResponse = this.mechanic.responseInstantiation;
    this.mechanic.responseInstantiation = `// function criarResposta(): Resposta {
//  let resposta = new Resposta();
//  resposta.respostaInformada = 'aaab';
//  ...
//  return resposta;
// }`;
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
    } catch (e) {
      this.response = e;
    }
  }
}
</script>