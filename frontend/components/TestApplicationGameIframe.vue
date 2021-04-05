<template>
  <div v-if="testApplication">
    <game-iframe :url="gameUrl" />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "nuxt-property-decorator";
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
  userUuid!: string;

  async asyncData(ctx: Context) {}

  get gameUrl(): string {
    let gameUrl = "https://ct.playerweb.com.br";
    if (this.testApplication) {
      gameUrl = this.testApplication?.url?.replace(
        "<user_uuid>",
        this.userUuid
      );
    }
    return gameUrl;
  }
  mounted() {
    let userUuid = localStorage.getItem("userUuid");
    if (!userUuid) {
      userUuid = uuidv4();
      localStorage.setItem("userUuid", userUuid);
    }
    this.userUuid = userUuid;
  }
}
</script>