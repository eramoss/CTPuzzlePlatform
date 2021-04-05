<template>
  <div>
    <container>
      <jumbotron-site-banner />
      <section id="play">
        <h2 class="title">Confira esse game configurado na plataforma:</h2>
        <test-application-game-iframe
          :testApplication="randomTestApplication"
        />
        <div style="style: margin-bottom: 200px">
          <!--   <nuxt-link to="/public-applications">
            <el-button class="shadow btn-big" type="warning">Mais jogos</el-button>
          </nuxt-link> -->
        </div>
      </section>
    </container>
  </div>
</template>
<script lang="ts">
import TestApplicationGameIframe from "~/components/TestApplicationGameIframe.vue";
import TopBar from "~/components/TopBar.vue";
import JumbotronSiteBanner from "~/components/JumbotronSiteBanner.vue";
import { Component } from "nuxt-property-decorator";
import Vue from "vue";
import { Context } from "@nuxt/types";
import TestApplication from "~/types/TestApplication";

@Component({
  auth: false,
  scrollToTop: true,
  components: {
    TopBar,
    JumbotronSiteBanner,
    TestApplicationGameIframe,
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

  randomTestApplication!: TestApplication;

  async asyncData(context: Context) {
    const testApplications = await context.store.dispatch(
      "test-applications/getPuplicApplications"
    );
    let randomTestApplication =
      testApplications[Math.floor(Math.random() * testApplications.length)];

    return {
      randomTestApplication,
      testApplications,
    };
  }
}
</script>
<style lang="scss">
</style>
