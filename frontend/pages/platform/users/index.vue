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
    <snack-bar-remove
      remove-action="users/softDeleteById"
      restore-action="users/restore"
      ref="snackBar"
      @onRestore="loadData"
    />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Watch, Component, Ref } from "nuxt-property-decorator";
import { PageRequest, PageResponse } from "@/types/pagination";
import User from "~/types/User";
import { Action } from "vuex-class";
import { Context } from "@nuxt/types";
import RoleChecker from "~/utils/RoleChecker";
import SnackBarRemove from "~/components/SnackBarRemove.vue";

@Component({
  components: {
    SnackBarRemove,
  },
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
  @Ref() snackBar!: SnackBarRemove;

  create() {
    this.openingForm = true;
    this.$router.push("/platform/users/new");
  }

  edit(row: User) {
    this.$router.push("/platform/users/" + row.id);
  }

  async remove(row: User) {
    this.snackBar.text = `Desfazer a exclusão do usuário ${row.name}?`;
    await this.snackBar.remove(row.id);
    this.loadData();
  }

  @Action("users/paginate") paginate!: (
    pageRequest: PageRequest
  ) => Promise<PageResponse<User>>;

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
