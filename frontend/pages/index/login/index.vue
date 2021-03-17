<template>
  <div>
    <container>
      <div
        class="panel register shadow"
        v-loading="loading"
        :element-loading-text="loadingText"
      >
        <div class="title">
          <h2>Acessar CT Puzzle Platform</h2>
        </div>
        <el-form :model="user" :rules="rules" ref="form">
          <el-form-item label="Email" required prop="username">
            <el-input
              ref="inputEmail"
              placeholder="Email"
              autofocus
              v-model="user.username"
              title="Nome"
              @keydown.enter.native="login(user)"
            ></el-input>
          </el-form-item>

          <el-form-item label="Senha" required prop="password">
            <el-input
              @keydown.enter.native="login(user)"
              placeholder="********"
              v-model="user.password"
              autofocus
              type="password"
              title="Senha"
            ></el-input>
          </el-form-item>

          <div class="flex-end">
            <el-button type="primary" class="fill" @click="login(user)">
              Entrar
            </el-button>
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
import { ElForm } from "element-ui/types/form";
import { ElInput } from "element-ui/types/input";
import Vue from "vue";
import Component from "vue-class-component";
import { Ref } from "vue-property-decorator";
import { Action } from "vuex-class";

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
  @Ref("form") form!: ElForm;

  get rules() {
    return {
      username: [
        { required: true, message: "Informe o email", trigger: "blur" },
      ],
      password: [
        { required: true, message: "Informe a senha", trigger: "blur" },
      ],
    };
  }

  async login(usernamePassword?: UsernamePassword, validate: boolean = true) {
    if (validate) {
      if (!(await this.form.validate())) {
        return;
      }
    }
    this.loading = true;
    this.loadingText = "Validando credenciais...";
    try {
      let response = await this.$auth.loginWith("local", {
        data: usernamePassword,
      });
      sessionStorage.clear();
      this.$router.push("/platform?op=login");
      console.log(response);
    } catch (err) {
      console.error(err);
      this.$alert(
        "Os dados informados estão incorretos",
        "Verifique suas credenciais",
        { type: "error" }
      );
    } finally {
      this.loading = false;
    }
  }

  @Action("users/sendPasswordRecoveryLink") sendPasswordRecoveryLink!: (
    email: string
  ) => Promise<any>;

  async recoverPassword() {
    this.loading = true;
    this.loadingText = "Enviando link de recuperação...";
    try {
      await this.sendPasswordRecoveryLink(this.user.username);
      this.$alert(
        "Enviamos um link de recuperação de senha para o seu email",
        "Verifique seu email",
        {
          type: "success",
        }
      );
    } catch (err) {
      console.error(err);
      this.$alert(
        "Informe um email no campo para recuperar",
        "Informe um email correto",
        {
          type: "error",
        }
      );
    } finally {
      this.loading = false;
    }
  }

  mounted() {
    this.inputEmail.focus();
    if (this.$route.query.authorized == "true") {
      this.login(
        {
          username: sessionStorage.getItem("user_email") || "",
          password: sessionStorage.getItem("user_pass") || "",
        },
        false
      );
    }
  }
}
</script>
