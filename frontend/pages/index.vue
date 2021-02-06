<template>
  <div>
    <top-bar width="100%" />
    <nuxt-child />
  </div>
</template>
<script lang="ts">
import TopBar from "@/components/TopBar";
import Component from "vue-class-component";
import Vue from "vue";
@Component({
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
})
export default class PlatformIndex extends Vue {

}
</script>
<style lang="scss">
</style>
