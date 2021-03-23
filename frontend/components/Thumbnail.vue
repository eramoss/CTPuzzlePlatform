<template>
  <div
    class="image-thumbnail"
    :style="{
      'background-image': `url(${computedSrc})`,
      width: width,
      height: height,
    }"
  >
    <img :src="computedSrc" :alt="alt" style="display: none" />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "nuxt-property-decorator";
import { $axios } from "~/utils/axios";

@Component
export default class Thumbnail extends Vue {
  @Prop() src!: string;
  @Prop() alt!: string;
  @Prop({ default: "200px" }) width!: string;
  @Prop({ default: "130px" }) height!: string;

  get computedSrc() {
    return $axios.defaults.baseURL + "/file-upload/view/" + this.src;
  }
}
</script>
<style lang="scss">
.image-thumbnail {
  background-color: #eee;
  background-position: center !important;
  background-size: cover !important;
}
</style>