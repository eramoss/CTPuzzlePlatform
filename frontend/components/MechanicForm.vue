<template>
  <div>
    <el-form>
      <el-row>
        <el-col>
          <el-form-item label="Nome" title="Nome da mecânica" required="">
            <el-input
              v-model="mechanic.name"
              autofocus
              placeholder="Programação ROPE"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <code-editor v-model="mechanic.classDefinition" height="200px" />
          </el-form-item>
          <el-form-item>
            <code-editor v-model="mechanic.scoreFunction" height="200px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-button type="success">Salvar</el-button>
          <el-button @click="$emit('cancel')">Cancelar</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import Vue from "vue";
import CodeEditor from "@/components/CodeEditor";
export default Vue.extend({
  components: {
    CodeEditor,
  },
  data() {
    return {
      mechanic: {
        name: 'Programação Rope',
        classDefinition: `class ItemProgramacaoRope {
  caminhoPercorrido: Array<string>;
  melhorCaminho: Array<string>;
  tempoDesependido: number;
  numeroPecasUtilizadas: number;
  numeroPecasNecessarias: number;
}`,
        scoreFunction: `function calculaScore(resposta: ItemProgramacaoRope){
   //...
}`,
      },
    };
  },
});
</script>
