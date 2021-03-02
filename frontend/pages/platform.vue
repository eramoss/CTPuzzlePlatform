<template>
  <div>
    <el-container style="height: 100vh">
      <el-header style="padding: 0">
        <top-bar width="100%" />
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            :router="true"
            :default-active="activeLink"
            id="platform-menu"
          >
            <el-menu-item
              index="/platform/mechanics"
              route="/platform/mechanics"
            >
              <i class="el-icon-s-operation"></i>
              <span> Mecânicas </span>
            </el-menu-item>
            <el-menu-item index="/platform/items" route="/platform/items">
              <i class="el-icon-files"></i>
              <span> Itens </span>
            </el-menu-item>

            <el-menu-item index="/platform/tests" route="/platform/tests">
              <i class="el-icon-document"></i>
              <span> Testes </span>
            </el-menu-item>
            <el-menu-item
              index="/platform/test-applications"
              route="/platform/test-applications"
            >
              <i class="el-icon-video-play"></i>
              <span> Aplicações </span>
            </el-menu-item>
            <el-menu-item index="/platform/statistics">
              <i class="el-icon-s-data"></i>
              <span> Estatísticas </span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <div>
            <nuxt-child></nuxt-child>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import TopBar from "~/components/TopBar.vue";

export default {
  head() {
    return {
      title: "Plataforma",
    };
  },
  components: { TopBar },
  data() {
    return {
      activeLink: "",
    };
  },
  mounted() {
    if (this.$route.query.op == "login") {
      this.$notify.success({
        message: `Olá, ${this.$auth.user.name}`,
        title: "Bem-vindo",
      });
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler() {
        this.activeLink = this.$route.path;
      },
    },
  },
};
</script>

<style lang="scss">
#platform-menu {
  .el-menu-item {
    text-align: left;
  }
}
</style>
