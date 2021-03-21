<template>
  <div class="left">
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/platform' }"
        >Plataforma</el-breadcrumb-item
      >
      <el-breadcrumb-item>Mecânicas</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="panel">
      <h2>Mecânicas</h2>
      <el-button
        title="Abre o cadastro de uma nova mecânica para um jogo (puzzle) de Pensamento Computacional"
        type="primary"
        icon="el-icon-plus"
        @click="create"
        :loading="goingCreate"
      >
        Nova mecânica de puzzle
      </el-button>
      <!-- <el-input v-model="pageRequest.search"></el-input> -->
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
      remove-action="mechanics/softDeleteById"
      restore-action="mechanics/restore"
      ref="snackBar"
      @onRestore="loadData"
    >
    </snack-bar-remove>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Watch, Component, Ref } from "nuxt-property-decorator";
import { PageRequest, PageResponse } from "@/types/pagination";
import Mechanic from "~/types/Mechanic";
import { AxiosResponse } from "axios";
import { Action } from "vuex-class";
import { Context } from "@nuxt/types";
import SnackBarRemove from "~/components/SnackBarRemove.vue";

@Component({
  components: {
    SnackBarRemove,
  },
  head() {
    return {
      title: "Mecânicas",
    };
  },
})
export default class MechanicsList extends Vue {
  goingCreate: boolean = false;
  pageResponse: PageResponse<Mechanic> = new PageResponse<Mechanic>();
  pageRequest: PageRequest = new PageRequest();
  @Ref() snackBar!: SnackBarRemove;

  @Action("mechanics/paginate") paginate!: (
    pageRequest: PageRequest
  ) => Promise<PageResponse<Mechanic>>;

  create() {
    this.goingCreate = true;
    this.$router.push("/platform/mechanics/new");
  }

  edit(row: Mechanic) {
    this.$router.push("/platform/mechanics/" + row.id);
  }

  async remove(row: Mechanic) {
    await this.snackBar.remove(row.id);
    this.loadData();
  }

  async loadData() {
    this.pageResponse = await this.paginate(this.pageRequest);
  }

  async asyncData(ctx: Context) {
    let researchGroup = ctx.$auth.user?.researchGroup;
    let filter = {};
    if (ctx.$auth.user?.researchGroup) {
      filter = { researchGroup };
    }
    let pageRequest = new PageRequest(filter);
    let pageResponse: PageResponse<Mechanic> = await ctx.store.dispatch(
      "mechanics/paginate",
      pageRequest
    );
    return { pageResponse, pageRequest };
  }

  @Watch("pageRequest", { deep: true })
  async onChangePageRequest() {
    this.loadData();
  }
}
</script>
