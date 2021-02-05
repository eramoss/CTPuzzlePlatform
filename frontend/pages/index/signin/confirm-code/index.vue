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
            v-show="!isCodeValid"
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
            :class="{ invalid: !isCodeValid && isCodeRequired }"
            size="large"
            placeholder="_ _ _ _ _"
          />
        </div>
        <el-row class="flex-end" style="margin-top: 20px">
          <!-- <el-button type="text" @click="resendCode"
            >Reenviar código de confirmação</el-button
          > -->
          <el-button type="primary"> Confirmar código </el-button>
        </el-row>
      </div>
    </container>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Action } from "vuex-class";
import { Watch, Ref, Component } from "vue-property-decorator";
import { ElInput } from "element-ui/types/input";
import { AxiosResponse } from "axios";

@Component
export default class ConfirmCodeForm extends Vue {
  codeMaxLength: number = 5;
  confirmCode: string = "";
  email: string = "";
  loading: boolean = false;
  loadingText: string = "";
  isCodeValid: boolean = true;
  isCodeRequired: boolean = false;

  @Ref("confirmCodeInput") confirmCodeInput!: ElInput;

  @Action("users/validateConfirmationCode") validateConfirmationCode!: ({
    email: string,
    code: string,
    is,
  }) => Promise<AxiosResponse>;

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
  }

  async callValidateCode() {
    this.loading = true;
    this.loadingText = "Validando código de confirmação...";
    try {
      let response = await this.validateConfirmationCode({
        email: this.email,
        code: this.confirmCode,
      });
      this.isCodeRequired = true;
      this.isCodeValid = response.data as boolean;
      if (!this.isCodeValid) {
        this.$refs.confirmCodeInput.select();
      }
      if (this.isCodeValid) {
        this.$router.push("/platform");
        this.$notify({
          type: "success",
          title: "Bem-vindo",
          message:
            "Você já pode começar a criar seus testes de Pensamento Computacional",
        });
      }
    } catch (e: Error) {
      console.error(e);
      this.isCodeRequired = false;
    } finally {
      this.loading = false;
    }
  }

  mounted() {
    this.email = this.$route.query.email;
    this.confirmCode = this.$route.query.code;
    this.$refs.confirmCodeInput.focus();
  }

  @Watch("confirmCode")
  async onChange(confirmCode: string) {
    this.isCodeValid = false;
    if (confirmCode) {
      if (confirmCode.length === this.codeMaxLength) {
        await this.callValidateCode();
      }
    }
  }
}
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
