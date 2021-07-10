<template>
  <div>
    <el-button icon="el-icon-video-play" type="primary" @click="visible = true"
      >Experimentar</el-button
    >
    <el-dialog
      :visible.sync="visible"
      :close-on-click-modal="false"
      title="Interpretador R"
      width="80%"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <select-numeric-variables
            :hideLabel="true"
            @change="onSelectVariable"
            :testApplicationData="data"
            class="bottom-marged"
          />
        </el-col>
        <el-col :span="6">
          <div class="flex-row">
            <el-button
              icon="el-icon-magic-stick"
              type="primary"
              @click="openFunctionsLibrary"
            >
              Biblioteca de funções
            </el-button>
            <el-button :loading="running" type="success" @click="runScript"
              >Calcular >>
            </el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="flex-row end">
            <el-button @click="clearConsole" icon="el-icon-delete"
              >Limpar</el-button
            >
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :md="18">
          <code-editor
            v-model="rScript"
            :fontSize="18"
            language="r"
            height="300px"
            :hideMaximizer="true"
          />
        </el-col>
        <el-col :md="6">
          <textarea
            class="output-area"
            readonly
            v-model="response"
            name="Output"
          ></textarea>
        </el-col>
      </el-row>
      <el-row>
        <el-col> </el-col>
      </el-row>
    </el-dialog>
    <functions-library
      ref="functionsLibrary"
      @onChooseFunction="insertRFunctionCode"
    />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Action, Component, Prop, Ref } from "nuxt-property-decorator";
import { Context } from "@nuxt/types";
import CodeEditor from "~/components/CodeEditor.vue";
import SelectNumericVariables from "~/components/SelectNumericVariables.vue";
import FunctionsLibrary from "~/components/FunctionsLibrary.vue";
import { ACTION_R_RUN_SCRIPT } from "~/store/r";
import {
  CsvData,
  CsvHeaderLabel,
  getNumericColumnValues,
} from "~/types/CsvData";
import { help } from "mathjs";
import RFunctionCode from "~/types/RFunctionCode";
@Component({
  components: {
    CodeEditor,
    SelectNumericVariables,
    FunctionsLibrary,
  },
})
export default class RInterpreter extends Vue {
  @Prop() data!: CsvData;
  running = false;
  visible = true;
  rScript = `#Escreva seu código na linguagem R (experimental)
a <- 1 + 1
a + 2`;

  response = ">";

  @Action(ACTION_R_RUN_SCRIPT) run!: (script: string) => Promise<string>;
  @Ref() functionsLibrary!: FunctionsLibrary;
  selectedVariable: string = "";

  clearConsole() {
    this.response = ">";
  }

  async runScript() {
    try {
      this.running = true;
      this.response = await this.run(this.rScript);
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
    const codeAttributeSetToVar = `${
      csvHeader.value
    } <- c(${getNumericColumnValues(this.data, csvHeader).join(",")})`;
    this.rScript += `\n` + codeAttributeSetToVar;
  }

  insertRFunctionCode(rFunctionCode: RFunctionCode) {
    this.rScript +=
      "\n" + rFunctionCode.code.replace("$1", this.selectedVariable);
    this.runScript();
  }
}
</script>
<style lang="scss">
.output-area {
  width: 100%;
  min-height: 300px;
  font-family: "Courier New", Courier, monospace;
  background: rgba(0, 0, 0, 0.9);
  color: lime;
  font-weight: bold;
  font-size: 12pt;
}
</style>