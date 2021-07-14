<template>
  <div>
    <color-panel
      label="Interpretador R"
      textColor="#1F77B4"
      color="#BAD5E8"
      :showInfo="true"
    >
      <template slot="info">
        O interpretador R é útil para cálculos mais complexos sobre as variáveis
        do teste. <br />
        Utilize fontes externas como sites ou livros para aprender sobre a
        linguagem. <br />
        Você também pode instalar a linguagem R e o editor RStudio para
      </template>
      <message-alert>
        <p>
          Você pode fazer análises avançadas usando o interpretador de linguagem
          R.
        </p>
      </message-alert>
      <el-button
        icon="el-icon-video-play"
        type="primary"
        @click="show"
        :loading="opening"
        >Experimentar</el-button
      >
    </color-panel>
    <el-dialog
      top="20px"
      :visible.sync="visible"
      :close-on-click-modal="false"
      title="Interpretador R"
      width="80%"
    >
      <div class="flex-row">
        <select-numeric-variables
          :hideLabel="true"
          @change="onSelectVariable"
          :testApplicationData="data"
          class="fill"
          style="margin-right: 10px"
        />
        <el-button
          icon="el-icon-magic-stick"
          type="primary"
          @click="openFunctionsLibrary"
        >
          Biblioteca de funções
        </el-button>
      </div>

      <div class="top-marged">
        <code-editor
          :showLineNumbers="true"
          v-model="rScript"
          :fontSize="18"
          language="r"
          height="300px"
          :hideMaximizer="true"
        />
      </div>
      <div class="top-marged">
        <div class="flex-row" style="margin-bottom: 5px">
          <el-button
            :loading="running"
            type="success"
            @click="runScript"
            icon="el-icon-video-play"
            >Calcular
          </el-button>
          <el-button @click="clearConsole" icon="el-icon-delete"
            >Limpar</el-button
          >
        </div>
        <textarea
          class="output-area"
          readonly
          v-model="response"
          name="Output"
        ></textarea>
      </div>
    </el-dialog>
    <functions-library
      ref="functionsLibrary"
      @onChooseFunction="insertRFunctionCode"
    />
    <r-script-runner ref="rScriptRunner" />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Ref } from "nuxt-property-decorator";
import CodeEditor from "~/components/CodeEditor.vue";
import SelectNumericVariables from "~/components/SelectNumericVariables.vue";
import FunctionsLibrary from "~/components/FunctionsLibrary.vue";
import {
  CsvData,
  csvDataToCsv,
  CsvHeaderLabel,
  CSV_SEPARATOR,
} from "~/types/CsvData";
import RFunctionCode from "~/types/RFunctionCode";
import eventBus from "~/utils/eventBus";
import RScriptRunner from "./statistics/RScriptRunner.vue";
@Component({
  components: {
    CodeEditor,
    SelectNumericVariables,
    FunctionsLibrary,
    RScriptRunner,
  },
})
export default class RInterpreter extends Vue {
  @Prop() data!: CsvData;
  @Ref() functionsLibrary!: FunctionsLibrary;
  @Ref() rScriptRunner!: RScriptRunner;

  running = false;
  selectedVariable: string = "";
  response = ">";
  visible: boolean = false;

  rScript = `#Escreva seu código na linguagem R (experimental)
a <- 1 + 1
a + 2
#A variável dados é implícita
#Média:
mean($1)
`;
  opening: boolean = false;

  show() {
    this.opening = true;
    eventBus.$emit("resize");
    setTimeout(() => {
      this.visible = true;
      this.opening = false;
    }, 200);
  }

  clearConsole() {
    this.response = ">";
  }

  async runScript() {
    this.replaceParameters();
    try {
      this.running = true;
      this.response = await this.rScriptRunner.run({
        script: this.rScript,
        csv: csvDataToCsv(this.data),
        separator: CSV_SEPARATOR,
        dataVarName: "dados",
      });
    } catch (e) {
      this.response = e;
    } finally {
      this.running = false;
    }
  }

  openFunctionsLibrary() {
    this.functionsLibrary.show();
  }

  onSelectVariable(csvHeader: CsvHeaderLabel) {
    this.selectedVariable = csvHeader.value;
    this.rScript += `\ndados$` + this.selectedVariable;
    this.runScript();
  }

  insertRFunctionCode(rFunctionCode: RFunctionCode) {
    this.rScript += "\n\n#" + rFunctionCode.howToInterpret;
    this.rScript += "\n" + rFunctionCode.code;
    this.runScript();
  }

  replaceParameters() {
    if (this.selectedVariable) {
      this.rScript = this.rScript.replaceAll(
        "$1",
        "dados$" + this.selectedVariable
      );
    }
  }
}
</script>
<style lang="scss">
.output-area {
  width: 100%;
  min-height: 300px;
  font-family: "Courier New", Courier, monospace;
  background: rgba(0, 0, 0, 0.9);
  padding: 10px;
  color: lime;
  font-weight: bold;
  font-size: 12pt;
}
</style>