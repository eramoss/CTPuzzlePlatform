<template>
  <div
    class="game-iframe"
    :style="{
      width: `${calculatedWidth}px`,
      height: `${calculatedHeight}px`,
    }"
  >
    <div class="gradient" v-if="!disabled">
      <div class="slot">
        <div class="slot-content">
          <slot />
        </div>
      </div>
    </div>
    <iframe
      :key="url"
      ref="iframe"
      frameborder="0"
      :src="url"
      :width="calculatedWidth"
      :height="calculatedHeight"
    ></iframe>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch, Ref } from "nuxt-property-decorator";
@Component
export default class GradientIframe extends Vue {
  @Prop() url!: string;
  @Prop({ default: 800 }) width!: number;
  @Prop({ default: 480 }) height!: number;
  @Prop({ default: false }) disabled!: Boolean;
  @Ref() iframe!: any;

  calculatedWidth: number = this.width;
  calculatedHeight: number = this.height;

  updateWidthAndWeight() {
    let ratio = this.height / this.width;
    this.calculatedWidth = window.innerWidth - 20;
    this.calculatedHeight = ratio * this.calculatedWidth;
  }

  mounted() {
    if (window.innerWidth < 1000) {
      this.updateWidthAndWeight();
    }
  }
}
</script>
<style lang="scss">
.game-iframe {
  position: relative;
  margin: 0 auto;
  .gradient {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba(57, 35, 255, 0.4);
  }
}
.slot {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  position: absolute;
  //border: 1px solid red;
  .slot-content {
    align-self: center;
    //border: 1px solid green;
  }
}
</style>
