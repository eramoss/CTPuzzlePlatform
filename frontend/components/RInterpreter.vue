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
      <select-numeric-variables
        @change="onSelectVariable"
        :testApplicationData="data"
        class="bottom-marged"
      />
      <el-row :gutter="20">
        <el-col :md="18">
          <code-editor
            v-model="rScript"
            :fontSize="18"
            language="r"
            height="200px"
            :hideMaximizer="true"
          />
        </el-col>
        <el-col :md="6">
          <textarea
            readonly
            v-model="response"
            name="Output"
            id=""
            style="width: 100%; min-height: 300px"
          ></textarea>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-button
            :loading="running"
            class="top-marged"
            type="success"
            @click="runScript"
            >Rodar</el-button
          >
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Action, Component, Prop } from "nuxt-property-decorator";
import { Context } from "@nuxt/types";
import CodeEditor from "~/components/CodeEditor.vue";
import SelectNumericVariables from "~/components/SelectNumericVariables.vue";
import { ACTION_R_RUN_SCRIPT } from "~/store/r";
import {
  CsvData,
  CsvHeaderLabel,
  getNumericColumnValues,
} from "~/types/CsvData";
import { help } from "mathjs";
@Component({
  components: {
    CodeEditor,
    SelectNumericVariables,
  },
})
export default class RInterpreter extends Vue {
  @Prop() data!: CsvData;
  running = false;
  visible = false;
  rScript = `#Escreva seu código na linguagem R (experimental)
a <- 1 + 1
a + 2`;
  response = "";

  @Action(ACTION_R_RUN_SCRIPT) run!: (script: string) => Promise<string>;

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

  onSelectVariable(csvHeader: CsvHeaderLabel) {
    const codeAttributeSetToVar = `${
      csvHeader.value
    } <- c(${getNumericColumnValues(this.data, csvHeader).join(",")})`;
    this.rScript += `\n` + codeAttributeSetToVar;
  }
}
</script>