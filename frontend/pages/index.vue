<template>
  <div>
    <div class="top-bar shadow">
      <container class="container" max-width="90%">
        <div style="flex-grow: 1" class="img">
          <img src="/logo-1.svg" />
        </div>
        <el-button size="medium" type="info">Baixar CT Puzzle Test</el-button>
        <el-button size="medium" type="text">Registrar-se</el-button>
        <el-button size="medium" type="primary">Entrar</el-button>
      </container>
    </div>
    <container class="container">
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
            <el-button class="shadow btn-big" type="warning">Jogar!</el-button>
            <el-button class="shadow btn-big" type="text"
              >Registrar-se como pesquisador</el-button
            >
          </div>
        </div>
        <div class="image">
          <img
            src="statistics.svg"
            alt="Mãos segurando juntas peças de puzzles"
          />
        </div>
      </div>
      <section>
        <h2 class="title">
          Confira esse game configurado na plataforma:
        </h2>
        <gameIframe url="https://ct.playerweb.com.br" />
      </section>
    </container>
  </div>
</template>
<script>
import GameIframe from "@/components/GameIframe";
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
    GameIframe,
  },
};
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
