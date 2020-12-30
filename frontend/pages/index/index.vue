<template>
  <div>
    <container class="container">
      <jumbotron-site-banner />
      <section id="play">
        <h2 class="title">Confira esse game configurado na plataforma:</h2>
        <gameIframe url="https://ct.playerweb.com.br"/>
      </section>
    </container>
  </div>
</template>
<script>
import GameIframe from "@/components/GameIframe";
import TopBar from "@/components/TopBar";
import JumbotronSiteBanner from "@/components/JumbotronSiteBanner";
export default {
  head() {
    return {
      title:
        "CT Puzzle Platform | Plataforma de testes de Pensamento Computacional com puzzles",
      description:
        "Plataforma de testes de Pensamento Computacional com puzzles",
    };
  },
  components: {
    TopBar,
    JumbotronSiteBanner,
    GameIframe,
  },
};
</script>
<style lang="scss">
</style>
