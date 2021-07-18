<template>
  <div>
    <color-panel
      :loading="loading"
      icon="score"
      label="Escore médio"
      link="/platform/test-applications"
      :data="avgScorePercent + '%'"
      textColor="#2CA02C"
      color="#AEDBAE"
      :showInfo="true"
    >
      <template slot="info">
        Escore médio percentual de todas as participações
      </template>
    </color-panel>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "nuxt-property-decorator";
import ColorPanel from "~/components/ColorPanel.vue";
import { ACTION_AVG_SCORE } from "~/store/item-responses";
@Component({
  components: {
    ColorPanel,
  },
})
export default class PanelAvgScore extends Vue {
  avgScorePercent: any = "...";
  @Prop() researchGroupId!: number;
  loading = true;

  async mounted() {
    try {
      this.loading = true;
      this.avgScorePercent = await this.$store.dispatch(
        ACTION_AVG_SCORE,
        this.researchGroupId
      );
    } catch (e) {
      this.avgScorePercent = "Indisponível";
    } finally {
      this.loading = false;
    }
  }
}
</script>