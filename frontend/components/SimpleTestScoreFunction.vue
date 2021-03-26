<template>
  <!--DEPRECATED!!! Usando ScoreFunctionTestForm.vue. Parte útil: Teste de item -->
  <el-row
    :gutter="20"
    v-if="mechanic"
    style="margin-top: 20px; margin-bottom: 20px"
  >
    <el-col :span="12">
      <code-editor
        :uniqueId="`itemInstantiation${mechanic.id}`"
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
        :uniqueId="`responseInstantiation${mechanic.id}`"
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
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "nuxt-property-decorator";
import Mechanic from "~/types/Mechanic";
import {
  createCleanInstantiationFunctionCode,
  createScoreFunctionCode,
} from "~/types/ItemTestCase";
import queryString from "~/utils/utils";
@Component
export default class SimpleScoreFunction extends Vue {
  @Prop() mechanic!: Mechanic;
  bkpResponse: string = "";
  bkpItem: string = "";

  redoSampleItem() {
    this.mechanic.itemInstantiation = this.bkpItem;
    this.bkpItem = "";
  }

  redoSampleResponse() {
    this.mechanic.responseInstantiation = this.bkpResponse;
    this.bkpResponse = "";
  }

  clearSampleItem() {
    this.bkpItem = this.mechanic.itemInstantiation;
    this.mechanic.itemInstantiation = createCleanInstantiationFunctionCode(
      this.mechanic.classDefinition,
      "criarItem"
    );
  }

  clearSampleResponse() {
    this.bkpResponse = this.mechanic.responseInstantiation;
    this.mechanic.responseInstantiation = createCleanInstantiationFunctionCode(
      this.mechanic.responseClassDefinition,
      "criarResposta",
      "resposta"
    );
  }

  testItem() {
    let appBaseUrl = this.mechanic.baseUrl;
    let serverBaseUrl = this.$axios.defaults.baseURL;
    let mechanicId = this.mechanic.id;
    let urlToInstantiateItem = `${serverBaseUrl}/mechanics/public/instantiate/${mechanicId}`;
    let qs = queryString({ op: "playground", urlToInstantiateItem });
    window.open(`${appBaseUrl}?${qs}`, "_blank");
  }

  @Watch("mechanic", { immediate: true })
  onChangeMechanic() {
    if (!this.mechanic.itemInstantiation) {
      this.clearSampleItem();
    }
    if (!this.mechanic.responseInstantiation) {
      this.clearSampleResponse();
    }
  }
}
</script>
