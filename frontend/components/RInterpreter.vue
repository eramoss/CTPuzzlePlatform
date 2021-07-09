<template>
  <div>
    <el-dialog :visible.sync="visible" title="Interpretador R" width="80%">
      <select-numeric-variables :testApplicationData="data" />
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
          <el-button class="top-marged" type="success" @click="runScript"
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
import { CsvData } from "~/types/CsvData";
@Component({
  components: {
    CodeEditor,
    SelectNumericVariables,
  },
})
export default class RInterpreter extends Vue {
  @Prop() data!:CsvData
  visible = true
  rScript = `#Escreva seu código na linguagem R (experimental)
a <- 1 + 1
a + 2`;
  response = "";

  @Action(ACTION_R_RUN_SCRIPT) run!: (script: string) => Promise<string>;

  async runScript() {
    try {
      this.response = await this.run(this.rScript);
    } catch (e) {
      this.response = e;
    }
  }
}
</script>