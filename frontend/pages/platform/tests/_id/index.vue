<template>
  <div class="left">
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/platform' }"
        >Plataforma</el-breadcrumb-item
      >
      <el-breadcrumb-item :to="{ path: '/platform/tests' }"
        >Testes</el-breadcrumb-item
      >
      <el-breadcrumb-item>Edição</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="panel">
      <h2>Edição de teste</h2>
      <el-form>
        <el-row :gutter="15">
          <el-col :span="15">
            <el-form-item label-width="130px" label="Nome do teste">
              <el-input
                v-model="test.name"
                placeholder="Teste de Pensamento Computacional"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label-width="130px" label="Situação">
              <el-tag type="success" size="large">PUBLICADO</el-tag>
              <a :href="test.link" title="Acessar teste" target="_blank">{{
                test.link
              }}</a>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-button @click="save" type="success">Salvar</el-button>
            <el-button @click="back">Cancelar</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Test from "~/types/Test";
import { VModel } from "vue-property-decorator";

@Component
export default class TestEditForm extends Vue {
  @VModel({ default: () => new Test() }) test!: Test;

  save() {}

  back() {
    this.$router.go(-1);
  }
}
</script>
