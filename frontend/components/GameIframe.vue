<template>
  <div class="game-iframe" :style="{
    'width': `${calculatedWidth}px`,
    'height': `${calculatedHeight}px`,
  }">
    <div class="gradient" ></div>
    <div class="buttons">
      <slot/>
    </div>
    <iframe
      :src="url"
      frameborder="0"
      :width="calculatedWidth"
      :height="calculatedHeight"
    ></iframe>
  </div>
</template>
<script>
export default {
  props: {
    url: {
      required: true,
      type: String,
    },
    width: {
      default: 800,
    },
    height: {
      default: 480,
    },
  },
  data() {
    return {
      calculatedWidth: this.width,
      calculatedHeight: this.height,
    };
  },
  methods: {
    updateWidthAndWeight() {
      let ratio = this.height / this.width;
      this.calculatedWidth = window.innerWidth - 20;
      this.calculatedHeight = ratio * this.calculatedWidth;
    },
  },
  mounted() {
    if (window.innerWidth < 1000) {
      this.updateWidthAndWeight();
    }
  },
};
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
</style>
