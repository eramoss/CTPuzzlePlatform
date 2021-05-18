<template>
  <div>
    <div class="left panel">
      <h2>Estatísticas</h2>
      
      <!-- Teste: {{ test }}
      <el-button @click="changeTest">Change test</el-button>
       -->

      <template v-for="panel in panels">
        <statistics-test-application
          v-if="panel"
          @onRemove="removePanel(panel)"
          :value="panel"
          @input="updatePanel"
          class="top-marged"
          :key="panel.id"
          :test-applications="testApplications"
        />
      </template>
    </div>
    <div class="top-marged">
      <el-button @click="addStatisticsPanel" type="primary">
        Adicionar painel de estatísticas
      </el-button>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Getter, namespace, State } from "nuxt-property-decorator";
import { Context } from "@nuxt/types";
import TestApplication from "~/types/TestApplication";
import StatisticsTestApplication from "~/components/StatisticsTestApplication.vue";
import { PageRequest, PageResponse } from "~/types/pagination";
import { ACTION_PAGINATE_APPLICATIONS } from "~/store/test-applications";

import StatisticsPanel from "~/types/StatisticsPanel";

const statistics = namespace("statistics");

@Component({
  components: {
    StatisticsTestApplication,
  },
})
export default class StatisticsPage extends Vue {
  testApplications!: TestApplication[];

  @statistics.State test!: string;
  @statistics.Mutation setTest!: (value: string) => void;

  @statistics.Mutation addPanel!: () => void;
  @statistics.Mutation rmPanel!: (panel: StatisticsPanel) => void;
  @statistics.Mutation storeUpdatePanel!: (panel: StatisticsPanel) => void;
  @statistics.State panels!: StatisticsPanel[];

  updatePanel(panel: StatisticsPanel) {
    this.storeUpdatePanel(panel);
  }

  removePanel(panel: StatisticsPanel) {
    this.rmPanel(panel);
  }

  changeTest() {
    this.setTest("cenoura");
  }

  addStatisticsPanel() {
    this.addPanel();
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