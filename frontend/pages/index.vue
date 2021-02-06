<template>
  <div>
    <top-bar width="100%"/>
    <nuxt-child/>
  </div>
</template>
<script>
import TopBar from "@/components/TopBar";
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
  },
};
</script>
<style lang="scss">
</style>
