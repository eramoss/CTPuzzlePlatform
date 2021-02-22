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
      <!-- <el-input v-model="pageRequest.search"></el-input> -->
      {{value}}
       <el-select v-model="value" placeholder="Select">
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
      <el-table :data="pageResponse.data">
        <el-table-column prop="id" label="Código" width="100"></el-table-column>
        <el-table-column prop="name" label="Nome"></el-table-column>
        <el-table-column label="Ações" width="220">
          <template slot-scope="{ row }">
            <el-button size="small" icon="el-icon-eye" @click="follow(row)"
              >Acompanhar</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Watch, Component, Ref } from "nuxt-property-decorator";
import { PageRequest, PageResponse } from "@/types/pagination";
import Test from "~/types/Test";
import { Action } from "vuex-class";
import { Context } from "@nuxt/types";

@Component({
  head() {
    return {
      title: "Aplicações",
    };
  },
})
export default class ApplicationsList extends Vue {
  goingCreate: boolean = false;
  pageResponse: PageResponse<Test> = new PageResponse<Test>();
  pageRequest: PageRequest = new PageRequest();
  options:Test[] = []
  value = ''
      
  filter: { test: Test } = { test: new Test() };

  follow(row: Test) {
    this.$router.push("/platform/tests/" + row.id);
  }

  @Action("tests-applications/paginate") paginate!: (
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
    let pageResponse: PageResponse<Test> = await ctx.store.dispatch(
      "test-applications/paginate",
      new PageRequest()
    );
    let options = await ctx.store.dispatch("tests/findAll");
    return { pageResponse, options };
  }

  @Watch("filter", { deep: true })
  onChangeFilter() {
    //this.loadData()
  }
}
/**
 * Icone do google play
 * tirar botão plataforma
 * Adicionar descrição da especificação da resposta
 * funcoes de auxilio:
 * leveshtein
 * 
 * Testar resultado do score na tela de mecânica
 * Categorizar gráfico.
 * Qualidade do item: 5 estrelas.
 */
</script>
