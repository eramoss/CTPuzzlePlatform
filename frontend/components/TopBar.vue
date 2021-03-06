<template>
  <div class="top-bar shadow">
    <container class="container" :max-width="width">
      <div style="flex-grow: 1" class="img">
        <nuxt-link to="/">
          <img src="/logo-1.svg" />
        </nuxt-link>
      </div>
      <a
        target="_blank"
        href="https://play.google.com/store/apps/details?id=com.univali.ctpuzzle"
      >
        <el-button
          v-show="!$auth.loggedIn"
          size="small"
          type="warning"
          title="Acessa a Google Play para baixar o app"
        >
          <img src="/play_icon.svg" style="width: 11px" /> Baixar CT Puzzle Test
        </el-button>
      </a>
      <nuxt-link
        v-show="!$auth.loggedIn"
        to="/signin/researcher"
        title="Registrar-se como pesquisador"
      >
        <el-button size="medium" type="text"> Registrar-se </el-button>
      </nuxt-link>
      <nuxt-link to="/login" v-show="!$auth.loggedIn">
        <el-button size="medium" type="text"> Entrar </el-button>
      </nuxt-link>
      <nuxt-link to="/platform" v-show="currentRoutIsNotPlatform">
        <el-button size="small" type="primary" title="Plataforma">
          Plataforma
        </el-button>
      </nuxt-link>
      <el-dropdown @command="handleCommand" v-show="$auth.loggedIn">
        <span style="margin: auto 10px">
          <el-button type="text">
            {{ $auth.user && $auth.user.name }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
        </span>
        <el-dropdown-menu>
          <el-dropdown-item icon="el-icon-circle-close" command="logout"
            >Sair</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>

      <el-button
        size="small"
        type="text"
        title="Sair"
        @click="logout"
        v-show="$auth.loggedIn"
      >
      </el-button>
    </container>
  </div>
</template>
<script lang="ts">
import { Prop, Component } from "nuxt-property-decorator";
import Vue from "vue";

@Component
export default class TopBar extends Vue {
  @Prop({ default: "90%" }) width!: string;

  async logout() {
    await this.$auth.logout();
    this.$router.push("/");
  }

  handleCommand(command: string) {
    if (command === "logout") {
      this.logout();
    }
  }

  get currentRoutIsNotPlatform() {
    return this.$route.path.indexOf("platform") === -1;
  }
}
</script>
<style lang="scss">
.top-bar .container {
  padding: 7px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;

  .img {
    display: flex;
    align-items: center;
  }
}
</style>
