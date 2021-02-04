<template>
  <div>
    <el-container style="height: 100vh">
      <el-header style="padding: 0">
        <top-bar width="100%"/>
      </el-header>
      <el-container>
        <el-aside width="200px"
        >
          <el-menu
            router
            default-active="2"
            id="platform-menu"
            @open="handleOpen"
            @close="handleClose"
          >
            <el-menu-item-group>
              <el-menu-item index="/platform/mechanics" route="/platform/mechanics">
                <i class="el-icon-s-operation"></i>
                <span> Mecânicas </span>
              </el-menu-item>
              <el-menu-item index="/platform/items" route="/platform/items">
                <i class="el-icon-files"></i>
                <span> Itens </span>
              </el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <el-menu-item index="/platform/tests" route="/platform/tests">
                <i class="el-icon-receiving"></i>
                <span> Testes </span>
              </el-menu-item>
              <el-menu-item index="/platform/users">
                <i class="el-icon-user"></i>
                <span> Amostras </span>
              </el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <el-menu-item index="/platform/statistics">
                <i class="el-icon-data-analysis"></i>
                <span> Estatísticas </span>
              </el-menu-item>
            </el-menu-item-group>
          </el-menu>
        </el-aside
        >
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
import TopBar from "@/components/TopBar";

export default {
  head() {
    return {
      title: "Plataforma",
    };
  },
  components: {TopBar},
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
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
