<template>
  <div class="left">
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/platform' }">
        Plataforma
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/platform/test-applications' }">
        Aplicações
      </el-breadcrumb-item>
      <el-breadcrumb-item
        :to="{ path: `/platform/test-applications/${$route.params.id}` }"
      >
        {{ participation.application.name }}
      </el-breadcrumb-item>
      <el-breadcrumb-item> Respostas </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="panel">
      <h2>Respostas</h2>
      <div class="flex-row fill">
        <btn-refresh @click="loadData"></btn-refresh>
        <btn-remove @click="confirmRemoveParticipation" title="Remover participação na aplicação do teste"></btn-remove>
      </div>
      <div v-if="participation">
        <item-responses-screen :participation="participation" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Action } from "nuxt-property-decorator";
import { Context } from "@nuxt/types";
import Participation from "~/types/Participation";
import ItemResponsesScreen from "~/components/ItemResponsesScreen.vue";
const ACTION_GET_BY_ID = "participations/getById";

@Component({
  components: {
    ItemResponsesScreen,
  },
})
export default class ItemResponsesList extends Vue {
  participation!: Participation;

  @Action(ACTION_GET_BY_ID) getById!: (id: any) => Promise<Participation>;
  @Action("participations/removeById") removeParticipationById!: (
    id: number
  ) => Promise<any>;

  async confirmRemoveParticipation() {
    try {
      let option = await this.$confirm(
        `Tem certeza de que deseja remover a participação? <br>
        A participação do seguinte usuário será removida:<br>
        Usuário: ${this.participation.user.name} <br>
        Código da participação: ${this.participation.id}
        `,
        "Remover participação?",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "Remover",
          cancelButtonText: "Cancelar",
          confirmButtonClass: "el-button--danger",
        }
      );
      if (option === "confirm") {
        this.removeParticipation();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async removeParticipation() {
    try {
      await this.removeParticipationById(this.participation.id);
      this.$notify.success({
        title: "A participação foi removida",
        message: "Sucesso ao remover",
      });
      this.$router.go(-1);
    } catch (e) {
      this.$notify({
        type: "error",
        title: "Não foi possível remover",
        message: "Não foi possível remover",
      });
    }
  }

  async loadData() {
    try {
      this.participation = await this.getById(
        this.$route.params.participationId
      );
      this.$notify({
        type: "success",
        title: "As informações foram atualizadas",
        message: "Os dados foram carregados",
      });
    } catch (e) {
      console.error(e);
      this.$notify({
        type: "error",
        title: "Não foi possível carregar os dados",
        message:
          "Não foi possível carregar os detalhes da participação no testes",
      });
    }
  }

  async asyncData(ctx: Context) {
    let participation = await ctx.store.dispatch(
      "participations/getById",
      ctx.params.participationId
    );
    return {
      participation,
    };
  }
}
</script>