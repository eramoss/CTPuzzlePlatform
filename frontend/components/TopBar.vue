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
          size="small"
          type="warning"
          title="Acessa a Google Play para baixar o app"
        >
          Baixar CT Puzzle Test
        </el-button>
      </a>
      <nuxt-link
        v-if="!$auth.loggedIn"
        to="/signin/researcher"
        title="Registrar-se como pesquisador"
      >
        <el-button size="medium" type="text"> Registrar-se </el-button>
      </nuxt-link>
      <nuxt-link to="/login" v-show="!$auth.loggedIn">
        Entrar
      </nuxt-link>
      <nuxt-link to="/platform">
        <el-button
          size="small"
          type="primary"
          title="Plataforma"
          >Plataforma</el-button
        >
      </nuxt-link>
      <span v-if="$auth.loggedIn" style="margin: auto 10px">
        {{ $auth.user.name }}
      </span>
      <el-button
        size="small"
        type="primary"
        title="Plataforma"
        @click="logout"
        v-show="$auth.loggedIn"
      >
        Sair
      </el-button>
    </container>
  </div>
</template>
<script lang="ts">
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import Vue from "vue";

@Component()
export default class TopBar extends Vue {
  @Prop({ default: "90%" }) width!: string;

  async logout() {
    await this.$auth.logout();
    this.$router.push("/");
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
