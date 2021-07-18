<template>
  <color-panel
    :loading="loading"
    icon="checklist"
    label="Respostas"
    link="/platform/test-applications"
    :data="total"
    textColor="#FF7F0E"
    color="#FFDAB9"
    :showInfo="true"
  >
    <template slot="info">
      Total de respostas informadas a itens de testes
    </template>
  </color-panel>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "nuxt-property-decorator";
import ColorPanel from "~/components/ColorPanel.vue";
import { ACTION_GET_TOTAL_RESPONSES } from "~/store/item-responses";
@Component({
  components: {
    ColorPanel,
  },
})
export default class PanelTotalResponses extends Vue {
  total: any = "...";
  @Prop() researchGroupId!: number;
  loading = true;

  async mounted() {
    try {
      this.loading = true;
      this.total = await this.$store.dispatch(
        ACTION_GET_TOTAL_RESPONSES,
        this.researchGroupId
      );
    } catch (e) {
      this.total = "Indisponível";
    } finally {
      this.loading = false;
    }
  }
}
</script>