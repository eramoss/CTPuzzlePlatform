<template>
  <div class="left">
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/platform' }"
        >Plataforma</el-breadcrumb-item
      >
      <el-breadcrumb-item>Usuários</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="panel">
      <h2>Usuários ({{ pageResponse.data.length }})</h2>
      <el-button
        title="Abre o cadastro do usuário"
        type="primary"
        icon="el-icon-plus"
        @click="create"
        :loading="openingForm"
      >
        Novo usuário
      </el-button>
      <filters-box>
        <filters-box-item label="Pesquisa">
          <el-input
            placeholder="Pesquisar"
            v-model="pageRequest.search"
            class="fill"
          ></el-input>
        </filters-box-item>
      </filters-box>

      <el-table :data="pageResponse.data">
        <el-table-column prop="id" label="Código" width="100"></el-table-column>
        <el-table-column prop="name" label="Nome"></el-table-column>
        <el-table-column label="Ações" width="240">
          <template slot-scope="{ row }">
            <btn-edit @click="edit(row)"> Editar </btn-edit>
            <btn-remove @click="remove(row)"> Remover </btn-remove>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Watch, Component } from "nuxt-property-decorator";
import { PageRequest, PageResponse } from "@/types/pagination";
import User from "~/types/User";
import { AxiosResponse } from "axios";
import { Action } from "vuex-class";
import { Context } from "@nuxt/types";
import RoleChecker from "~/utils/RoleChecker";

@Component({
  head() {
    return {
      title: "Usuários",
    };
  },
})
export default class UsersList extends Vue {
  openingForm: boolean = false;
  pageResponse: PageResponse<User> = new PageResponse<User>();
  pageRequest: PageRequest = new PageRequest();

  create() {
    this.openingForm = true;
    this.$router.push("/platform/users/new");
  }

  edit(row: User) {
    this.$router.push("/platform/users/" + row.id);
  }

  async remove(row: User) {
    try {
      let option = await this.$confirm(
        "Tem certeza de que deseja remover o usuário? A segunte mecânica será removido: " +
          row.name,
        "Remover usuário?",
        {
          confirmButtonText: "Remover",
          cancelButtonText: "Cancelar",
          confirmButtonClass: "el-button--danger",
        }
      );
      if (option === "confirm") {
        try {
          await this.removeById(row.id);
          this.$notify({
            type: "success",
            title: "Sucesso ao remover",
            message: "O usuário foi removido",
          });
          await this.loadData();
        } catch (e) {
          console.error(e);
          this.$notify({
            type: "error",
            title: "Erro ao remover",
            message: "O usuário não foi removido",
          });
        }
      }
    } catch (cancel) {}
  }

  @Action("users/paginate") paginate!: (
    pageRequest: PageRequest
  ) => Promise<PageResponse<User>>;

  @Action("users/removeById") removeById!: (
    id: number
  ) => Promise<AxiosResponse>;

  @Watch("pageRequest", { deep: true })
  async onChangePageRequest() {
    this.loadData();
  }

  async loadData() {
    this.pageResponse = await this.paginate(this.pageRequest);
  }

  async asyncData(ctx: Context) {
    const user = Object.assign(new User(), ctx.$auth.user);
    const researchGroup = user.researchGroup;
    const roleChecker = new RoleChecker();
    const pageRequest = new PageRequest({ researchGroup });
    if (roleChecker.userHasSomeOfThisRoles(user, ["admin"])) {
      pageRequest.filter.researchGroup = { id: researchGroup.id };
    }
    const pageResponse: PageResponse<User> = await ctx.store.dispatch(
      "users/paginate",
      pageRequest
    );
    return { pageResponse, pageRequest, roleChecker };
  }
}
</script>
