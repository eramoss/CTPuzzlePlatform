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
      <h2>Respostas ({{ participation.itemResponses.length }})</h2>
      <div>
        <table class="summary-table">
          <tr>
            <td>Teste</td>
            <td>{{ participation.application.test.name }}</td>
          </tr>
          <tr>
            <td>Aplicação</td>
            <td>{{ participation.application.name }}</td>
          </tr>
          <tr>
            <td>Participante</td>
            <td>{{ participation.user.name }}</td>
          </tr>
          <tr>
            <td>Respostas</td>
            <td>{{ participation.itemResponses.length }}</td>
          </tr>
          <tr v-if="participation.observations">
            <td>Observações</td>
            <td>{{ participation.observations }}</td>
          </tr>
        </table>
      </div>
      <div class="flex-row fill">
        <btn-refresh @click="loadData"></btn-refresh>
        <div>
          <btn-remove
            @click="confirmRemoveParticipation"
            title="Remover participação na aplicação do teste"
          />
          <el-tooltip
            content="Recalcula o escore para todos os itens"
            :open-delay="400"
            effect="light"
          >
            <el-button
              :loading="loading"
              size="small"
              type="warning"
              style="font-weight: bold"
              icon="el-icon-video-play"
              @click="recalculateAllResponseItems"
            >
              Recalcular escores
            </el-button>
          </el-tooltip>
        </div>
      </div>
      <div v-if="participation">
        <item-responses-screen
          :loading="loading"
          :participation="participation"
          @request-update="loadData"
        />
      </div>
      <div class="panel white shadow top-marged">
        <h2>Questionário</h2>
        <quiz-responses :quiz="participation.userDataToRequest" />
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
import QuizResponses from "~/components/QuizResponses.vue";

import { ACTION_GET_LAST_RESPONSE } from "~/store/test-applications";
import { mustRefreshLastItemResponse } from "../index.vue";

import ItemResponse from "~/types/ItemResponse";
const ACTION_GET_BY_ID = "participations/getById";

@Component({
  components: {
    ItemResponsesScreen,
    QuizResponses,
  },
})
export default class ItemResponsesList extends Vue {
  participation!: Participation;
  loading = false;
  intervalBringLastResponse!: NodeJS.Timeout;
  lastResponse!: ItemResponse;

  @Action(ACTION_GET_BY_ID) getById!: (id: any) => Promise<Participation>;
  @Action("participations/removeById") removeParticipationById!: (
    id: number
  ) => Promise<any>;

  @Action(ACTION_GET_LAST_RESPONSE) getLastResponse!: (
    tetApplicationId: any
  ) => Promise<ItemResponse>;

  @Action("participations/recalculateAllResponseItems") recalculateAll!: (
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

  async recalculateAllResponseItems() {
    this.loading = true;
    try {
      await this.recalculateAll(this.participation.id);
      this.loadData();
    } catch (e) {
      this.$notify({
        title: "A operação de cálculo fahou",
        message: e,
        type: "error",
      });
    } finally {
      this.loading = false;
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
      this.loading = true;
      this.participation = await this.getById(
        this.$route.params.participationId
      );
      this.lastResponse = await this.getLastResponse(
        this.participation.application.id
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
    } finally {
      this.loading = false;
    }
  }

  async asyncData(ctx: Context) {
    let participation: Participation = await ctx.store.dispatch(
      ACTION_GET_BY_ID,
      ctx.params.participationId
    );
    let lastResponse = await ctx.store.dispatch(
      ACTION_GET_LAST_RESPONSE,
      participation.application.id
    );
    return {
      participation,
      lastResponse,
    };
  }

  loadDataIfNotHidden() {
    if (!document.hidden) {
      this.loadData();
    }
  }

  mounted() {
    this.startIntervalUpdateLastResponse();
  }

  destroyed() {
    clearInterval(this.intervalBringLastResponse);
  }

  startIntervalUpdateLastResponse() {
    this.intervalBringLastResponse = setInterval(
      this.refreshLastResponse,
      2000
    );
  }

  async refreshLastResponse() {
    if (
      await mustRefreshLastItemResponse({
        lastResponse: this.lastResponse,
        applicationId: this.$route.params.id,
        getLastResponse: this.getLastResponse,
      })
    ) {
      this.loadData();
    }
  }
}
</script>