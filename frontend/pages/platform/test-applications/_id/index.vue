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
                :test-application="testApplication"
                style="flex-grow: 1"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <h3>Participantes ({{ testApplication.participations.length }})</h3>
          <el-table
            :data="testApplication.participations"
            style="margin-bottom: 30px"
          >
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
                <btn-remove @click="confirmRemoveParticipation(row)" />
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

@Component({
  head: {
    title: "Aplicação de teste",
  },
  components: {
    TestApplicationUrlInput,
    BtnRemove,
  },
})
export default class TestEditForm extends Vue {
  loading: boolean = false;
  testApplication: TestApplication = new TestApplication();

  async asyncData(ctx: Context) {
    let testApplication!: TestApplication;
    let id = ctx.params.id;
    testApplication = await ctx.store.dispatch("test-applications/getById", id);
    return {
      testApplication,
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

  @Action("test-applications/save") saveTestApplication!: (
    testApplication: TestApplication
  ) => Promise<TestApplication>;

  @Action("participations/removeById") removeParticipationById!: (
    id: number
  ) => Promise<TestApplication>;

  async confirmRemoveParticipation(participation: Participation) {
    try {
      let option = await this.$confirm(
        "Tem certeza de que deseja remover esta participação da aplicação? A participação do seguinte usuário será removida: " +
          participation.user.name,
        "Remover dados da participação?",
        {
          confirmButtonText: "Remover",
          cancelButtonText: "Cancelar",
          confirmButtonClass: "el-button--danger",
        }
      );
      if (option === "confirm") {
        try {
          let index = this.testApplication.participations.indexOf(
            participation
          );
          await this.removeParticipationById(participation.id);
          this.testApplication.participations.splice(index, 1);
          this.$notify({
            type: "success",
            title: "Sucesso ao remover",
            message: "A participação foi removida",
          });
        } catch (e) {
          console.error(e);
          this.$notify({
            type: "error",
            title: "Não foi possível remover a participação da aplicação",
            message: "Verifique se há algum erro ou pendência de utilização.",
          });
        }
      }
    } catch (cancel) {}
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