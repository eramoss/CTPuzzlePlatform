<template>
  <div class="left">
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/platform' }"
        >Plataforma</el-breadcrumb-item
      >
      <el-breadcrumb-item>Itens de teste</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="panel">
      <h2>Itens de teste</h2>
      <el-button
        type="primary"
        icon="el-icon-plus"
        :loading="goingCreate"
        @click="create"
      >
        Novo
      </el-button>
      <el-table :data="pageResponse.data">
        <el-table-column label="Código" prop="id" width="80"></el-table-column>
        <el-table-column label="Nome" prop="name"></el-table-column>
        <el-table-column label="Ações" prop="name" width="200">
          <template slot-scope="{ row }">
            <el-button type="primary" size="small" @click="edit(row)">
              Editar
            </el-button>
            <el-button type="danger" size="small" @click="remove(row)">
              Remover
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Action, Component } from "nuxt-property-decorator";
import { Context } from "@nuxt/types";
import { PageRequest, PageResponse } from "~/types/pagination";
import Item from "~/types/Item";
import { AxiosResponse } from "axios";

@Component({
  head() {
    return {
      title: "Itens de teste",
    };
  },
})
export default class ItemsList extends Vue {
  goingCreate: boolean = false;
  pageRequest: PageRequest = new PageRequest();
  pageResponse: PageResponse<Item> = new PageResponse<Item>();

  async asyncData(ctx: Context) {
    let pageResponse = await ctx.store.dispatch(
      "items/paginate",
      new PageRequest()
    );
    return { pageResponse };
  }

  edit(row: Item) {
    this.$router.push("/platform/items/" + row.id);
  }

  @Action("items/paginate") paginate!: (
    pageRequest: PageRequest
  ) => Promise<PageResponse<Item>>;

  @Action("items/removeById") removeById!: (
    id: number
  ) => Promise<AxiosResponse>;

  async loadData() {
    this.pageResponse = await this.paginate(this.pageRequest);
  }

  async remove(row: Item) {
    try {
      let option = await this.$confirm(
        "Tem certeza de que deseja remover o item? A segunte item será removido: " +
          row.name,
        "Remover item?",
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
            message: "O item foi removido",
          });
          await this.loadData();
        } catch (e) {
          console.error(e);
          this.$notify({
            type: "error",
            title: "Erro ao remover",
            message: "O item não foi removido",
          });
        }
      }
    } catch (cancel) {}
  }

  create() {
    this.goingCreate = true;
    this.$router.push("/platform/items/new");
  }
}
</script>
