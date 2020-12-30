<template>
  <div class="jumbotron-and-image">
    <div class="jumbotron">
      <h1>Plataforma de <br />CT com puzzles</h1>
      <p>
        Uma aplicação para medir as habilidades do Pensamento <br />
        Computacional (Computational Thinking - CT) por meio de
        <i>puzzles</i> <br />
        divertidos
      </p>
      <div style="margin-top: 40px">
        <a href="#play">
          <el-button
            class="shadow btn-big"
            type="warning"
            title="Quero jogar um puzzle"
            >Jogar!</el-button
          >
        </a>
        <nuxt-link to="/signin/researcher">
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
      <img src="statistics.svg" alt="Mãos segurando juntas peças de puzzles" />
    </div>
  </div>
</template>
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
