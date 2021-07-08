<template>
  <div class="left">
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/platform' }"
        >Plataforma</el-breadcrumb-item
      >
      <el-breadcrumb-item :to="{ path: '/platform/test-applications' }"
        >Aplicações</el-breadcrumb-item
      >
      <el-breadcrumb-item>Aplicação de teste</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="panel">
      <h2>Aplicação de teste</h2>
      <el-form>
        <el-row>
          <el-col :span="22">
            <el-form-item label-width="170px" label="Nome">
              <el-input
                v-model="testApplication.name"
                placeholder="Avaliação Turma 3º ano"
              ></el-input>
            </el-form-item>
            <el-form-item
              prop="description"
              label="Descrição e observações"
              title="Descrição e observações"
              label-width="170px"
            >
              <el-input
                type="textarea"
                v-model="testApplication.description"
                autofocus
                placeholder="Informações e observações sobre a aplicação"
              ></el-input>
            </el-form-item>
            <el-form-item label-width="170px" label="Teste">
              <nuxt-link
                title="Acessar teste"
                :to="`/platform/tests/${testApplication.test.id}`"
                ref="inputName"
              >
                <el-button type="text"
                  >{{ testApplication.test.name }}
                </el-button>
              </nuxt-link>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label-width="170px">
              <template slot="label">
                <div class="flex-row end">
                  Grupo de controle
                  <tooltip-info
                    style="margin-left: 5px"
                    tooltip="O grupo de controle é uma aplicação em que o participante pode ser direcionado aleatoriamente"
                  />
                </div>
              </template>
              <el-select
                @clear="clearControlGroup"
                :clearable="true"
                :filterable="true"
                placeholder="O grupo de controle é uma aplicação para a qual o participante pode ser direcionado aleatoriamente"
                v-model="testApplication.controlApplication"
                value-key="id"
              >
                <el-option
                  :key="application.id"
                  v-for="application in applications"
                  :value="application"
                  :label="application.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="Visibilidade" label-width="170px">
              <switch-test-application-visibility
                :test-application="testApplication"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="22">
            <el-form-item label="Link" label-width="170px">
              <test-application-url-input
                :showAccessIcon="true"
                :test-application.sync="testApplication"
                style="flex-grow: 1"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <h3>Participações ({{ testApplication.participations.length }})</h3>
          <h3 v-if="lastResponse">
            Última resposta: {{ lastResponse.participation.user.name }},
            {{ dateFormat.fromNow(lastResponse.createdAt) }}
          </h3>
          <div class="flex-row">
            <btn-refresh @click="loadData"></btn-refresh>
            <span>
              <el-button
                size="small"
                :loading="recalculating"
                type="warning"
                @click="recalculateAllParticipationsScores"
              >
                Recalcular escores de todas as participações
              </el-button>
              <el-button
                type="primary"
                icon="el-icon-download"
                size="small"
                :loading="downloading"
                @click="download"
              >
                Baixar respostas
              </el-button>
            </span>
          </div>
          <el-table
            :data="testApplication.participations"
            style="margin-bottom: 30px"
          >
            <el-table-column label="Quando" width="150">
              <template slot-scope="{ row }">
                {{ dateFormat.fromNow(row.createdAt) }}
              </template>
            </el-table-column>
            <el-table-column label="Participante" prop="user.name" />
            <el-table-column label="Fonte" prop="source" />
            <!-- <el-table-column label="Código do usuário" prop="user.hash" /> -->
            <el-table-column label="Respostas" width="200">
              <template slot-scope="{ row }">
                <nuxt-link :to="`${$route.path}/responses/${row.id}`">
                  <el-button type="text" v-show="row.itemResponses.length">
                    {{ row.itemResponses.length }} respostas
                  </el-button>
                </nuxt-link>
              </template>
            </el-table-column>
            <el-table-column width="150" label="Remover">
              <template slot-scope="{ row }">
                <btn-remove @click="removeParticipation(row)" />
              </template>
            </el-table-column>
            <el-table-column width="200" label="Anotações">
              <template slot-scope="{ row }">
                <add-observations-btn
                  @save="saveParticipation(row)"
                  :value.sync="row.observations"
                ></add-observations-btn>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row>
          <el-col>
            <btn-save @click="save" :loading="loading" />
            <btn-back @click="back" />
          </el-col>
        </el-row>
      </el-form>
      <snack-bar-remove
        ref="snackBar"
        remove-action="participations/softDeleteById"
        restore-action="participations/restore"
        @onRestore="loadData"
      />
    </div>
  </div>
</template>
<script lang="ts">
import TestApplicationUrlInput from "~/components/TestApplicationUrlInput.vue";
import Vue from "vue";
import { Action, Component, Ref, Watch } from "nuxt-property-decorator";
import { Context } from "@nuxt/types";
import TestApplication from "~/types/TestApplication";
import Test from "~/types/Test";
import Participation from "~/types/Participation";
import BtnRemove from "~/components/BtnRemove.vue";
import SnackBarRemove from "~/components/SnackBarRemove.vue";
import { DateFormat } from "~/utils/DateFormat";
import ItemResponse from "~/types/ItemResponse";
import AddObservationsBtn from "~/components/AddObservationsBtn.vue";
import SwitchTestApplicationVisibility from "~/components/SwitchTestApplicationVisibility.vue";
import { ACTION_SAVE_PARTICIPATION } from "~/store/participations";

const ACTION_GET_BY_ID = "test-applications/getById";

