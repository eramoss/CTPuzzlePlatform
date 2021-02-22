<template>
  <div>
    <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/platform' }">
            Plataforma
        </el-breadcrumb-item>
    </el-breadcrumb>
    <el-button @click="goCreateTest" icon="el-icon-plus" type="primary">
      Novo teste
    </el-button>
  </div>
</template>

<script>
import Vue from "vue";
import Component from "vue-class-component";
@Component
export default class PlatformDashboard extends Vue {
  goCreateTest() {
    this.$router.push("/platform/tests/new");
  }
}
</script>

<style>
</style>
