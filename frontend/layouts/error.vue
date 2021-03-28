<template></template>
<script lang="ts">
import Vue from "vue";
import { Component } from "nuxt-property-decorator";

@Component
export default class ErrorPage extends Vue {
  mounted() {
    this.$notify.error({
      title: "Ocorreu um erro",
      message: "Redirecionando para o início",
    });
    //this.$router.push("/platform");
  }
}
</script>