<template>
  <div class="left">
    <div>
      <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/platform' }"
          >Plataforma</el-breadcrumb-item
        >
        <el-breadcrumb-item :to="{ path: '/platform/mechanics' }"
          >Mecânicas</el-breadcrumb-item
        >
        <el-breadcrumb-item :to="`/platform/mechanics/${mechanic.id}`">{{
          mechanic.name
        }}</el-breadcrumb-item>
        <el-breadcrumb-item>Casos de teste</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="panel">
        <h2>Casos de teste</h2>
        <score-function-test-form v-model="mechanic" :showTestCases="true" />
        <btn-save @click="save" :loading="saving"></btn-save>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Action, Component, Prop } from "nuxt-property-decorator";
import Mechanic from "~/types/Mechanic";
import { Context } from "@nuxt/types";
import ScoreFunctionTestForm from "~/components/ScoreFunctionTestForm.vue";
import CodeEditor from "~/components/CodeEditor.vue";

@Component({
  components: {
    CodeEditor,
    ScoreFunctionTestForm,
  },
})
export default class ScoreFunctionTestCases extends Vue {
  mechanic!: Mechanic;
  saving = false;

  @Action("mechanics/save") saveMechanic!: (
    mechanic: Mechanic
  ) => Promise<Mechanic>;

  async save() {
    this.saving = true;
    try {
      await this.saveMechanic(this.mechanic);
      this.$notify({
        title: "Casos de testes salvos com sucesso",
        message: "Os casos de teste foram registrados",
        type: "success",
      });
    } catch (e) {
      this.$notify({ title: "Erro ao salvar", message: e, type: "error" });
    } finally {
      this.saving = false;
    }
    //this.$router.go(-1);
  }

  async asyncData(ctx: Context) {
    const id = ctx.params.mechanicId;
    const mechanic = await ctx.store.dispatch("mechanics/getById", id);
    return {
      mechanic,
    };
  }
}
</script>