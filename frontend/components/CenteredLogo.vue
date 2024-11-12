<template>
   <div class="centered-logo">
       <img src="logo-1.svg" alt="Logo">
   </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'nuxt-property-decorator'
@Component
export default class  extends Vue{

}
</script>
<style lang="scss">
    .centered-logo{
    opacity: 0.4;
    width: 150px;
    margin: 0 auto;
    display: block;
    padding: 10px;
}
</style>