import {
  ACTION_GET_LAST_RESPONSE,
  ACTION_GENERATE_CSV,
  ACTION_SAVE_TEST_APPLICATION,
  ACTION_RECALCULATE_ALL_APPLICATION_SCORES,
  ACTION_GET_APPLICATIONS,
} from "~/store/test-applications";

@Component({
  head: {
    title: "Aplicação de teste",
  },
  components: {
    SwitchTestApplicationVisibility,
    AddObservationsBtn,
    SnackBarRemove,
    TestApplicationUrlInput,
    BtnRemove,
  },
})
export default class ApplicationEditForm extends Vue {
  loading: boolean = false;
  testApplication: TestApplication = new TestApplication();
  lastResponse: ItemResponse = new ItemResponse();
  applications: TestApplication[] = [];
  downloading: boolean = false;
  recalculating: boolean = false;
  @Ref() snackBar!: SnackBarRemove;
  dateFormat = new DateFormat();

  @Action(ACTION_GET_BY_ID) getApplicationById!: (
    id: any
  ) => Promise<TestApplication>;

  @Action(ACTION_GET_LAST_RESPONSE) getLastResponse!: (
    id: any
  ) => Promise<ItemResponse>;

  @Action(ACTION_SAVE_PARTICIPATION) saveParticipation!: (
    participation: Participation
  ) => Promise<any>;

  @Action(ACTION_SAVE_TEST_APPLICATION) saveTestApplication!: (
    testApplication: TestApplication
  ) => Promise<TestApplication>;

  @Action(ACTION_GENERATE_CSV)
  generateItemResponsesCsv!: (testApplicationId: number) => Promise<any>;

  @Action(ACTION_RECALCULATE_ALL_APPLICATION_SCORES)
  recalculateScores!: (testApplication: TestApplication) => Promise<any>;

  intervalBringLastResponse!: NodeJS.Timeout;

  async asyncData(ctx: Context) {
    let testApplication!: TestApplication;
    let lastResponse!: ItemResponse;
    let id = ctx.params.id;
    testApplication = await ctx.store.dispatch(ACTION_GET_BY_ID, id);
    lastResponse = await ctx.store.dispatch(ACTION_GET_LAST_RESPONSE, id);
    let applications = await ctx.store.dispatch(ACTION_GET_APPLICATIONS);
    return {
      applications,
      testApplication,
      lastResponse,
    };
  }

  get test(): Test {
    let test = new Test();
    if (this.testApplication) {
      if (this.testApplication.test) {
        test = this.testApplication.test;
      }
    }
    return test;
  }

  clearControlGroup() {
    this.testApplication.controlApplication = null;
  }

  accessTestApplication() {
    window.open(this.testApplication.url, "_blank");
  }

  back() {
    this.$router.go(-1);
  }

  async loadData() {
    try {
      let id = this.$route.params.id;
      this.testApplication = await this.getApplicationById(id);
      this.lastResponse = await this.getLastResponse(id);
      this.$notify({
        type: "success",
        title: "As informações foram atualizadas",
        message: "Os dados foram carregados",
      });
    } catch (e) {
      console.error(e);
      this.$notify({
        title: "Não foi possível carregar as participações",
        message: "Não foi possível carregar a os dados da aplicação do teste",
      });
    }
  }

  async removeParticipation(participation: Participation) {
    await this.snackBar.remove(participation.id);
    this.loadData();
  }

  async recalculateAllParticipationsScores() {
    this.recalculating = true;
    try {
      this.$notify.warning({
        title: "Aguarde...",
        message: "O cálculo dos escores foi iniciado...",
        duration: 5000,
      });
      await this.recalculateScores(this.testApplication);
      this.$notify.success({
        title: "Pronto!",
        message: "O cálculo dos escores foi concluído!",
        duration: 5000,
      });
    } catch (e) {
      this.$notify.error({
        title: "Não foi possível recalcular os escores",
        message: "Ocorreu um erro interno durante a geração",
      });
    } finally {
      this.recalculating = false;
    }
  }

  async download() {
    try {
      this.downloading = true;
      await this.generateItemResponsesCsv(this.testApplication.id);
    } catch (e) {
      this.$notify.error({
        title: "Não foi possível gerar o arquivo",
        message: "Ocorreu um erro interno durante a geração",
      });
    } finally {
      this.downloading = false;
    }
  }

  async save() {
    try {
      this.loading = true;
      this.testApplication = await this.saveTestApplication(
        this.testApplication
      );
      this.$notify({
        type: "success",
        title: "As alterações foram registradas",
        message: "As modificações realizadas na aplicação foram salvas",
      });
    } catch (e) {
      console.error(e);
      this.$notify({
        type: "error",
        title: "Erro ao salvar",
        message: "Não foi possível salvar a aplicação",
      });
    } finally {
      this.loading = false;
    }
  }

  mounted() {
    //this.startIntervalUpdateLastResponse();
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

export async function mustRefreshLastItemResponse(args: {
  lastResponse: ItemResponse;
  applicationId: any;
  getLastResponse: (applicationId: any) => Promise<ItemResponse>;
}) {
  let applicationId = args.applicationId;
  let lastResponse = await args.getLastResponse(applicationId);
  let blinkAudio = new Audio("/audios/blink.mp3");
  if (lastResponse.id) {
    if (!args.lastResponse || lastResponse.id != args.lastResponse.id) {
      blinkAudio.play();
      return true;
    }
  }
}
</script>