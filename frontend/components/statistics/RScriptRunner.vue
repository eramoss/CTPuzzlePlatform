<template>
  <div></div>
</template>
<script lang="ts">
import Vue from "vue";
import { Action, Component, Prop } from "nuxt-property-decorator";
import { ACTION_R_RUN_SCRIPT } from "~/store/r";
@Component
export default class RScriptRunner extends Vue {
  @Action(ACTION_R_RUN_SCRIPT) callControler!: (payload: {
    script: string;
    csv: string;
    separator: string;
    dataVarName: string;
  }) => Promise<string>;

  response = "";

  async run(payload: {
    script: string;
    csv: string;
    separator: string;
    dataVarName: string;
  }): Promise<string> {
    this.response = await this.callControler(payload);
    console.log(this.response);
    return this.response;
  }
}
</script>