<template>
  <div class="left">
    <el-breadcrumb>
      <el-breadcrumb-item :to="{path: '/platform'}">Plataforma</el-breadcrumb-item>
      <el-breadcrumb-item>Itens de teste</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="panel">
      <h2>Itens de teste</h2>
      <el-button type="primary" icon="el-icon-plus" @click="create">
        Novo
      </el-button>
      <el-table>
        <el-table-column></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  head() {
    return {
      title: "Testes",
    };
  },
})
export default class TestItemsList extends Vue {
  create() {
    this.$router.push('/platform/items/new')
  }
}
</script>
