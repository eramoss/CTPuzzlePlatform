<template>
  <div class="snack-bar-container" :class="{ visible: visible }">
    <div class="snack-bar">
      ({{ timer }})
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "nuxt-property-decorator";

@Component
export default class SnackBar extends Vue {
  @Prop({ default: 5000 }) timeout!: number;
  timer = 0;
  visible = false;
  interval!: NodeJS.Timeout;

  show() {
    this.timer = this.timeout / 1000;
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      this.timer = this.timer - 1;
      console.log(this.timer);
    }, 1000);
    this.visible = true;
    setTimeout(() => {
      this.hide();
    }, this.timeout);
  }

  hide() {
    this.visible = false;
  }
}
</script>
<style lang="scss">
.snack-bar-container {
  transition: top 0.5s;
  left: 0;
  top: -110px;
  position: fixed;
  width: 100%;
  z-index: 100;
  padding: 10px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
}
.snack-bar-container.visible {
  top: 20px;
}
.snack-bar {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
  width: 35%;
  background: #555;
  color: white;
  padding: 10px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}
</style>