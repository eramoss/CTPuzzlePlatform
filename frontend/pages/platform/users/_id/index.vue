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
          <fieldset>
            <legend>Identificação</legend>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Nome" prop="name">
                  <el-input v-model="user.name" ref="firstInput" />
                </el-form-item>
                <el-form-item label="Dt. Nascimento" prop="birthDate">
                  <date-input v-model="user.birthDate" />
                </el-form-item>
                <el-form-item label="Gênero">
                  <el-radio v-model="user.gender" label="M">Masculino</el-radio>
                  <el-radio v-model="user.gender" label="F">Feminino</el-radio>
                </el-form-item>
              </el-col>
            </el-row>
          </fieldset>
          <fieldset>
            <legend>Credenciais</legend>
            <el-row>
              <el-col :span="12">
                <el-form-item label="E-mail" prop="email">
                  <el-input v-model="user.email" />
                </el-form-item>
                <el-form-item label="Senha" prop="password">
                  <el-input v-model="user.password" type="password" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Autorizações">
                  <el-select
                    v-model="user.roles"
                    multiple
                    placeholder="Selecione"
                  >
                    <el-option
                      v-for="item in roles"
                      :key="item"
                      :label="label(item)"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </fieldset>
          <fieldset>
            <legend>Dados</legend>
            <el-row>
              <el-col>
                <el-form-item label="">
                  <el-table size="small" :data="userData">
                    <el-table-column
                      label="Propriedade"
                      prop="key"
                      width="200"
                    ></el-table-column>
                    <el-table-column label="Valor" prop="data">
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-col>
            </el-row>
          </fieldset>
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
import User, { getLabel, UserRole, userRoles } from "~/types/User";
import { Context } from "@nuxt/types";
import { ElForm } from "element-ui/types/form";
import { ElInput } from "element-ui/types/input";

@Component
export default class UserForm extends Vue {
  user: User = new User();
  saving = false;
  @Ref() firstInput!: ElInput;

  @Ref() userForm!: ElForm;

  @Action("users/saveUser") saveUser!: (user: User) => Promise<any>;

  get userData(): Object[] {
    let userData: Array<{}> = [];
    if (this.user) {
      Object.keys(this.user.data).forEach((key: string) => {
        userData.push({ key: key, data: this.user.data[key] });
      });
    }
    return userData;
  }

  label(key: UserRole) {
    return getLabel(key);
  }

  get roles() {
    return userRoles.filter((it) => it != UserRole.SYSADMIN);
  }

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
        message: "Os dados do usuário foram salvos no banco de dados",
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
    this.$router.push("/platform/users");
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

  mounted() {
    this.firstInput.focus();
  }
}
</script>