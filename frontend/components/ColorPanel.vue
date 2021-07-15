<template>
  <div
    class="color-panel shadow"
    :style="{ 'background-color': color }"
    :class="{ 'with-link': !!link }"
    @click="goToLink"
  >
    <div class="top-label flex-row">
      <span :style="{ color: textColor }">{{ label }}</span>
      <div class="flex-row">
        <slot name="icons"></slot>
        <el-tooltip placement="top" v-if="showInfo">
          <div slot="content">
            <div style="max-width: 300px">
              <slot name="info" />
            </div>
          </div>
          <span style="display:flex">
            <icon name="info" :style="{ color: textColor }" />
          </span>
        </el-tooltip>
      </div>
    </div>
    <div class="flex-row">
      <icon
        v-show="icon"
        :style="{ color: textColor }"
        :name="icon"
        class="panel-icon"
      ></icon>
      <div :style="{ color: textColor }" class="main-info">
        <slot>
          <span v-show="loading">...</span>
          <span v-show="!loading">{{ data }}</span>
        </slot>
      </div>
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
  @Prop() data!: string;
  @Prop() color!: string;
  @Prop({ default: true }) loading!: boolean;
  @Prop() textColor!: string;
  @Prop({ default: false }) showInfo!: boolean;

  goToLink() {
    if (this.link) {
      this.$router.push(this.link);
    }
  }
}
</script>
<style lang="scss">
.color-panel.with-link {
  cursor: pointer;
}
.color-panel {
  text-align: left;
  color: white;
  padding: 15px;
  min-width: 250px;
  border-radius: 6px;
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