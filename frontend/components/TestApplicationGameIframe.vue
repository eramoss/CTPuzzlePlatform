<template>
  <div v-if="testApplication">
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
import { Component, Prop, Watch } from "nuxt-property-decorator";
import { Context } from "@nuxt/types";
import TestApplication from "~/types/TestApplication";
import GameIframe from "./GameIframe.vue";
import { v4 as uuidv4 } from "uuid";

@Component({
  components: {
    GameIframe,
  },
})
export default class TestApplicationGameIframe extends Vue {
  @Prop({}) testApplication!: TestApplication;
  @Prop({ default: true }) covered!: boolean;
  userUuid = "";

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

  loadUserUuid() {
    let userUuid = "";
    if (process.browser) {
      userUuid = localStorage?.getItem("userUuid") || "";
      if (!userUuid) {
        userUuid = uuidv4();
        localStorage?.setItem("userUuid", userUuid);
      }
    }
    this.userUuid = userUuid;
  }

  @Watch("testApplication", { immediate: true })
  onChangeTestApplication() {
    this.loadUserUuid();
  }

}
</script>