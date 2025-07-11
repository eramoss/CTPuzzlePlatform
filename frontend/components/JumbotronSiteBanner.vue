<template>
  <div class="jumbotron-and-image">
    <div class="jumbotron">
      <h1>Plataforma de Puzzles</h1>
      <p>
        Uma aplicação para medir as habilidades do Pensamento Computacional por meio de <i>puzzles</i> divertidos
      </p>
      <div style="margin-top: 40px">
        <nuxt-link to="/public-applications">
          <el-button
            class="shadow btn-big"
            type="warning"
            title="Quero jogar um puzzle"
            >Jogar!</el-button
          >
        </nuxt-link>
        <nuxt-link to="/signin/researcher" v-show="!$auth.loggedIn">
          <el-button
            class="shadow btn-big"
            type="text"
            title="Registrar-se como pesquisador, professor etc."
          >
            Registrar-se como pesquisador
          </el-button>
        </nuxt-link>
      </div>
    </div>
    <div class="image">
      <img src="imagem_puzzle.png" alt="Mãos segurando juntas peças de puzzles" />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'nuxt-property-decorator';

@Component
export default class JumbotronSiteBanner extends Vue {

}
</script>
<style lang="scss">
.jumbotron-and-image {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-content: center;
  margin: 80px auto;

  div.jumbotron {
    width: 60%;
    h1 {
      line-height: 1em;
      font-size: 40pt;
      font-weight: 100;
    }
    p {
      margin: 15px auto;
      font-weight: 100;
      font-size: 14pt;
    }
  }

  div.image {
    width: 30%;
    img {
      max-width: 100%;
    }
  }
}
</style>
