<template>
  <div class="left">
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/platform' }"
        >Plataforma</el-breadcrumb-item
      >
      <el-breadcrumb-item :to="{ path: '/platform/mechanics' }"
        >Mecânicas</el-breadcrumb-item
      >
      <el-breadcrumb-item>Edição</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="panel">
      <h2>Edição de mecânica de puzzle</h2>
      <el-form :model="mechanic" :rules="formRules" ref="mechanicForm">
        <el-row>
          <el-col>
            <el-row :gutter="20">
              <el-col :span="18">
                <el-form-item
                  label="Nome"
                  title="Nome da mecânica"
                  required=""
                  prop="name"
                >
                  <el-input
                    v-model="mechanic.name"
                    autofocus
                    ref="nameInput"
                    placeholder="Programação RoPE"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="Endereço do aplicativo (URL) que apresenta o puzzle"
                  title="URL base do aplicativo que deve apresentar esse tipo de puzzle (mecânica)"
                  required=""
                  prop="baseUrl"
                >
                  <el-input
                    v-model="mechanic.baseUrl"
                    autofocus
                    placeholder="https://ct.programming-game.com.br"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="Descrição"
                  title="Descrição da mecânica"
                  prop="description"
                >
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
                  <FormItemLabel label="Imagem de ilustração" />
                  <ImageUploader v-model="mechanic.thumbnail" />
                </el-form-item>
              </el-col>
            </el-row>

            <MessageAlert type="info">
              <p>
                A especificação da mecânica é uma classe<a
                  href="https://www.typescriptlang.org/"
                  >TypeScript</a
                >
                com as características do puzzle. Posição de objetos,
                tamanho de mapa, dificuldade, tempo esperado de resolução,
                número de vidas são exemplos de atributos.
              </p>
            </MessageAlert>

            <el-form-item prop="classDefinition">
              <code-editor
                editorTitle="Especificação da mecânica"
                :required="true"
                :uniqueId="`mechanicClassDefinition${mechanic.id}`"
                v-model="mechanic.classDefinition"
                @input="mechanicForm.validateField('classDefinition')"
                height="300px"
              />
            </el-form-item>

            <MessageAlert type="info">
              A classe de resposta contém os dados que o utilizados para o
              cálculo de escore. Tempo de resposta,
              número de erros, solução informada, número de tentativas são exemplos de atributos.
            </MessageAlert>

            <el-form-item prop="responseClassDefinition">
              <code-editor
                :uniqueId="`mechanicResponseClassDefinition${mechanic.id}`"
                editorTitle="Especificação da resposta"
                :required="true"
                @input="mechanicForm.validateField('responseClassDefinition')"
                v-model="mechanic.responseClassDefinition"
                height="200px"
              />
            </el-form-item>

            <!-- <MessageAlert type="info">
              A função de cálculo de escore recebe o item e uma resposta. Deve
              calcular a nota e retorná-la junto com a nota máxima alcançável,
              no seguinte formato: { score: number, max: number }. Exemplo de
              acerto da metade do item: { score: 4, max: 8 }
            </MessageAlert> -->

            <el-form-item prop="scoreFunction">
              <FormItemLabel
                label="Função de cálculo do escore"
                :required="true"
                style="flex-grow: 1"
              />

              <div>
                <el-button
                  type="primary"
                  title="Abrir playground de teste de função de escore"
                  icon="el-icon-video-play"
                  @click="openTestDialog"
                >
                  Editar função de cálculo de escore
                </el-button>
              </div>
              <!-- <code-editor
                editorTitle="Dica: utilize as classes definidas anteriormente. O editor completa automaticamente"
                v-model="mechanic.scoreFunction"
                @input="mechanicForm.validateField('scoreFunction')"
                height="300px"
              >
                <template slot="bar"> </template>
              </code-editor> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <btn-save @click="save" :loading="saving" />
            <btn-back @click="back"></btn-back>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <score-function-test-dialog
      ref="scoreFunctionTestDialog"
      v-model="mechanic"
    />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component } from "nuxt-property-decorator";
import { VModel, Ref } from "vue-property-decorator";
import Mechanic, { createMechanicExample } from "@/types/Mechanic";
import CodeEditor from "~/components/CodeEditor.vue";
import { Action } from "vuex-class";
import { AxiosResponse } from "axios";
import { ElForm } from "element-ui/types/form";
import { Context } from "@nuxt/types";
import { ElInput } from "element-ui/types/input";
import ScoreFunctionTestDialog from "~/components/ScoreFunctionTestDialog.vue";
import User from "~/types/User";

@Component({
  head: {
    title: "Mecânica e puzzle",
  },
  components: { CodeEditor, ScoreFunctionTestDialog },
})
export default class MechanicEditForm extends Vue {
  saving: boolean = false;
  mechanic!: Mechanic;
  @Ref("mechanicForm") mechanicForm!: ElForm;
  @Ref("nameInput") nameInput!: ElInput;
  @Ref() scoreFunctionTestDialog!: ScoreFunctionTestDialog;

  get formRules() {
    return {
      name: {
        required: true,
        message: "Informe o nome da mecânica",
        trigger: "blur",
      },
      description: {
        required: true,
        message: "Informe a descrição da mecânica",
        trigger: "blur",
      },
      baseUrl: {
        required: true,
        message:
          "Informe a url base do aplicativo onde esse tipo de puzzle será apresentado",
        trigger: "blur",
      },
      classDefinition: {
        required: true,
        message: "Informe a classe da mecânica",
      },
      responseClassDefinition: {
        required: true,
        message: "Informe a classe de resposta",
      },
      scoreFunction: {
        required: true,
        message: "Informe função de cálculo do escore",
      },
    };
  }

  openTestDialog() {
    this.scoreFunctionTestDialog.show();
  }

  async asyncData(ctx: Context) {
    let mechanic;
    let id = ctx.params.id;
    if (id == "new") {
      let ctxUser = ctx.$auth.user;
      let user = {
        id: ctxUser?.userId,
        researchGroup: ctxUser?.researchGroup,
      } as User;
      mechanic = createMechanicExample(user);
    }
    if (id != "new") {
      mechanic = await ctx.store.dispatch("mechanics/getById", id);
    }
    return { mechanic };
  }

  @Action("mechanics/save") saveMechanic!: (
    mechanic: Mechanic
  ) => Promise<AxiosResponse>;

  async save() {
    if (!(await this.mechanicForm.validate())) {
      return;
    }
    try {
      this.saving = true;
      let { data } = await this.saveMechanic(this.mechanic);
      this.mechanic.id = data.id;
      this.$notify({
        duration: 7000,
        type: "success",
        title: "Sucesso ao salvar a mecânica!",
        message: "Agora você já pode criar itens com essa mecânica",
      });
      this.$router.push({ params: { id: data.id } });
    } catch (e) {
      this.$notify.error({
        message: "Não foi possível salvar a mecânica",
        title: "Erro ao salvar mecânica",
      });
    } finally {
      this.saving = false;
    }
  }

  async createScoreFunctionTestCases() {
    await this.save();
    this.$router.push(
      "/platform/mechanics/scoreFunctionTestCases/" + this.mechanic.id
    );
  }

  back() {
    this.$router.go(-1);
  }

  mounted() {
    this.nameInput.focus();
  }
}
</script>
