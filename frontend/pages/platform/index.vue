<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/platform' }">
        Plataforma
      </el-breadcrumb-item>
    </el-breadcrumb>
    <dashboard-title>Últimos acessos</dashboard-title>
    <div class="start flex-row">
      <color-panel
        icon="el-icon-warning"
        label="Respostas"
        link="/platform/items"
        info="68"
        color="#FA5C56"
      />
      <color-panel
        icon="el-icon-warning"
        label="Participações"
        link="/platform/items"
        info="9"
        color="#FFAF57"
      />
      <color-panel
        icon="el-icon-warning"
        label="Escore médio"
        link="/platform/items"
        info="12"
        color="#ACB6C0"
      />
      <color-panel
        icon="el-icon-warning"
        label="Mecânicas"
        link="/platform/mechanics"
        info="12"
        color="#61C096"
      />
      <color-panel
        icon="el-icon-warning"
        label="Mecânicas"
        link="/platform/mechanics"
        info="12"
        textColor="#68798C"
        color="#DBDDE1"
      />
      <color-panel
        icon="el-icon-warning"
        label="Mecânicas"
        link="/platform/mechanics"
        info="12"
        textColor="#68798C"
        color="#DBDDE1"
      />
    </div>

    <div class="start flex-row"></div>

    <el-button @click="goCreateTest" icon="el-icon-plus" type="primary">
      Novo teste
    </el-button>
  </div>
</template>

<script>
import Vue from "vue";
import Component from "vue-class-component";
import ColorPanel from "~/components/ColorPanel.vue";
import DashboardTitle from "~/components/DashboardTitle.vue";
@Component({
  components: { ColorPanel, DashboardTitle },
})
export default class PlatformDashboard extends Vue {
  goCreateTest() {
    this.$router.push("/platform/tests/new");
  }
}
</script>

<style lang="scss">
</style>
