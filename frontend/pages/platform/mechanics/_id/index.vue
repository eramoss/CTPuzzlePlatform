<template>
  <div class="left">
    <el-breadcrumb>
      <el-breadcrumb-item :to="{path: '/platform'}">Plataforma</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path: '/platform/mechanics'}">Mecânicas</el-breadcrumb-item>
      <el-breadcrumb-item>Edição</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="panel">
      <h2>Edição de mecânica</h2>
      <el-form>
        <el-row>
          <el-col>
            <el-row :gutter="20">
              <el-col :span="18">
                <el-form-item label="Nome" title="Nome da mecânica" required="">
                  <el-input
                    v-model="mechanic.name"
                    autofocus
                    placeholder="Programação RoPE"
                  ></el-input>
                </el-form-item>
                <el-form-item label="Descrição" title="Descrição da mecânica">
                  <el-input
                    type="textarea"
                    v-model="mechanic.description"
                    autofocus
                    placeholder="Informações sobre a mecânica, destinada ao criador dos itens do teste"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item title="Ilustração da mecânica">
                  <FormItemLabel label="Imagem de ilustração"/>
                  <ImageUploader/>
                </el-form-item>
              </el-col>
            </el-row>

            <MessageAlert type="info">
              A criação da mecânica é a especificação do formato de configuração dos puzzles. Essa especificação deve
              ser
              feita por meio de uma classe, na linguagem TypeScript.
            </MessageAlert>


            <el-form-item>
              <FormItemLabel label="Especificação da mecânica" :required="true"/>
              <code-editor v-model="mechanic.classDefinition" height="200px"/>
            </el-form-item>
            <el-form-item>
              <FormItemLabel label="Especificação da resposta" :required="true"/>
              <code-editor v-model="mechanic.responseClassDefinition" height="200px"/>
            </el-form-item>
            <el-form-item>
              <FormItemLabel label="Cálculo do escore" :required="true"/>
              <code-editor v-model="mechanic.scoreFunction" height="200px"/>
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
import {VModel} from "vue-property-decorator";
import Mechanic from '@/types/Mechanic'
import CodeEditor from "~/components/CodeEditor.vue";

const classDefinitionExample = `
// Exemplo de classe de mecânica
class MecanicaRope {
  mapa: string[][];
  obstaculos: string[][];
  solucaoEsperada: Array<{x:number, y:number}>;
  comandosEsperados: Array<string>;
  face: string;
  x: number;
  y: number;
}`

const responseClassExample = `
// Exemplo de classe de resposta
class RespostaItem {
  caminhoPercorrido: Array<{x:number, y:number}>
  comandosUtilizados: string[]
}`

const scoreFunctionExample = `
// Exemplo de cálculo de nota
function calculaScore(resposta: ItemProgramacaoRope){
   // implementar cálculo da nota...
   let nota = 9
   return nota;
}`

const mechanicExample = new Mechanic('Programação RoPE', 'Fase de programção com RoPE', classDefinitionExample, responseClassExample, scoreFunctionExample)

@Component({
  components: {CodeEditor}
})
export default class MechanicEditForm extends Vue {

  @VModel({default: () => mechanicExample}) mechanic!: Mechanic

  save() {
    setTimeout(() => {
      this.$notify({
        type: "success",
        title: "Sucesso ao salvar a mecânica!",
        message:
          "Agora você já pode criar itens com essa mecânica",
      });
    }, 2000)
  }

  back() {
    this.$router.go(-1);
  }
}
</script>
