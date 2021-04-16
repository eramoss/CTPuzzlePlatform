<template>
  <div>
    <div class="left panel">
      <h2>Estatísticas</h2>
      <statistics-test-application :test-applications="testApplications" />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "nuxt-property-decorator";
import { Context } from "@nuxt/types";
import TestApplication from "~/types/TestApplication";
import StatisticsTestApplication from "~/components/StatisticsTestApplication.vue";
import { PageRequest, PageResponse } from "~/types/pagination";
import { ACTION_PAGINATE_APPLICATIONS } from "~/store/test-applications";
@Component({
  components: {
    StatisticsTestApplication,
  },
})
export default class StatisticsPage extends Vue {
  testApplications!: TestApplication[];
  
  async asyncData(ctx: Context) {
    let pageRequest = new PageRequest({});
    let researchGroup = ctx.$auth.user?.researchGroup;
    if (ctx.$auth.user?.researchGroup) {
      //@ts-ignore
      pageRequest.andWhere = "test.researchGroup.id = " + researchGroup.id;
    }
    let pageResponse: PageResponse<TestApplication> = await ctx.store.dispatch(
      ACTION_PAGINATE_APPLICATIONS,
      pageRequest
    );
    let testApplications = pageResponse.data;
    return {
      testApplications,
    };
  }
}
</script>