<template>
  <div>
    <el-tooltip
      :content="
        visibility
          ? 'Público: visível no site'
          : 'Privado: visísvel somente a quem receber o link de aplicação'
      "
      placement="top"
    >
      <el-switch
        @change="onChangeValue"
        v-model="visibility"
        active-color="#13ce66"
        inactive-color="#ff4949"
        active-visibility="PUBLIC"
        inactive-visibility="PRIVATE"
        active-text="Público"
        inactive-text="Privado"
      >
      </el-switch>
    </el-tooltip>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Action, Component, Prop, Watch } from "nuxt-property-decorator";
import { Context } from "@nuxt/types";
import TestApplication, {
  TestApplicationVisibility,
} from "~/types/TestApplication";
import { ACTION_UPDATE_VISIBILITY } from "~/store/test-applications";

@Component
export default class SwitchTestApplicationVisibility extends Vue {
  @Prop({}) testApplication!: TestApplication;
  visibility: boolean = false;

  @Action(ACTION_UPDATE_VISIBILITY)
  updateVisibility!: (testApplication: TestApplication) => any;

  @Watch("testApplication", { immediate: true })
  onChangeTestApplication() {
    this.visibility = this.testApplication?.visibility == "PUBLIC";
  }

  get visibilityName(): TestApplicationVisibility {
    return this.visibility ? "PUBLIC" : "PRIVATE";
  }

  async onChangeValue() {
    try {
      if (this.testApplication) {
        this.testApplication.visibility = this.visibilityName;
        await this.updateVisibility(this.testApplication);
        this.$notify({
          type: "success",
          message: "A visibilidade foi alterada",
          title: `O teste foi tornado ${
            this.visibility ? "público" : "privado"
          }`,
        });
      }
    } catch (e) {
      this.$notify.error("Não foi possível alterar");
    }
  }
}
</script>