<template>
  <div>
    <container class="container">
      <jumbotron-site-banner />
      <section id="play">
        <h2 class="title">Confira esse game configurado na plataforma:</h2>
        <gameIframe url="https://ct.playerweb.com.br?test=123" />
      </section>
    </container>
  </div>
</template>
<script lang="ts">
import GameIframe from "~/components/GameIframe.vue";
import TopBar from "~/components/TopBar.vue";
import JumbotronSiteBanner from "~/components/JumbotronSiteBanner.vue";
import { Component } from "nuxt-property-decorator";
import Vue from "vue";
@Component({
  auth: false,
  components: {
    TopBar,
    JumbotronSiteBanner,
    GameIframe,
  },
})
export default class SiteIndex extends Vue {
  head() {
    return {
      title:
        "CT Puzzle Platform | Plataforma de testes de Pensamento Computacional com puzzles",
      description:
        "Plataforma de testes de Pensamento Computacional com puzzles",
    };
  }
}
</script>
<style lang="scss">
</style>
