<template>
  <div>
    <el-button
      size="small"
      @click="showDialogAddFn"
      icon="el-icon-s-tools"
      type="warning"
      >Adicionar função auxiliar</el-button
    >
    <el-dialog
      top="10px"
      append-to-body
      title="Escolha a função auxiliar"
      :visible.sync="dialogVisible"
    >
      <el-select v-model="value" value-key="name" placeholder="Selecionar">
        <el-option
          :key="fn.name"
          v-for="fn in functions"
          :value="fn"
          :label="fn.name"
        ></el-option>
      </el-select>

      <div v-show="value.description.length" class="fn-explanation">
        <b>{{ value.name }}</b>
        <p>
          {{ value.description }}
        </p>
        <p>
          <b>Referência:</b
          ><a target="_blank" :href="value.reference">{{ value.reference }}</a>
        </p>
      </div>

      <code-editor
        v-if="dialogVisible"
        v-show="value.code"
        v-model="value.code"
        :fontSize="13"
      ></code-editor>
      <template slot="footer">
        <el-button
          @click="handleChange"
          :disabled="!value.name.length"
          type="primary"
        >
          Adicionar função ao código existente
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import CodeEditor from "./CodeEditor.vue";

import { Component } from "nuxt-property-decorator";
@Component({
  components: {
    CodeEditor,
  },
})
export default class HelperFunctions extends Vue {
  dialogVisible = false;
  value: { name: string; code: string; description: string; reference: "" } = {
    name: "",
    code: "",
    description: "",
    reference: "",
  };
  functions = [
    {
      name: "Distância Levenshtein",
      description: `Em teoria da informação, a distância Levenshtein ou distância de edição entre dois "strings" (duas sequências de caracteres) é dada pelo número mínimo de operações necessárias para transformar um string no outro. Entendemos por "operações" a inserção, deleção ou substituição de um carácter. O nome advém do cientista russo Vladimir Levenshtein, que considerou esta distância já em 1965. É muito útil para aplicações que precisam determinar quão semelhantes dois strings são, como é por exemplo o caso com os verificadores ortográficos.`,
      reference: "https://pt.wikipedia.org/wiki/Dist%C3%A2ncia_Levenshtein",
      code: `function levenshteinDistance(str1 = '', str2 = ''){
   const track = Array(str2.length + 1).fill(null).map(() =>
   Array(str1.length + 1).fill(null));
   for (let i = 0; i <= str1.length; i += 1) {
      track[0][i] = i;
   }
   for (let j = 0; j <= str2.length; j += 1) {
      track[j][0] = j;
   }
   for (let j = 1; j <= str2.length; j += 1) {
      for (let i = 1; i <= str1.length; i += 1) {
         const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
         track[j][i] = Math.min(
            track[j][i - 1] + 1, // deletion
            track[j - 1][i] + 1, // insertion
            track[j - 1][i - 1] + indicator, // substitution
         );
      }
   }
   return track[str2.length][str1.length];
};`,
    },
    {
      name: "Similaridade de palavras entre 0 e 1 (Variação de Levenshtein)",
      description: `Esta função é a mesma que a Levenshtein, com a diferença de que o retorno varia entre 0 (pouco similar) e 1 (totalmente similar). `,
      reference:
        "https://stackoverflow.com/questions/10405440/percentage-rank-of-matches-using-levenshtein-distance-matching",
      code: `//1 = Totalmente similar
      //0.5 = Metade similar
      function stringsSimilarity(str1 = '', str2 = ''){
   const track = Array(str2.length + 1).fill(null).map(() =>
   Array(str1.length + 1).fill(null));
   for (let i = 0; i <= str1.length; i += 1) {
      track[0][i] = i;
   }
   for (let j = 0; j <= str2.length; j += 1) {
      track[j][0] = j;
   }
   for (let j = 1; j <= str2.length; j += 1) {
      for (let i = 1; i <= str1.length; i += 1) {
         const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
         track[j][i] = Math.min(
            track[j][i - 1] + 1, // deletion
            track[j - 1][i] + 1, // insertion
            track[j - 1][i - 1] + indicator, // substitution
         );
      }
   }
   let lev = track[str2.length][str1.length]
   let bigger = str1;
   if(str2.length > bigger.length){
      bigger = str2
   }
   return (bigger.length - lev) / bigger.length;
};`,
    },
  ];

  showDialogAddFn() {
    this.dialogVisible = true;
  }

  handleChange() {
    this.$emit("onSelectFunction", this.value);
    this.dialogVisible = false;
  }
}
</script>
<style lang="scss">
.fn-explanation {
  word-break: keep-all;
  margin: 10px auto;
}
</style>