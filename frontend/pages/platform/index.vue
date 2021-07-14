<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/platform' }">
        Plataforma
      </el-breadcrumb-item>
    </el-breadcrumb>
    <dashboard-title>Dados da Plataforma</dashboard-title>
    <div class="start flex-row">
      <panel-total-participations :researchGroupId="researchGroupId" />
      <panel-total-responses :researchGroupId="researchGroupId" />
      <panel-avg-score :researchGroupId="researchGroupId" />
    </div>
    <div>
      <el-row :gutter="20">
        <el-col :md="8">
          <panel-items-avg header="Escore médio por item" :sort="'ascending'" />
        </el-col>
      </el-row>
    </div>

    <div class="start flex-row"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import ColorPanel from "~/components/ColorPanel.vue";
import DashboardTitle from "~/components/DashboardTitle.vue";
import PanelTotalParticipations from "~/components/dashboard/PanelTotalParticipations.vue";
import PanelTotalResponses from "~/components/dashboard/PanelTotalResponses.vue";
import PanelAvgScore from "~/components/dashboard/PanelAvgScore.vue";
import PanelItemsAvg from "~/components/dashboard/PanelItemsAvgScore.vue";
@Component({
  components: {
    ColorPanel,
    DashboardTitle,
    PanelTotalParticipations,
    PanelTotalResponses,
    PanelAvgScore,
    PanelItemsAvg,
  },
})
export default class PlatformDashboard extends Vue {
  get researchGroupId(): number {
    let researchGroup = this.$auth.user?.researchGroup;
    let id = 0;
    if (researchGroup) {
      //@ts-ignore
      id = researchGroup.id;
    }
    return id;
  }
}
</script>

<style lang="scss">
</style>
