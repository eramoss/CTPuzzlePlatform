<template>
  <div>
    <div class="left">
      <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/platform' }">
          Plataforma
        </el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/platform/users' }">
          Usuários
        </el-breadcrumb-item>
        <el-breadcrumb-item>Edição</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="panel">
        <h2>Edição de usuário</h2>
        <el-form
          :model="user"
          :rules="formRules"
          ref="userForm"
          label-width="120px"
        >
          <el-row>
            <el-col :span="20">
              <el-form-item label="Nome" prop="name">
                <el-input v-model="user.name" />
              </el-form-item>
              <el-form-item label="E-mail" prop="email">
                <el-input v-model="user.email" />
              </el-form-item>
              <el-form-item label="Dt. Nascimento" prop="birthDate">
                <date-input v-model="user.birthDate" />
              </el-form-item>
              <el-form-item label="Senha" prop="password">
                <el-input v-model="user.password" type="password" />
              </el-form-item>
              <el-form-item label="Gênero" label-width="160px">
                <el-radio v-model="user.gender" label="M">Masculino</el-radio>
                <el-radio v-model="user.gender" label="F">Feminino</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <btn-save @click="save" :loading="saving" />
              <btn-back @click="back"></btn-back>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component, Action, Ref } from "nuxt-property-decorator";
import User from "~/types/User";
import { Context } from "@nuxt/types";
import { ElForm } from "element-ui/types/form";

@Component
export default class UserForm extends Vue {
  user: User = new User();
  saving = false;

  @Ref() userForm!: ElForm;

  @Action("users/saveUser") saveUser!: (user: User) => Promise<any>;

  async asyncData(ctx: Context) {
    let user = new User();
    let id = ctx.params.id;
    if (id != "new") {
      user = (await ctx.store.dispatch("users/getById", id)) as User;
    }
    return {
      user,
    };
  }

  async save() {
    if (!(await this.userForm.validate())) {
      return;
    }
    try {
      this.saving = true;
      let { data } = await this.saveUser(this.user);
      this.user.id = data.id;
      this.$notify({
        duration: 7000,
        type: "success",
        title: "Sucesso ao salvar o usuário!",
        message: "Agora você já pode criar itens com esso usuário",
      });
      this.$router.push({ params: { id: data.id } });
    } catch (e) {
      this.$notify.error({
        message: "Não foi possível salvar o usuário",
        title: "Erro ao salvar usuário",
      });
    } finally {
      this.saving = false;
    }
  }

  back() {
    this.$router.go(-1);
  }

  get formRules() {
    return {
      name: {
        required: true,
        message: "Informe o nome",
        trigger: ["change", "blur"],
      },
      birthDate: [
        {
          required: true,
          message: "Informe a data de nascimetno",
          trigger: ["blur", "change"],
        },
      ],
      password: [
        {
          required: true,
          message: "Informe a senha",
          trigger: ["blur", "change"],
        },
      ],
      email: [
        {
          required: true,
          message: "Informe o email",
          trigger: ["blur", "change"],
        },
        {
          type: "email",
          message: "Informe um email correto",
          trigger: ["blur", "change"],
        },
      ],
    };
  }
}
</script>