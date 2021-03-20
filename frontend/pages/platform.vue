<template>
  <div>
    <el-container>
      <el-header class="custom-header shadow">
        <top-bar width="100%" />
      </el-header>
      <el-container>
        <el-aside :width="width" class="custom-aside">
          <el-menu
            :collapse-transition="false"
            :collapse="isCollapsed"
            :router="true"
            :default-active="activeLink"
            :style="{ width: width }"
            id="platform-menu"
          >
            <el-menu-item index="/platform" route="/platform">
              <icon name="dashboard" />
              <span slot="title"> Dashboard </span>
            </el-menu-item>
            <el-menu-item
              index="/platform/mechanics"
              route="/platform/mechanics"
            >
              <icon name="tune" />
              <span slot="title"> Mecânicas </span>
            </el-menu-item>
            <el-menu-item index="/platform/items" route="/platform/items">
              <icon name="format_list_numbered" />
              <span slot="title"> Itens </span>
            </el-menu-item>

            <el-menu-item index="/platform/tests" route="/platform/tests">
              <icon name="assignment"></icon>
              <span slot="title"> Testes </span>
            </el-menu-item>
            <el-menu-item
              index="/platform/test-applications"
              route="/platform/test-applications"
            >
              <icon name="play_circle" />
              <span slot="title"> Aplicações </span>
            </el-menu-item>
            <el-menu-item index="/platform/statistics">
              <icon name="analytics" />
              <!-- <i class="el-icon-s-data"> -->
              <span slot="title"> Estatísticas </span>
            </el-menu-item>
            <el-menu-item
              index="/platform/users"
              route="/platform/users"
              v-show="
                roleChecker.userHasSomeOfThisRoles($auth.user, [
                  'sysadmin',
                  'admin',
                ])
              "
            >
              <icon name="people" />
              <span slot="title"> Usuários </span>
            </el-menu-item>
            <el-menu-item class="toggle-icon" @click="toggleCollapse">
              <icon v-show="isCollapsed" name="arrow_forward" />
              <icon v-show="!isCollapsed" name="arrow_back" />
              <span slot="title">
                {{ isCollapsed ? "Expandir Menu" : "Recolher Menu" }}
              </span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main class="custom-main">
          <div>
            <nuxt-child></nuxt-child>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import TopBar from "~/components/TopBar.vue";
import { Component, Watch } from "nuxt-property-decorator";
import Vue from "vue";
import eventBus from "~/utils/eventBus";
import RoleChecker from "~/utils/RoleChecker";
import { Context } from "@nuxt/types";
import User from "~/types/User";

@Component({
  head() {
    return {
      title: "Plataforma",
    };
  },
  components: { TopBar },
  watch: {
    $route: {
      immediate: true,
      handler() {
        let path = this.$route.path;
        if (path) {
          [
            "/platform",
            "/platform/mechanics",
            "/platform/items",
            "/platform/tests",
            "/platform/test-applications",
            "/platform/users",
          ].forEach((menu) => {
            if (menu.startsWith(path)) {
              //@ts-ignore
              this.activeLink = path;
            }
          });
        }
      },
    },
  },
})
export default class Platform extends Vue {
  activeLink = "";
  roleChecker: RoleChecker = new RoleChecker();
  isCollapsed = false;

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    eventBus.$emit("resize");
  }

  get width() {
    let width = "200px";
    if (this.isCollapsed) {
      width = "60px";
    }
    return width;
  }

  @Watch("isCollapsed")
  onChangeCollapse() {
    localStorage.setItem("collapsed", this.isCollapsed + "");
  }

  mounted() {
    this.isCollapsed =
      localStorage.getItem("collapsed") == "true" ? true : false;
    if (this.$route.query.op == "login") {
      this.$notify.success({
        message: `Olá, ${this.$auth.user?.name}`,
        title: "Bem-vindo",
      });
    }
  }
}
</script>
<style lang="scss">
#platform-menu {
  height: 100vh;
  position: fixed;
  .el-menu-item {
    text-align: left;
    span {
      font-weight: bold;
      color: #666;
    }
  }
  .toggle-icon {
    color: #909399;
  }
}
$height: 56px !important;
.custom-aside {
  margin-top: $height;
}
.custom-main {
  margin-top: $height;
}
.custom-header {
  padding: 0;
  height: $height;
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 10;
  background: white;
  margin-bottom: 60px;
}
</style>
