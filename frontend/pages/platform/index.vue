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
      <color-panel
        icon="el-icon-warning"
        label="Mecânicas"
        link="/platform/mechanics"
        info="12"
        color="#61C096"
      />
      <color-panel
        icon="el-icon-warning"
        label="Mecânicas"
        link="/platform/mechanics"
        info="12"
        textColor="#68798C"
        color="#DBDDE1"
      />
      <color-panel
        icon="el-icon-warning"
        label="Mecânicas"
        link="/platform/mechanics"
        info="12"
        textColor="#68798C"
        color="#DBDDE1"
      />
    </div>

    <div class="start flex-row"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import ColorPanel from "~/components/ColorPanel.vue";
import { Context } from "@nuxt/types";
import DashboardTitle from "~/components/DashboardTitle.vue";
import PanelTotalParticipations from "~/components/dashboard/PanelTotalParticipations.vue";
import PanelTotalResponses from "~/components/dashboard/PanelTotalResponses.vue";
import PanelAvgScore from "~/components/dashboard/PanelAvgScore.vue";
@Component({
  components: {
    ColorPanel,
    DashboardTitle,
    PanelTotalParticipations,
    PanelTotalResponses,
    PanelAvgScore,
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
