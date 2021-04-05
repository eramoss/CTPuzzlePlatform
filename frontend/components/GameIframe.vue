<template>
  <gradient-iframe :url="url" :width="width" :height="height" :disabled="!covered">
    <el-button type="success" v-if="covered" @click="uncover" class="btn-big shadow">Jogar!</el-button>
  </gradient-iframe>
</template>
<script lang="ts">
import Vue from "vue";
import GradientIframe from "@/components/GradientIframe.vue";
import { Component, Prop } from "nuxt-property-decorator";
import { Context } from "@nuxt/types";
@Component({
  components: {
    GradientIframe,
  },
})
export default class GameIframe extends Vue {
  @Prop({}) url!: string;
  @Prop({default: 800}) width!: number;
  @Prop({default: 500}) height!: number;
  
  @Prop({default:true}) covered !:boolean

  uncover(){
      this.covered = false
  }
  async asyncData(ctx: Context) {}
}
</script>