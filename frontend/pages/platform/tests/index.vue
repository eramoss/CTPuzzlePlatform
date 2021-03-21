<template>
  <div class="left">
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/platform' }"
        >Plataforma</el-breadcrumb-item
      >
      <el-breadcrumb-item>Testes</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="panel">
      <h2>Testes</h2>
      <el-button
        title="Criar novo teste escolhendo os itens para depois publicá-lo"
        type="primary"
        icon="el-icon-plus"
        @click="create"
        :loading="goingCreate"
      >
        Novo
      </el-button>
      <!-- <el-input v-model="pageRequest.search"></el-input> -->
      <el-table :data="pageResponse.data">
        <el-table-column prop="id" label="Código" width="100"></el-table-column>
        <el-table-column prop="name" label="Nome"></el-table-column>
        <el-table-column prop="name" label="Itens" width="100">
          <template slot-scope="{ row }">
            {{ row.items.length }}
          </template>
        </el-table-column>
        <el-table-column label="Aplicações" width="230">
          <template slot-scope="{ row }">
            <nuxt-link
              v-show="row.applications.length"
              :to="`/platform/test-applications?test=${row.id}`"
            >
              <el-button type="text" title="Abrir lista de aplicações">
                {{ row.applications.length }} aplicações
              </el-button>
            </nuxt-link>
            <nuxt-link
              :to="`/platform/test-applications?test=${row.id}&action=apply`"
              v-show="!row.applications.length"
            >
              <el-button type="text" title="Abrir lista de aplicações">
                <span>Aplicar </span>
              </el-button>
            </nuxt-link>
          </template>
        </el-table-column>
        <el-table-column label="Ações" width="240">
          <template slot-scope="{ row }">
            <btn-edit @click="edit(row)"> Editar </btn-edit>
            <btn-remove @click="remove(row)"> Remover </btn-remove>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <snack-bar-remove
      remove-action="tests/softDeleteById"
      restore-action="tests/restore"
      ref="snackBar"
      @onRestore="loadData"
    />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Watch, Component, Ref } from "nuxt-property-decorator";
import { PageRequest, PageResponse } from "@/types/pagination";
import Test from "~/types/Test";
import { Action } from "vuex-class";
import { Context } from "@nuxt/types";
import SnackBarRemove from "~/components/SnackBarRemove.vue";

@Component({
  components: {
    SnackBarRemove,
  },
  head() {
    return {
      title: "Testes",
    };
  },
})
export default class TestsList extends Vue {
  goingCreate = false;
  @Ref() snackBar!: SnackBarRemove;

  pageResponse: PageResponse<Test> = new PageResponse<Test>();
  pageRequest: PageRequest = new PageRequest();

  create() {
    this.goingCreate = true;
    this.$router.push("/platform/tests/new");
  }

  edit(row: Test) {
    this.$router.push("/platform/tests/" + row.id);
  }

  async remove(row: Test) {
    await this.snackBar.remove(row.id);
    this.loadData();
  }

  @Action("tests/paginate") paginate!: (
    pageRequest: PageRequest
  ) => Promise<PageResponse<Test>>;

  @Watch("pageRequest", { deep: true })
  async onChangePageRequest() {
    this.loadData();
  }

  async loadData() {
    this.pageResponse = await this.paginate(this.pageRequest);
  }

  async asyncData(ctx: Context) {
    let pageRequest = new PageRequest({
      researchGroup: ctx?.$auth?.user?.researchGroup,
    });
    let pageResponse: PageResponse<Test> = await ctx.store.dispatch(
      "tests/paginate",
      pageRequest
    );
    return { pageResponse, pageRequest };
  }
}
</script>
