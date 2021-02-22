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

            <el-form-item label="Data de nascimento" label-width="160px">
              <el-row :gutter="10" type="flex">
                <el-col :span="6">
                  <el-form-item prop="birthDay">
                    <selector
                      class="fill"
                      @change="form.clearValidate('birthDay')"
                      v-model="user.birthDay"
                      placeholder="Dia"
                    >
                      <option v-for="day in days" :value="day" :key="day">
                        {{ day }}
                      </option>
                    </selector>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="birthMonth">
                    <selector
                      @change="form.clearValidate('birthMonth')"
                      v-model="user.birthMonth"
                      class="fill"
                      placeholder="Mês"
                    >
                      <option
                        v-for="m in months"
                        :value="m.index"
                        :label="m.name"
                        :key="m.index"
                      >
                        {{ m.name }}
                      </option>
                    </selector>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item prop="birthYear">
                    <selector
                      @change="form.clearValidate('birthYear')"
                      v-model="user.birthYear"
                      class="fill"
                      placeholder="Ano"
                    >
                      <option v-for="year in years" :value="year" :key="year">
                        {{ year }}
                      </option>
                    </selector>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="Gênero" label-width="160px">
              <el-radio v-model="user.gender" label="M">Masculino</el-radio>
              <el-radio v-model="user.gender" label="F">Feminino</el-radio>
              <el-radio v-model="user.gender" label="O">Outro</el-radio>
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
            <el-button type="primary" :loading="saving" @click="register"
              >Registrar-se</el-button
            >
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

import { Provide, Ref } from "vue-property-decorator";
import { Action } from "vuex-class";

import Component from "vue-class-component";
import { ElForm } from "element-ui/types/form";

class Month {
  index!: string;
  name!: string;
}

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
      name: [{ required: true, message: "Informe o nome", trigger: "blur" }],
      email: [{ required: true, message: "Informe o email", trigger: "blur" }],
      birthDay: [
        {
          required: true,
          message: "Informe o dia de nascimento",
          trigger: "change",
        },
      ],
      birthMonth: [
        {
          required: true,
          message: "Informe o mês de nascimento",
          trigger: "change",
        },
      ],
      birthYear: [
        {
          required: true,
          message: "Informe o ano de nascimento",
          trigger: "change",
        },
      ],
      password: [
        { required: true, message: "Informe a senha", trigger: "blur" },
      ],
    };
  }

  @Provide() months: Month[] = [
    { index: "01", name: "Janeiro" },
    { index: "02", name: "Fevereiro" },
    { index: "03", name: "Março" },
    { index: "04", name: "Abril" },
    { index: "05", name: "Maio" },
    { index: "06", name: "Junho" },
    { index: "07", name: "Julho" },
    { index: "08", name: "Agosto" },
    { index: "09", name: "Setembro" },
    { index: "10", name: "Outubro" },
    { index: "11", name: "Novembro" },
    { index: "12", name: "Dezembro" },
  ];

  @Action("users/saveUser") saveUser!: (user: User) => Promise<AxiosResponse>;

  get days() {
    let days = [];
    for (let i = 1; i <= 31; i++) {
      let day = i + "";
      if (i < 10) {
        day = "0" + i;
      }
      days.push(day);
    }
    return days;
  }

  get years() {
    let years = [];
    let lastYear = new Date().getFullYear() - 10;
    for (let x = 1970; x <= lastYear; x++) {
      years.push(x);
    }
    return years;
  }

  async register() {
    let formValid = await this.form.validate();
    if (formValid) {
      this.saving = true;
      try {
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
