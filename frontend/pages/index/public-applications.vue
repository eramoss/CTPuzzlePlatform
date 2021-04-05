<template>
  <div>
    <container>
      <section>
        <h2 class="title">Testes públicos</h2>
      </section>
      <PublicApplicationsList :test-applications="testApplications" />
    </container>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "nuxt-property-decorator";
import { Context } from "@nuxt/types";
import PublicApplicationsList from "~/components/PublicApplicationsList.vue";
import TestApplication from "~/types/TestApplication";
@Component({
  auth: false,
  scrollToTop: true,
  components: {
    PublicApplicationsList,
  },
})
export default class extends Vue {
  testApplications!: TestApplication[];

  async asyncData(ctx: Context) {
    const testApplications: TestApplication[] = await ctx.store.dispatch(
      "test-applications/getPuplicApplications"
    );
    return {
      testApplications,
    };
  }
}
</script>