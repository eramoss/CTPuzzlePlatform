<template>
  <div>
    <container v-loading="loading" :element-loading-text="loadingText">
      <div class="panel register shadow">
        <div class="title">
          <h2>Confirme o código</h2>
          <p v-show="!!email">
            Enviamos um email com o código para {{ email }}
          </p>
        </div>
        <div>
          <el-alert
            type="error"
            class="error-message"
            style="margin-bottom: 10px"
            v-show="isCodeInvalid"
            :closable="false"
            :center="true"
          >
            <p>O código informado é inválido</p>
          </el-alert>
        </div>
        <div>
          <input
            v-model="confirmCode"
            ref="confirmCodeInput"
            :maxlength="codeMaxLength"
            class="confirm-code-input"
            :class="{ invalid: isCodeInvalid }"
            size="large"
            placeholder="_ _ _ _ _"
          />
        </div>
        <el-row class="flex-end" style="margin-top: 20px">
          <el-button type="text" @click="resendCode"
            >Reenviar código de confirmação</el-button
          >
          <el-button type="primary"> Confirmar código </el-button>
        </el-row>
      </div>
    </container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      codeMaxLength: 5,
      confirmCode: "",
      email: "",
      loading: false,
      loadingText: null,
      isCodeInvalid: false,
    };
  },
  created() {
    this.email = this.$route.params.email;
  },
  mounted() {
    this.$refs.confirmCodeInput.focus();
  },
  methods: {
    resendCode() {
      this.loading = true;
      this.loadingText = "Reenviando código de confirmação...";
      setTimeout(() => {
        this.loading = false;
        this.$notify({
          type: "success",
          title: "Email enviado",
          message: "Digite o código enviado para sua caixa de email",
        });
      }, 5000);
    },
    validateCode() {
      this.loading = true;
      this.loadingText = "Validando código de confirmação...";
      setTimeout(() => {
        this.loading = false;
        this.isCodeInvalid = true;
        this.$refs.confirmCodeInput.select();
      }, 5000);
    },
  },
  watch: {
    confirmCode(val) {
      this.isCodeInvalid = false;
      if (val) {
        if (val.length === this.codeMaxLength) {
          this.validateCode();
        }
      }
    },
  },
  mounted() {
    this.confirmCode = this.$route.query.code;
  },
};
</script>
<style lang="scss">
.confirm-code-input {
  padding: 20px !important;
  font-size: 30pt;
  width: 100%;
  text-align: center;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  border: 1px solid #409eff;
  border-radius: 4px;
}
.confirm-code-input.invalid {
  border: 1px solid #ff3737;
  background: rgba(255, 142, 142, 0.4);
}
.confirm-code-input::placeholder {
  color: #bbb;
}
.error-message p {
  font-size: 15pt;
  margin-bottom: 10px;
}
</style>
