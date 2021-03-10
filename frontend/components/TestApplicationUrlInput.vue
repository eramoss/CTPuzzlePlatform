<template>
  <copy-input
    v-model="applicationUrl"
    placeholder="Informe o nome da aplicação para gerar o link"
  />
</template>
<script lang="ts">
import Vue from "vue";
import { Action, Component, Prop, Watch } from "nuxt-property-decorator";
import TestApplication from "~/types/TestApplication";
import CopyInput from "~/components/CopyInput.vue";

@Component({
  components: {
    CopyInput,
  },
})
export default class TestApplicationUrlInput extends Vue {
  @Prop() testApplication!: TestApplication;
  puzzleUrl: string = "";

  queryString(params: any) {
    return Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join("&");
  }

  @Action("tests/getPuzzleBaseUrl") getPuzzleBaseUrl!: (
    testId: number
  ) => Promise<string>;

  @Watch("testApplication", { deep: true, immediate: true })
  async onChangeTestApplication() {
    const test = this.testApplication.test;
    if (test && test.id) {
      this.puzzleUrl = await this.getPuzzleBaseUrl(test.id);
    }
  }

  get applicationUrl(): string {
    let applicationName = this.testApplication.name.replace(
      /[^A-Za-z0-9]/g,
      ""
    );
    let url = "";
    if (applicationName.length) {
      let baseUrl = this.$axios.defaults.baseURL;
      let hash = this.testApplication.hash;
      let params = {
        op: "application",
        hash: hash,
        baseUrl: baseUrl,
        dataUrl: `${baseUrl}/test-applications/data/${hash}`,
      };
      url = `${this.puzzleUrl}?${this.queryString(params)}`;
    }
    return url;
  }
}
</script>
