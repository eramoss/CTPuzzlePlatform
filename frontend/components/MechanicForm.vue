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
            <code-editor v-model="mechanic.classDefinition" />
          </el-form-item>
          <el-form-item>
            <code-editor v-model="mechanic.scoreFunction"></code-editor>
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
        name: null,
        classDefinition: null,
        scoreFunction: null,
      },
    };
  },
});
</script>
