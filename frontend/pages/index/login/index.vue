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
              v-model="user.username"
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
<script lang="ts">
import { ElInput } from "element-ui/types/input";
import Vue from "vue";
import Component from "vue-class-component";
import { Ref } from "vue-property-decorator";

class UsernamePassword {
  username!: string;
  password!: string;
}

@Component({
  head() {
    return {
      title: "CT Puzzle Platform | Entrar",
    };
  },
})
export default class LoginPage extends Vue {
  loading: boolean = false;
  loadingText: string = "";
  user: UsernamePassword = new UsernamePassword();
  @Ref("inputEmail") inputEmail!: ElInput;

  async login() {
    this.loading = true;
    this.loadingText = "Validando credenciais...";
    try {
      let response = await this.$auth.loginWith("local", { data: this.user });
      this.$router.push('/platform');
      console.log(response);
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }



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
  }

  mounted() {
    this.inputEmail.focus();
  }
}
</script>
