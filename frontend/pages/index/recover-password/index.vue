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
              v-model="password"
              autofocus
              type="password"
              title="Senha"
            ></el-input>
          </el-form-item>

          <el-form-item label="Confirme a nova senha" required>
            <el-input
              @keydown.enter.native="confirm"
              placeholder="*********"
              v-model="confirmation"
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
<script lang="ts">
import Vue from "vue";
import { Ref } from "vue-property-decorator";
import Component from "vue-class-component";
import { ElInput } from "element-ui/types/input";
import { Action } from "vuex-class";

@Component({
  auth: false,
  head() {
    title: "Recupearação de senha";
  },
})
export default class RecoverPasswordPage extends Vue {
  @Ref("password") passwordInput!: ElInput;
  loading: boolean = false;
  password: string = "";
  hash: string = "";
  confirmation: string = "";

  async confirm() {
    if (this.password != this.confirmation) {
      this.$alert(
        "As duas senhas devem ser iguais",
        "As senhas estão diferentes",
        { type: "error" }
      );
      return;
    }

    if (!this.password.length) {
      this.$alert(
        "Informe um valor para as senhas",
        "É obrigatório informar um valor para a senha",
        { type: "error" }
      );
      return;
    }

    this.loading = true;
    try {
      await this.updatePassword({
        hash: this.hash,
        newPassword: this.password,
      });

      this.$router.push({ path: "/login" });
      this.$notify({
        type: "success",
        title: "Entre com a nova senha!",
        message: "Agora você já pode acessar a plataforma usando a nova senha",
      });
    } catch (e) {
    } finally {
      this.loading = false;
    }
  }

  @Action("users/validateRecoveryLink") validateRecoveryLink!: (
    hash: string
  ) => Promise<boolean>;

  @Action("users/updatePassword") updatePassword!: (updatePasswordInfo: {
    hash: string;
    newPassword: string;
  }) => Promise<any>;

  async mounted() {
    this.hash = this.$route.query.hash;
    let valid = await this.validateRecoveryLink(this.hash);
    if (!valid) {
      await this.$alert(
        "Esse link já foi utilizado ou é inválido",
        "Link expirado ou inválido",
        {
          type: "error",
        }
      );
      this.$router.push("/");
    }
    this.passwordInput.focus();
  }
}
</script>
