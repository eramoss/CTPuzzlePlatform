<template>
  <div v-if="testApplication">
    <a ref="link" target="_blank" :href="gameUrl" style="display: none">Link</a>
    <game-iframe :url="gameUrl" :covered="covered" />
    <div>
      <a :href="gameUrl" target="_blank" rel="noopener noreferrer">
        <el-button type="text"> Abrir em nova aba </el-button>
      </a>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Ref, Watch } from "nuxt-property-decorator";
import { Context } from "@nuxt/types";
import TestApplication from "~/types/TestApplication";
import GameIframe from "./GameIframe.vue";
import { loadUserUuid } from "~/types/userUuidUtil";

@Component({
  components: {
    GameIframe,
  },
})
export default class TestApplicationGameIframe extends Vue {
  @Prop({}) testApplication!: TestApplication;
  @Prop({ default: true }) covered!: boolean;
  userUuid = "";
  @Ref() link!: HTMLElement;

  async asyncData(ctx: Context) {}

  get gameUrl(): string {
    let gameUrl = "";
    if (this.userUuid.length) {
      if (this.testApplication) {
        if (this.testApplication?.url) {
          gameUrl = this.testApplication?.url?.replace(
            "<user_uuid>",
            this.userUuid
          );
        }
      }
    }
    return gameUrl;
  }

  @Watch("gameUrl")
  onChangeGameUrl() {
    //this.link.click()
  }

  @Watch("testApplication", { immediate: true })
  onChangeTestApplication() {
    this.userUuid = loadUserUuid();
  }
}
</script>