<template>
  <el-dialog title="Aplicar teste" :visible.sync="visible">
    <el-form label-position="left" label-width="130px">
      <el-form-item label="Nome aplicação">
        <el-input
          v-model="testApplication.name"
          placeholder="Ex.: Aplicação da turma 3º ano"
          ref="firstInput"
        />
      </el-form-item>
      <el-form-item label="Link do teste">
        <copy-input
          v-model="applicationUrl"
          placeholder="Informe o nome da aplicação para gerar o link"
        />
      </el-form-item>
    </el-form>
    <el-button
      title="Acessar lista de aplicações"
      :disabled="!getQuantityApplicationsText(testApplication.test).enabled"
      @click="
        $router.push(
          `/platform/test-applications?test=${testApplication.test.id}`
        )
      "
      type="text"
    >
      {{ getQuantityApplicationsText(testApplication.test).text }}
    </el-button>
    <div slot="footer">
      <el-button
        @click="createApplication"
        :loading="creatingApplication"
        icon="el-icon-s-promotion"
        type="success"
        :disabled="!isStateValid"
        >Iniciar aplicação</el-button
      >
    </div>
  </el-dialog>
</template>
<script lang="ts">
import Vue from "vue";
import { Action, Component, Prop, Ref, Watch } from "nuxt-property-decorator";
import Test from "~/types/Test";
import { ElInput } from "element-ui/types/input";
import CopyInput from "~/components/CopyInput.vue";
import TestApplication from "~/types/TestApplication";

//@ts-ignore
import { v4 as uuidv4 } from "uuid";

@Component({
  components: {
    CopyInput,
  },
})
export default class TestApplicationDialog extends Vue {
  visible: boolean = false;
  creatingApplication: boolean = false;
  testApplication: TestApplication = new TestApplication();

  @Ref("firstInput") firstInput!: ElInput;
  puzzleUrl!: string;

  get isStateValid() {
    return this.testApplication.name.length > 0;
  }

  async open(test: Test) {
    this.testApplication = new TestApplication();
    this.puzzleUrl = await this.getPuzzleBaseUrl(test.id);
    this.testApplication.hash = uuidv4();
    this.testApplication.test = test;
    this.visible = true;
    this.$nextTick(() => {
      this.firstInput?.focus();
    });
  }

  @Action("tests/getPuzzleBaseUrl") getPuzzleBaseUrl!: (
    testId: number
  ) => Promise<string>;

  @Action("test-applications/save") saveApplication!: (
    testApplication: TestApplication
  ) => Promise<TestApplication>;

  async createApplication() {
    this.creatingApplication = true;
    setTimeout(async () => {
      try {
        this.testApplication.url = this.applicationUrl;
        this.testApplication = await this.saveApplication(this.testApplication);
        this.$notify({
          type: "success",
          title: "Sucesso ao publicar",
          message: "Envie o link do teste para os participantes",
        });
        this.$router.push(
          "/platform/test-applications/" + this.testApplication.id
        );
      } catch (e) {
        this.$notify({
          type: "error",
          title: "Erro ao publicar",
          message: "Ocorreu um problema ao iniciar a aplicação do teste",
        });
      } finally {
        this.creatingApplication = false;
      }
    }, 2000);
  }

  get applicationUrl(): string {
    let applicationName = this.testApplication.name.replace(
      /[^A-Za-z0-9]/g,
      ""
    );
    let url = "";
    let baseUrl = this.$axios.defaults.baseURL;
    if (applicationName.length) {
      url = `${this.puzzleUrl}?op=application&hash=${this.testApplication.hash}&baseUrl=${baseUrl}`;
    }
    return url;
  }

  getQuantityApplicationsText(test: Test): { enabled: boolean; text: string } {
    let total = test.applications.length;
    let enabled = false;
    let text = "Esse teste ainda não foi aplicado";
    if (total > 0) {
      enabled = true;
      text = `Esse teste já tem ${total} aplicações`;
    }
    return { enabled, text };
  }
}
</script>