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
            <el-form-item>
              <el-row :gutter="15">
                <el-col :span="8">
                  <el-input
                    placeholder="Nome completo"
                    v-model="user.name"
                    autofocus
                    title="Nome"
                  ></el-input>
                </el-col>
                <el-col :span="16">
                  <el-input
                    placeholder="Sobrenome"
                    title="Sobrenome"
                    v-model="user.surname"
                  >
                  </el-input>
                </el-col>
              </el-row>
            </el-form-item>

            <!-- <el-form-item label="Gênero">
              <el-radio v-model="user.gender" label="M">Masculino</el-radio>
              <el-radio v-model="user.gender" label="F">Feminino</el-radio>
              <el-radio v-model="user.gender" label="O">Outro</el-radio>
            </el-form-item> -->

            <!-- <el-form-item label="Nascimento">
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
            </el-form-item> -->
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

            <el-form-item>
              <el-input
                type="email"
                v-model="user.email"
                title="Email"
                placeholder="Email"
              >
              </el-input>
            </el-form-item>
            <el-form-item>
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
<script>
export default {
  data() {
    return {
      user: {
        name: "Cassiano",
        surname: "Viana",
      },
      day: null,
      month: null,
      year: null,
      schoolings: [
        "Básico",
        "Médio",
        "Superior incompleto",
        "Superior completo",
        "Pós-graduado(a)",
        "Mestre",
        "Doutor(a)",
      ],
      months: [
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
      ],
      days: (() => {
        let days = [];
        for (let i = 1; i <= 31; i++) {
          let day = i;
          if (i < 10) {
            day = "0" + i;
          }
          days.push(day);
        }
        return days;
      })(),
      years: (() => {
        let years = [];
        let lastYear = new Date().getFullYear() - 10;
        for (let x = 1970; x <= lastYear; x++) {
          years.push(x);
        }
        return years;
      })(),
    };
  },
  computed: {
    birthDate() {
      return `${this.day}/${this.month}/${this.year}`;
    },
  },
  methods: {
    register() {
      this.$router.push({ name: "index-signin-confirm-code", params: { email: this.user.email } });
    },
  },
};
</script>
