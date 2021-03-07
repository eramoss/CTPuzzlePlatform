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
              <div class="flex-row">
                <copy-input
                  v-model="testApplication.url"
                  style="flex-grow: 1"
                />
                <el-tooltip content="Abrir tela do teste">
                  <el-button
                    style="margin-left: 20px"
                    type="text"
                    @click="accessTestApplication"
                    icon="el-icon-position"
                  >
                    Acessar
                  </el-button>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <h3>Participantes</h3>
          <el-table :data="testApplication.participations" style="margin-bottom:30px">
            <el-table-column label="Participante" prop="user.name" width="250" />
            <el-table-column label="Progresso" prop="progress"/>
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
import CopyInput from "~/components/CopyInput.vue";
import Vue from "vue";
import { Action, Component, Watch } from "nuxt-property-decorator";
import { Context } from "@nuxt/types";
import TestApplication from "~/types/TestApplication";
import Test from "~/types/Test";

@Component({
  components: {
    CopyInput,
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