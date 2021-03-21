<template>
  <div>
    <container>
      <div class="panel register shadow">
        <div class="title">
          <h2>Registro de pesquisador</h2>
          <p>Informe seus dados para ter acesso à plataforma</p>
        </div>
        <el-form ref="form" :model="user" :rules="formRules">
          <fieldset>
            <legend>Identificação</legend>
            <el-form-item label="Nome completo" label-width="160px" prop="name">
              <el-input
                placeholder="Nome completo"
                v-model="user.name"
                autofocus
                title="Nome"
              ></el-input>
            </el-form-item>

            <el-form-item
              label="Data de nascimento"
              label-width="160px"
              prop="birthDate"
            >
              <date-input v-model="user.birthDate"></date-input>
            </el-form-item>
            <el-form-item label="Gênero" label-width="160px">
              <el-radio v-model="user.gender" label="M">Masculino</el-radio>
              <el-radio v-model="user.gender" label="F">Feminino</el-radio>
            </el-form-item>
          </fieldset>

          <!-- <fieldset>
            <legend>Formação</legend>
            <el-form-item>
              <select
                v-model="user.schooling"
                placeholder="Formação"
                class="fill"
                ><option
                  v-for="schooling in schoolings"
                  :value="schooling"
                  :key="schooling"
                >{{value}}</option
              ></select>
            </el-form-item>
          </fieldset> -->
          <fieldset>
            <legend>Credenciais</legend>

            <el-form-item label="Email" label-width="100px" prop="email">
              <el-input
                type="email"
                v-model="user.email"
                title="Email"
                placeholder="Email"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="Senha" label-width="100px" prop="password">
              <el-input
                type="password"
                v-model="user.password"
                placeholder="*******"
                title="Senha"
              >
              </el-input>
            </el-form-item>
          </fieldset>

          <div class="flex-end">
            <el-button type="primary" :loading="saving" @click="register">
              Registrar-se
            </el-button>
          </div>
        </el-form>
      </div>
    </container>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import User from "~/types/User";
import { AxiosResponse } from "axios";

import { Ref, Action, Component } from "nuxt-property-decorator";
import { ElForm } from "element-ui/types/form";

@Component({
  auth: false,
})
export default class UserSigninForm extends Vue {
  @Ref() form!: ElForm;

  user: User = new User();
  schoolings: string[] = [
    "Básico",
    "Médio",
    "Superior incompleto",
    "Superior completo",
    "Pós-graduado(a)",
    "Mestre",
    "Doutor(a)",
  ];

  saving: boolean = false;

  get formRules() {
    return {
      name: [
        {
          required: true,
          message: "Informe o nome",
          trigger: ["blur", "change"],
        },
      ],
      birthDate: [
        {
          required: true,
          message: "Informe a data de nascimetno",
          trigger: ["blur", "change"],
        },
      ],
      email: [
        {
          required: true,
          message: "Informe o email",
          trigger: ["blur", "change"],
        },
        {
          type: "email",
          message: "Informe um email correto",
          trigger: ["blur", "change"],
        },
      ],

      password: [
        { required: true, message: "Informe a senha", trigger: "blur" },
      ],
    };
  }

  @Action("users/saveUser") saveUser!: (user: User) => Promise<AxiosResponse>;

  async register() {
    let formValid = await this.form.validate();
    if (formValid) {
      this.saving = true;
      try {
        sessionStorage.setItem("user_email", this.user.email);
        sessionStorage.setItem("user_pass", this.user.password);
        await this.saveUser(this.user);
        this.$router.push({
          name: "index-signin-confirm-code",
          query: { email: this.user.email },
        });
        this.$notify({
          type: "success",
          message: "Verifique seu email para confirmar o código",
          title: "Sucesso ao cadastrar usuário",
        });
      } catch (e) {
        this.$notify({
          type: "error",
          message:
            "Verifique se os dados estão corretos ou se já existe uma conta com esse email",
          title: "Não foi possível realizar o cadastro",
        });
      } finally {
        this.saving = false;
      }
    }
  }
}
</script>
