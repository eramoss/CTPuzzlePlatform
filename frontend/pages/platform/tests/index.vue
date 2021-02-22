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
        <el-table-column label="Status" width="100">
          <template slot-scope="{ row }">
            {{ row.status }}
          </template>
        </el-table-column>
        <el-table-column label="Ações" width="330">
          <template slot-scope="{ row }">
            <el-tooltip content="Cria uma aplicação de teste">
              <el-button
                size="small"
                type="success"
                icon="el-icon-s-promotion"
                @click="openTestApplicationDialog(row)"
              >
                Aplicar
              </el-button>
            </el-tooltip>
            <btn-edit @click="edit(row)"> Editar </btn-edit>
            <btn-remove @click="remove(row)"> Remover </btn-remove>
          </template>
        </el-table-column>
      </el-table>
      <test-application-dialog ref="testApplicationDialog" />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Watch, Component, Ref } from "nuxt-property-decorator";
import { PageRequest, PageResponse } from "@/types/pagination";
import Test from "~/types/Test";
import { AxiosResponse } from "axios";
import { Action } from "vuex-class";
import { Context } from "@nuxt/types";
import TestApplicationDialog from "~/components/TestApplicationDialog.vue";

@Component({
  head() {
    return {
      title: "Testes",
    };
  },
  components: {
    TestApplicationDialog,
  },
})
export default class TestsList extends Vue {
  goingCreate: boolean = false;
  pageResponse: PageResponse<Test> = new PageResponse<Test>();
  pageRequest: PageRequest = new PageRequest();

  @Ref("testApplicationDialog")
  testApplicationDialog!: TestApplicationDialog;

  create() {
    this.goingCreate = true;
    this.$router.push("/platform/tests/new");
  }

  edit(row: Test) {
    this.$router.push("/platform/tests/" + row.id);
  }

  openTestApplicationDialog(test: Test) {
    this.testApplicationDialog.open(test);
  }

  async remove(row: Test) {
    try {
      let option = await this.$confirm(
        "Tem certeza de que deseja remover o teste? O segunte teste será removido: " +
          row.name,
        "Remover teste?",
        {
          confirmButtonText: "Remover",
          confirmButtonClass: "el-button--danger",
        }
      );
      if (option === "confirm") {
        try {
          await this.removeById(row.id);
          this.$notify({
            type: "success",
            title: "Sucesso ao remover",
            message: "O teste foi removido",
          });
          await this.loadData();
        } catch (e) {
          console.error(e);
          this.$notify({
            type: "error",
            title: "Não foi possível remover o teste",
            message:
              "Verifique se o teste não está sendo utilizado em alguma aplicação.",
          });
        }
      }
    } catch (cancel) {}
  }

  @Action("tests/paginate") paginate!: (
    pageRequest: PageRequest
  ) => Promise<PageResponse<Test>>;

  @Action("tests/removeById") removeById!: (
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
    let pageResponse: PageResponse<Test> = await ctx.store.dispatch(
      "tests/paginate",
      new PageRequest()
    );
    return { pageResponse };
  }
}
</script>
