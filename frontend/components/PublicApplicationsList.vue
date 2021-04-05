<template>
  <div>
    <div v-if="currentApplication.id" class="play-area">
      <section>
        <h2 class="title">{{ currentApplication.name }}</h2>
        <test-application-game-iframe
          :testApplication="currentApplication"
          :covered="false"
        />
      </section>
    </div>
    <div class="public-applications-list">
      <div
        id="item"
        :key="application.id"
        v-for="application in testApplications"
      >
        <public-application-thumbnail
          :testApplication="application"
          @requestPlay="playPuzzle"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "nuxt-property-decorator";
import TestApplication from "~/types/TestApplication";
import PublicApplicationThumbnail from "./PublicApplicationThumbnail.vue";
import TestApplicationGameIframe from "~/components/TestApplicationGameIframe.vue";

@Component({
  components: {
    PublicApplicationThumbnail,
    TestApplicationGameIframe,
  },
})
export default class PublicApplicationsList extends Vue {
  @Prop({}) testApplications!: TestApplication[];

  currentApplication: TestApplication = new TestApplication();

  playPuzzle(testApplication: TestApplication) {
    this.currentApplication = testApplication;
    window.scrollTo(0, 0);
  }
}
</script>
<style lang="scss">
.public-applications-list {
  //border: 1px solid red;
  display: flex;
  align-content: center;
  justify-content: center;
  flex-flow: row wrap;
}
.play-area {
  padding: 20px;
  background: #ddd;
  margin-bottom: 100px;
}
</style>