<template>
  <div class="test-application-item" :style="{ 'max-width': `${width}px` }">
    <thumbnail
      style="border-radius: 6px 6px 0 0"
      :width="`${width}px`"
      :height="`${height * 1.3}px`"
      :src="firstItem.item.thumbnail"
      alt="Imagem do jogo"
    />
    <div class="texts">
      <el-tooltip
        :content="testApplication.name"
        placement="top"
        :open-delay="400"
        effect="light"
      >
        <p class="item-title">{{ testApplication.name }}</p>
      </el-tooltip>
      <p class="item-description">
        {{ testApplication.description || firstItem.item.description }}
      </p>
      <p class="item-detail">
        Questões: {{ testApplication.test.items.length }}
      </p>
      <el-button class="play-btn" type="warning" @click="play">
        Jogar
      </el-button>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Emit, Prop } from "nuxt-property-decorator";
import { Context } from "@nuxt/types";
import TestApplication from "~/types/TestApplication";
import TestItem from "~/types/TestItem";

@Component({})
export default class PublicApplicationThumbnail extends Vue {
  @Prop({}) testApplication!: TestApplication;

  @Prop({ default: 300 }) width!: number;
  @Prop({ default: 160 }) height!: number;
  async asyncData(ctx: Context) {}

  get firstItem(): TestItem {
    return this.testApplication.test.items[0];
  }

  play() {
    this.$emit("requestPlay", this.testApplication);
  }
}
</script>
<style lang="scss">
$orange: #d67120;
.test-application-item {
  transition: all 0.3s;
  border-radius: 8px;
  position: relative;
  text-align: left;
  display: flex;
  flex-flow: column nowrap;
  margin: 10px;
  .texts {
    flex-grow: 1;
    padding: 20px;
    word-break: keep-all;
    text-overflow: ellipsis;
    text-align: left;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
  }
  .item-title {
    height: 3em;
    font-weight: bold;
    font-size: 17pt;
  }
  .item-description {
    height: 5em;
    //margin: 15px auto;
  }
  .item-detail {
    font-size: 10pt;
  }
  .play-btn {
    background: white;
    border: 2px solid $orange;
    color: $orange;
    margin-top: 5px;
    transition: all 0.4s;
    font-size: 15pt;
    font-weight: bold;
  }
}
.test-application-item:hover {
  cursor: pointer;
  margin-bottom: 10px;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.4);
  .play-btn {
    transition: all 0.4s;
    background: $orange;
    color: white;
  }
}
</style>