<template>
  <color-panel
    :loading="loading"
    icon="groups"
    label="Participações"
    link="/platform/test-applications"
    :data="totalParticipations"
    textColor="#1F77B4"
    :showInfo="true"
    color="#BAD5E8"
  >
    <template slot="info">
      Total de participações válidas em todos os testes
    </template>
  </color-panel>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "nuxt-property-decorator";
import ColorPanel from "~/components/ColorPanel.vue";
import { ACTION_GET_TOTAL_PARTICIPATIONS } from "~/store/participations";
@Component({
  components: {
    ColorPanel,
  },
})
export default class PanelTotalParticipations extends Vue {
  totalParticipations: any = "...";
  @Prop() researchGroupId!: number;
  loading = true;

  async mounted() {
    try {
      this.loading = true;
      this.totalParticipations = await this.$store.dispatch(
        ACTION_GET_TOTAL_PARTICIPATIONS,
        this.researchGroupId
      );
    } catch (e) {
      this.totalParticipations = "Indisponível";
    } finally {
      this.loading = false;
    }
  }
}
</script>