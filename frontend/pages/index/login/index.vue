<template>
  <div>
    <container>
      <div
        class="panel register shadow"
        v-loading="loading"
        :element-loading-text="loadingText"
      >
        <div class="title">
          <h2>Login</h2>
        </div>
        <el-form>
          <el-form-item label="Email" required>
            <el-input
              ref="inputEmail"
              placeholder="Email"
              autofocus
              v-model="user.email"
              title="Nome"
            ></el-input>
          </el-form-item>

          <el-form-item label="Senha" required>
            <el-input
              @keydown.enter.native="login"
              placeholder="********"
              v-model="user.password"
              autofocus
              type="password"
              title="Senha"
            ></el-input>
          </el-form-item>

          <div class="flex-end">
            <el-button type="primary" class="fill" @click="login"
              >Entrar</el-button
            >
          </div>
          <div>
            <el-button type="text" @click="recoverPassword">
              Esqueci minha senha
            </el-button>
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
      loading: false,
      loadingText: null,
      user: {
        email: "Cassiano",
        password: "Viana",
      },
    };
  },
  methods: {
    login() {
      this.loading = true;
      this.loadingText = 'Validando credenciais...';
      setTimeout(() => {
        this.loading = false;
      }, 3000);
    },
    recoverPassword() {
      this.loading = true;
      this.loadingText = "Enviando link de recuperação...";
      setTimeout(() => {
        this.loading = false;
        this.$alert(
          "Enviamos um link de recuperação de senha para o seu email",
          "Verifique seu email",
          {
            type: "success",
          }
        );
      }, 3000);
    },
  },
  mounted() {
    this.$refs.inputEmail.focus();
  },
};
</script>
