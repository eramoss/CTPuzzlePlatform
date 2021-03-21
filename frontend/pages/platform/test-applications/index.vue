<template>
  <div class="left">
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/platform' }"
        >Plataforma</el-breadcrumb-item
      >
      <el-breadcrumb-item>Aplicações</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="panel">
      <h2>Aplicações</h2>
      <el-button
        title="Permite criar uma aplicação do teste para que algumas pessoas possam executá-lo resolvendo os itens"
        type="primary"
        icon="el-icon-plus"
        :loading="goingCreate"
        @click="create"
      >
        Nova aplicação de teste
      </el-button>
      <!-- <el-input v-model="pageRequest.search"></el-input> -->

      <filters-box>
        <filters-box-item label="Pesquisa">
          <el-input
            placeholder="Pesquisar"
            v-model="pageRequest.search"
            class="fill"
          ></el-input>
        </filters-box-item>
        <filters-box-item label="Filtro por testes">
          <el-select
            v-model="pageRequest.filter.test"
            @clear="clearTestFilter"
            placeholder="Filtro por testes"
            value-key="id"
            filterable
            clearable
          >
            <el-option
              v-for="test in tests"
              :key="test.id"
              :value="test"
              :label="test.name"
            >
            </el-option>
          </el-select>
        </filters-box-item>
      </filters-box>

      <el-table
        :data="pageResponse.data"
        v-if="pageResponse"
        empty-text="Sem resultados"
      >
        <el-table-column prop="id" label="Código" width="80"></el-table-column>
        <!-- <el-table-column prop="hash" label="Hash" width="200"></el-table-column> -->
        <el-table-column prop="name" label="Nome"></el-table-column>
        <el-table-column label="Teste" width="340">
          <template slot-scope="{ row }">
            <div>
              <nuxt-link :to="`/platform/tests/${row.test.id}`">
                <el-button type="text">{{ row.test.name }}</el-button>
              </nuxt-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Ações" width="300">
          <template slot-scope="{ row }">
            <el-tooltip content="Ver andamento do teste" effect="light">
              <el-button
                size="small"
                icon="el-icon-view"
                @click="follow(row)"
                type="primary"
              >
                Acompanhar
              </el-button>
            </el-tooltip>
            <btn-remove @click="remove(row)" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <test-application-dialog ref="applicationDialog" />
    <snack-bar-remove
      remove-action="test-applications/softDeleteById"
      restore-action="test-applications/restore"
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
import BtnRemove from "~/components/BtnRemove.vue";
import TestApplication from "~/types/TestApplication";
import TestApplicationDialog from "~/components/TestApplicationDialog.vue";
import SnackBarRemove from "~/components/SnackBarRemove.vue";

const ACTION_PAGINATE_NAME = "test-applications/paginate";

@Component({
  components: { BtnRemove, TestApplicationDialog, SnackBarRemove },
  head() {
    return {
      title: "Aplicações",
    };
  },
})
export default class ApplicationsList extends Vue {
  goingCreate: boolean = false;
  pageResponse!: PageResponse<Test>;
  pageRequest!: PageRequest;
  tests: Test[] = [];
  @Ref("applicationDialog") testApplicationDialog!: TestApplicationDialog;
  @Ref() snackBar!: SnackBarRemove;

  @Action(ACTION_PAGINATE_NAME) paginate!: (
    pageRequest: PageRequest
  ) => Promise<PageResponse<Test>>;

  @Watch("pageRequest", { deep: true })
  async onChangePageRequest() {
    this.loadData();
  }

  create() {
    this.testApplicationDialog.open();
  }

  follow(row: Test) {
    this.$router.push("/platform/test-applications/" + row.id);
  }

  clearTestFilter() {
    this.pageRequest.filter.test = undefined;
  }

  async loadData() {
    try {
      this.pageResponse = await this.paginate(this.pageRequest);
    } catch (e) {
      console.error(e);
      this.$notify.error({
        message: "Não foi possível listar as aplicações",
        title: "Erro ao listar aplicações",
      });
    }
  }

  async asyncData(ctx: Context) {
    let filter: { test?: Test } = { test: undefined };
    let tests: Test[] = await ctx.store.dispatch("tests/findAll");
    let testId = ctx.query.test;
    if (testId) {
      filter.test = tests.find((test) => test.id + "" == testId);
    }

    let pageRequest = new PageRequest(filter);

    let researchGroup = ctx.$auth.user?.researchGroup;
    if (ctx.$auth.user?.researchGroup) {
      //@ts-ignore
      pageRequest.andWhere = "test.researchGroup.id = " + researchGroup.id;
    }

    let pageResponse: PageResponse<Test> = await ctx.store.dispatch(
      ACTION_PAGINATE_NAME,
      pageRequest
    );
    return { pageResponse, pageRequest, tests };
  }

  mounted() {
    let action = this.$route.query.action;
    if (action == "apply") {
      this.testApplicationDialog.open(this.pageRequest.filter.test);
    }
  }

  async remove(testApplication: TestApplication) {
    await this.snackBar.remove(testApplication.id);
    this.loadData();
  }
}
</script>
