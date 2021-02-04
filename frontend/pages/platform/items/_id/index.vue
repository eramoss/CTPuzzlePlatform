<template>
  <div class="left">
    <el-breadcrumb>
      <el-breadcrumb-item :to="{path: '/platform'}">Plataforma</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: '/platform/items'}">Itens de teste</el-breadcrumb-item>
      <el-breadcrumb-item>Edição</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="panel">
      <h2>Edição de item de testes</h2>
      <el-form>
        <el-row>
          <el-col>
            <el-row :gutter="20">
              <el-col :span="18">
                <el-form-item label="Nome" title="Nome" required="" label-width="130px">
                  <el-input
                    v-model="testItem.name"
                    autofocus
                    placeholder="Programação RoPE"
                  ></el-input>
                </el-form-item>
                <el-form-item label="Tipo de mecânica" label-width="130px">
                  <el-select v-model="testItem.mechanic">
                    <el-option v-for="mechanic in availableMechanics"
                               :key="mechanic.id"
                               :value="mechanic"
                               :label="mechanic.name"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="Descrição" title="Descrição da mecânica" label-width="130px">
                  <el-input
                    type="textarea"
                    v-model="testItem.description"
                    autofocus
                    placeholder="Informações sobre o desafio presente no item"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item title="Ilustração da mecânica">
                  <FormItemLabel label="Ilustração do item"/>
                  <ImageUploader/>
                </el-form-item>
              </el-col>
            </el-row>

            <MessageAlert type="info">
              A configuração do item deve obedecer as especificações definidas na mecânica. <br>
              O objeto json/TypeScript configurado deve ser utilizado pelo desenvolvedor no momento de instanciar o item
              do teste.
            </MessageAlert>

            <el-form-item>
              <FormItemLabel label="Especificação do item" :required="true"/>
              <code-editor v-model="testItem.itemDefinition" height="200px"/>
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
import {Provide, VModel} from "vue-property-decorator";
import Mechanic from '@/types/Mechanic'
import CodeEditor from "~/components/CodeEditor.vue";
import TestItem from "~/types/TestItem";

const testItemExample = new TestItem()
testItemExample.itemDefinition = `let item = new MecanicaRope();
item.mapa = [
  ['tile','tile','tile'],
  ['tile','tile','tile'],
]
item.osb = [
  ['tile','tile','tile'],
  ['tile','tile','tile'],
]`;


@Component({
  components: {
    CodeEditor
  }
})
export default class TestItemEditForm extends Vue {

  @VModel({default: () => testItemExample}) testItem!: TestItem;
  @Provide() availableMechanics: Mechanic[] = [];

  save() {
    setTimeout(() => {
      this.$notify({
        type: "success",
        title: "Sucesso ao salvar o item de teste!",
        message:
          "Agora você já pode criar testes com esse item",
      });
    }, 2000)
  }

  back() {
    this.$router.go(-1);
  }
}
</script>
