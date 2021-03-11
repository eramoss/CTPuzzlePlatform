<template>
  <div>
    <top-bar class="shadow" width="100%" />
    <nuxt-child />
  </div>
</template>
<script lang="ts">
import TopBar from "~/components/TopBar.vue";
import { Component } from "nuxt-property-decorator";
import Vue from "vue";
@Component({
  components: {
    TopBar,
  },
})
export default class PlatformIndex extends Vue {
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
