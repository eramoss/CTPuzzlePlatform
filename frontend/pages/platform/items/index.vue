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
        <el-table-column label="ID" prop="id" width="40"></el-table-column>
        <el-table-column label="Imagem" width="130">
          <template slot-scope="{ row }">
            <thumbnail :src="row.thumbnail" width="120px" height="80px" />
          </template>
        </el-table-column>
        <el-table-column label="Nome" prop="name" width="200"></el-table-column>
        <el-table-column label="Descrição" prop="description"></el-table-column>
        <el-table-column label="Ações" prop="name" width="240">
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
        "Tem certeza de que deseja remover o item? O segunte item será removido: " +
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
            title: "O item não foi removido",
            message:
              "O item não pode ser removido. Verifique se ele não está sendo usado em um teste.",
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
