<template>
  <div>
    <container>
      <div
        class="panel register shadow"
        v-loading="loading"
        element-loading-text="Salvando senha..."
      >
        <div class="title">
          <h2>Recuperar senha</h2>
          <p>Informe a nova senha</p>
        </div>
        <el-form>
          <el-form-item label="Nova senha" required>
            <el-input
              ref="password"
              placeholder="*********"
              v-model="user.password"
              autofocus
              type="password"
              title="Senha"
            ></el-input>
          </el-form-item>

          <el-form-item label="Confirme a nova senha" required>
            <el-input
              @keydown.enter.native="confirm"
              placeholder="*********"
              v-model="user.confirmation"
              autofocus
              type="password"
              title="Confirmação da senha"
            ></el-input>
          </el-form-item>

          <div class="flex-end">
            <el-button type="primary" class="fill" @click="confirm">
              Salvar nova senha
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
      user: {
        passowrd: null,
        confirmation: null,
      },
    };
  },
  methods: {
    confirm() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.$router.push({ path: "/login" });
        this.$notify({
          type: "success",
          title: "Entre com a nova senha!",
          message:
            "Agora você já pode acessar a plataforma usando a nova senha",
        });
      }, 3000);
    },
    recoverPassword() {
      this.$router.push({});
    },
  },
  mounted() {
    this.$refs.password.focus();
  },
};
</script>
