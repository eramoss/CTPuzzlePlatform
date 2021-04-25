<template>
  <div>
    <div class="left panel">
      <h2>Estatísticas</h2>
      <template v-for="panel in panels">
        <statistics-test-application
          :key="panel.id"
          :test-applications="testApplications"
        />
      </template>
      <el-button @click="addStatisticsPanel">Adicionar painel de estatísticas</el-button>
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
import { v4 as uuidv4 } from "uuid";

class StatisticsPanel {
  id!: string;
}
@Component({
  components: {
    StatisticsTestApplication,
  },
})
export default class StatisticsPage extends Vue {
  testApplications!: TestApplication[];

  panels: StatisticsPanel[] = [];

  addStatisticsPanel() {
    let panel = new StatisticsPanel();
    panel.id = uuidv4();
    this.panels.push(panel);
  }

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