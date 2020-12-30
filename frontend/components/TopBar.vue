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
      <nuxt-link to="/signin/researcher" title="Registrar-se como pesquisador">
        <el-button size="medium" type="text"> Registrar-se </el-button>
      </nuxt-link>
      <nuxt-link to="/login">
        <el-button size="small" type="primary" title="Entrar na plataforma"
          >Entrar</el-button
        >
      </nuxt-link>
      <nuxt-link to="/platform">
        <el-button size="small" type="primary" title="Plataforma"
          >Plataforma</el-button
        >
      </nuxt-link>
    </container>
  </div>
</template>
<script>
export default {
  props: {
    width: {
      required: false,
      default: '90%'
    }
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
