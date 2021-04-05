<template>
  <el-dialog title="Aplicar teste" :visible.sync="visible">
    <el-form label-position="left" label-width="140px">
      <el-form-item label="Teste">
        <el-select
          placeholder="Selecione o teste a ser aplicado"
          v-model="testApplication.test"
          value-key="id"
          ref="selectTests"
        >
          <el-option
            v-for="test in tests"
            :key="test.id"
            :value="test"
            :label="test.name"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Nome aplicação">
        <el-input
          v-model="testApplication.name"
          placeholder="Ex.: Aplicação da turma 3º ano"
          ref="firstInput"
        />
      </el-form-item>
      <el-form-item label="Link da aplicação" v-show="false">
        <test-application-url-input
          ref="applicationUrlInput"
          :test-application="this.testApplication"
        />
      </el-form-item>

      <el-form-item label="Visibilidade">
        <el-tooltip
          :content="
            testApplication.visibility == 'PUBLIC'
              ? 'Público: visível no site'
              : 'Privado: visísvel somente a quem receber o link de aplicação'
          "
          placement="top"
        >
          <el-switch
            v-model="testApplication.visibility"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="PUBLIC"
            inactive-value="PRIVATE"
            active-text="Público"
            inactive-text="Privado"
          >
          </el-switch>
        </el-tooltip>
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
import TestApplicationUrlInput from "~/components/TestApplicationUrlInput.vue";
import TestApplication from "~/types/TestApplication";

//@ts-ignore
import { v4 as uuidv4 } from "uuid";
import { ElSelect } from "element-ui/types/select";

@Component({
  components: {
    TestApplicationUrlInput,
  },
})
export default class TestApplicationDialog extends Vue {
  visible: boolean = false;
  creatingApplication: boolean = false;
  testApplication: TestApplication = new TestApplication();

  @Ref("firstInput") firstInput!: ElInput;
  @Ref("selectTests") selectTests!: ElSelect;
  tests: Test[] = [];

  get isStateValid() {
    return (
      this.testApplication.name.length > 0 &&
      this.testApplication.test &&
      this.testApplication.test.id
    );
  }

  async open(test: Test = new Test()) {
    this.tests = await this.findAllTests();
    this.testApplication = new TestApplication();
    this.testApplication.hash = uuidv4();
    this.testApplication.test = test;
    this.visible = true;
    this.$nextTick(() => {
      if (this.testApplication.test) {
        this.firstInput?.focus();
      }
      if (this.testApplication.test) {
        this.selectTests.focus();
      }
    });
  }

  @Ref("applicationUrlInput") applicationUrlInput!: TestApplicationUrlInput;

  @Action("tests/findAll") findAllTests!: () => Promise<Test[]>;
  @Action("test-applications/save") saveApplication!: (
    testApplication: TestApplication
  ) => Promise<TestApplication>;

  async createApplication() {
    this.creatingApplication = true;
    setTimeout(async () => {
      try {
        this.testApplication.url = this.applicationUrlInput.applicationUrl;
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
    }, 1000);
  }

  async mounted() {
    this.tests = await this.findAllTests();
  }

  getQuantityApplicationsText(test: Test): { enabled: boolean; text: string } {
    let total = (test.applications || []).length;
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