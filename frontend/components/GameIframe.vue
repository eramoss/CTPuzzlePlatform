<template>
  <gradient-iframe
    :url="url"
    :width="width"
    :height="height"
    :disabled="!coveredValue"
  >
    <el-button
      type="success"
      v-if="coveredValue"
      @click="uncover"
      class="btn-big shadow"
      >Jogar!</el-button
    >
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
  @Prop({ default: 800 }) width!: number;
  @Prop({ default: 500 }) height!: number;

  @Prop({ default: true }) covered!: boolean;
  coveredValue = true;

  uncover() {
    this.coveredValue = false;
  }

  mounted() {
    this.coveredValue = this.covered;
  }

  async asyncData(ctx: Context) {}
}
</script>