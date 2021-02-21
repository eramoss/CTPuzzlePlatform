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
      <h2>Edição de mecânica</h2>
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
              A criação da mecânica é a especificação do formato de configuração
              dos puzzles. Essa especificação deve ser feita por meio de uma
              classe, na linguagem TypeScript.
            </MessageAlert>

            <el-form-item prop="classDefinition">
              <FormItemLabel
                label="Especificação da mecânica"
                :required="true"
              />
              <code-editor
                v-model="mechanic.classDefinition"
                @input="mechanicForm.validateField('classDefinition')"
                height="300px"
              />
            </el-form-item>
            <el-form-item prop="responseClassDefinition">
              <FormItemLabel
                label="Especificação da resposta"
                :required="true"
              />
              <code-editor
                @input="mechanicForm.validateField('responseClassDefinition')"
                v-model="mechanic.responseClassDefinition"
                height="200px"
              />
            </el-form-item>
            <el-form-item prop="scoreFunction">
              <FormItemLabel label="Cálculo do escore" :required="true" />
              <code-editor
                v-model="mechanic.scoreFunction"
                @input="mechanicForm.validateField('scoreFunction')"
                height="300px"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <btn-save
              @click="save"
              :loading="saving"
              />
            <btn-back @click="back"></btn-back>
          </el-col>
        </el-row>
      </el-form>
    </div>
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
import User from "~/types/User";

@Component({
  components: { CodeEditor },
})
export default class MechanicEditForm extends Vue {
  saving: boolean = false;
  mechanic!: Mechanic;
  @Ref("mechanicForm") mechanicForm!: ElForm;
  @Ref("nameInput") nameInput!: ElInput;

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

  async asyncData(ctx: Context) {
    let mechanic;
    let id = ctx.params.id;
    if (id == "new") {
      let user = { id: ctx.$auth.user?.id } as User;
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
      this.$router.replace({ params: { id: data.id } });
      this.back();
    } catch (e) {
      this.$notify.error({
        message: "Não foi possível salvar a mecânica",
        title: "Erro ao salvar mecânica",
      });
    } finally {
      this.saving = false;
    }
  }

  back() {
    this.$router.go(-1);
  }

  mounted() {
    this.nameInput.focus();
  }
}
</script>
