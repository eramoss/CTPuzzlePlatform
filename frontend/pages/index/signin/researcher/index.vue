<template>
  <div>
    <container>
      <div class="panel register shadow">
        <div class="title">
          <h2>Registro de pesquisador</h2>
          <p>Informe seus dados para ter acesso à plataforma</p>
        </div>
        <el-form>
          <fieldset>
            <legend>Identificação</legend>
            <el-form-item label="Nome completo" label-width="140px">
              <el-input
                placeholder="Nome completo"
                v-model="user.name"
                autofocus
                title="Nome"
              ></el-input>
            </el-form-item>

            <el-form-item label="Data de nascimento">
              <el-row :gutter="10" type="flex">
                <el-col :span="6"
                  ><el-select v-model="day" placeholder="Dia"
                    ><el-option
                      v-for="day in days"
                      :value="day"
                      :key="day"
                    ></el-option></el-select
                ></el-col>
                <el-col :span="12">
                  <el-select v-model="month" class="fill" placeholder="Mês"
                    ><el-option
                      v-for="m in months"
                      :value="m.index"
                      :label="m.name"
                      :key="m.index"
                    ></el-option
                  ></el-select>
                </el-col>
                <el-col :span="6">
                  <el-select v-model="year" class="fill" placeholder="Ano"
                    ><el-option
                      v-for="year in years"
                      :value="year"
                      :key="year"
                    ></el-option
                  ></el-select>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="Gênero">
              <el-radio v-model="user.gender" label="M">Masculino</el-radio>
              <el-radio v-model="user.gender" label="F">Feminino</el-radio>
              <el-radio v-model="user.gender" label="O">Não informar</el-radio>
            </el-form-item>
          </fieldset>

          <!-- <fieldset>
            <legend>Formação</legend>
            <el-form-item>
              <el-select
                v-model="user.schooling"
                placeholder="Formação"
                class="fill"
                ><el-option
                  v-for="schooling in schoolings"
                  :value="schooling"
                  :key="schooling"
                ></el-option
              ></el-select>
            </el-form-item>
          </fieldset> -->
          <fieldset>
            <legend>Credenciais</legend>

            <el-form-item label="Email" label-width="50px">
              <el-input
                type="email"
                v-model="user.email"
                title="Email"
                placeholder="Email"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="Senha" label-width="50px">
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
            <el-button type="primary" @click="register">Registrar-se</el-button>
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

import { Provide } from "vue-property-decorator";
import { Action } from "vuex-class";

import Component from "vue-class-component";

class Month {
  index!: string;
  name!: string;
}

@Component
export default class UserSigninForm extends Vue {
  @Provide() user: User = new User();

  @Provide() schoolings: string[] = [
    "Básico",
    "Médio",
    "Superior incompleto",
    "Superior completo",
    "Pós-graduado(a)",
    "Mestre",
    "Doutor(a)",
  ];

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

  day: string = "";
  month: string = "";
  year: string = "";

  @Action("users/saveUser") saveUser!: (user: User) => Promise<AxiosResponse>;

  get birthDate() {
    return `${this.day}/${this.month}/${this.year}`;
  }

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
    try{
      await this.saveUser(this.user);
    }catch(e){
      console.log(e);
    }
    /* this.$router.push({
      name: "index-signin-confirm-code",
      params: { email: this.user.email },
    }); */
  }
}
</script>
