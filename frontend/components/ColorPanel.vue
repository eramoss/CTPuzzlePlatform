<template>
  <div class="color-panel shadow" :style="{ 'background-color': color }" @click="$router.push(link)">
    <div class="top-label">
      <span :style="{ color: textColor }">{{ label }}</span>
    </div>
    <div class="flex-row">
      <icon
        :style="{ color: textColor }"
        :name="icon"
        class="panel-icon"
      ></icon>
      <div :style="{ color: textColor }" class="main-info">{{ info }}</div>
    </div>
    <!-- <nuxt-link v-if="link" :to="link" class="panel-link">
      <div :style="{ color: textColor }">
        <i class="el-icon-top-right" /> Acessar
      </div>
    </nuxt-link> -->
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "nuxt-property-decorator";
@Component
export default class ColorPanel extends Vue {
  @Prop() icon!: string;
  @Prop() label!: string;
  @Prop() link!: string;
  @Prop() info!: string;
  @Prop() color!: string;
  @Prop() textColor!: string;
}
</script>
<style lang="scss">
.color-panel {
  cursor: pointer;
  text-align: left;
  color: white;
  padding: 15px;
  min-width: 250px;
  border-radius: 6px;
  margin: 12px 12px 25px 0;
  //box-shadow: rgba(0, 0, 0, 0.18) 0px 8px 19px;

  .top-label {
    font-weight: bold;
  }

  .main-info {
    margin-top: 10px;
    margin-bottom: 12px;
    font-size: 2em;
    font-weight: bold;
  }

  .panel-link {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.1);
    padding: 3px;
    border-radius: 9px;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    display: block;
    margin: 0;
  }
  .panel-link:hover {
    color: rgba(255, 255, 255, 1);
  }

  .panel-icon {
    font-size: 38pt;
    opacity: 0.5;
  }
}
</style>