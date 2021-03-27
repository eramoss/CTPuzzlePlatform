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
          <el-col :span="20">
            <el-form-item label-width="100px" label="Nome">
              <el-input
                v-model="testApplication.name"
                placeholder="Avaliação Turma 3º ano"
              ></el-input>
            </el-form-item>
            <el-form-item label-width="100px" label="Teste">
              <nuxt-link
                target="_blank"
                title="Acessar teste"
                :to="`/platform/tests/${testApplication.test.id}`"
                ref="inputName"
              >
                <el-button type="text"
                  >{{ testApplication.test.name }}
                  <i class="el-icon-top-right" />
                </el-button>
              </nuxt-link>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="Link" label-width="100px">
              <test-application-url-input
                :showAccessIcon="true"
                :test-application="testApplication"
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
            <el-button
              type="primary"
              icon="el-icon-download"
              size="small"
              :loading="downloading"
              @click="download"
            >
              Baixar respostas
            </el-button>
          </div>
          <el-table
            :data="testApplication.participations"
            style="margin-bottom: 30px"
          >
            <el-table-column label="Dt.Criação" width="150">
              <template slot-scope="{ row }">
                {{ dateFormat.fromNow(row.createdAt) }}
              </template>
            </el-table-column>
            <el-table-column
              label="Participante"
              prop="user.name"
              width="250"
            />
            <el-table-column label="Código do usuário" prop="user.hash" />
            <el-table-column label="Respostas" width="200">
              <template slot-scope="{ row }">
                <nuxt-link :to="`${$route.path}/responses/${row.id}`">
                  <el-button type="text" v-show="row.itemResponses.length">
                    {{ row.itemResponses.length }} respostas
                  </el-button>
                </nuxt-link>
              </template>
            </el-table-column>
            <el-table-column width="220">
              <template slot-scope="{ row }">
                <btn-remove @click="removeParticipation(row)" />
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

const ACTION_GET_BY_ID = "test-applications/getById";
const ACTION_GET_LAST_RESPONSE = "test-applications/getLastResponse";

@Component({
  head: {
    title: "Aplicação de teste",
  },
  components: {
    SnackBarRemove,
    TestApplicationUrlInput,
    BtnRemove,
  },
})
export default class TestEditForm extends Vue {
  loading: boolean = false;
  testApplication: TestApplication = new TestApplication();
  lastResponse: ItemResponse = new ItemResponse();
  downloading: boolean = false;
  @Ref() snackBar!: SnackBarRemove;
  dateFormat = new DateFormat();

  @Action(ACTION_GET_BY_ID) getApplicationById!: (
    id: any
  ) => Promise<TestApplication>;

  @Action(ACTION_GET_LAST_RESPONSE) getLastResponse!: (
    id: any
  ) => Promise<ItemResponse>;

  @Action("test-applications/save") saveTestApplication!: (
    testApplication: TestApplication
  ) => Promise<TestApplication>;

  @Action("test-applications/generateItemResponsesCsv")
  generateItemResponsesCsv!: (testApplicationId: number) => Promise<any>;

  async asyncData(ctx: Context) {
    let testApplication!: TestApplication;
    let lastResponse!: ItemResponse;
    let id = ctx.params.id;
    testApplication = await ctx.store.dispatch(ACTION_GET_BY_ID, id);
    lastResponse = await ctx.store.dispatch(ACTION_GET_LAST_RESPONSE, id);
    return {
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
}
</script>