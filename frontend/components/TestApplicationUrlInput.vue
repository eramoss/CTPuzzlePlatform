<template>
  <div>
    <copy-input
      v-model="applicationUrl"
      placeholder="Informe o nome da aplicação para gerar o link"
    >
    <template slot="more-buttons">
        <el-tooltip :open-delay="250" content="Tenta abrir o link" effect="light" v-show="showAccessIcon">
            <a :href="applicationUrl" target="_blank">
                <el-button type="text" icon="el-icon-top-right"> Acessar </el-button>
            </a>
        </el-tooltip>
    </template>
    </copy-input>
    <el-button type="text" icon="el-icon-info" @click="aboutApplicationLinkVisible=true">Informações sobre o link de aplicação</el-button>
    <el-dialog title="Informações sobre o link de aplicação" :visible.sync="aboutApplicationLinkVisible" width="98vw" top="10px">
        <message-alert type="warning" icon-position="top" icon-size="18pt">
        <div>
            <p>
                O link da aplicação permite iniciar a comunicação entre a plataforma e o aplicativo responsável pela apresentação dos puzzles.
                O desenvolvedor do aplicativo deve usar os parâmetros da URL para: <br>
                <ol style="padding-left:2em">
                    <li> Buscar o teste: utilizando o parâmetro <b>dataUrl</b></li>
                    <li> Enviar as respostas dos participantes a partir da URL de resposta obtida pela primeira chamada</li>
                </ol>
            </p>
            <p>
                <table class="params-table" v-show="applicationUrl">
                    <tr>
                        <th>Parâmetro</th>
                        <th>Valores</th>
                        <th>Descrição</th>
                    </tr>
                    <tr>
                        <td>op</td>
                        <td>{{operation}}</td>
                        <td>Denota a operação do link: <i> application </i> para aplicação e <i>playground</i> para teste do item</td>
                    </tr>
                    <tr>
                        <td>dataUrl</td>
                        <td><a :href="dataUrl" style="margin-left:0; word-break: break-all" target="_blank">{{dataUrl}}</a></td>
                        <td>Endereço dos dados do teste em formato JSON.
                             O parâmetro <b>&lt;user_uuid&gt;</b> identifica os participantes no teste.
                             Deve ser gerado pelo aplicativo a cada nova participação.</td>
                    </tr>

                </table>
            </p>
        </div>
    </message-alert>
    </el-dialog>
    
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Action, Component, Prop, Watch } from "nuxt-property-decorator";
import TestApplication from "~/types/TestApplication";
import CopyInput from "~/components/CopyInput.vue";
import queryString from "~/utils/utils";

@Component({
  components: {
    CopyInput,
  },
})
export default class TestApplicationUrlInput extends Vue {
  @Prop() testApplication!: TestApplication;
  @Prop({ default: "application" }) operation!: string;
  @Prop({ default: false }) showAccessIcon!: boolean;
  puzzleUrl: string = "";
  aboutApplicationLinkVisible: boolean = false;

  @Action("tests/getPuzzleBaseUrl") getPuzzleBaseUrl!: (
    testId: number
  ) => Promise<string>;

  @Watch("testApplication", { deep: true, immediate: true })
  async onChangeTestApplication() {
    const test = this.testApplication.test;
    if (test && test.id) {
      this.puzzleUrl = await this.getPuzzleBaseUrl(test.id);
    }
  }

  get dataUrl() {
    let hash = this.testApplication.hash;
    let baseUrl = this.$axios.defaults.baseURL;
    return `${baseUrl}/test-applications/public/data/${hash}/<user_uuid>`;
  }

  @Watch("applicationUrl")
  onChangeApplicationUrl() {
    this.testApplication.url = this.applicationUrl;
    this.$emit("update:testApplication", this.testApplication);
  }

  get applicationUrl(): string {
    let applicationName = this.testApplication.name?.replace(
      /[^A-Za-z0-9]/g,
      ""
    );
    let url = "";
    if (applicationName?.length) {
      let params = {
        op: this.operation,
        dataUrl: this.dataUrl,
      };
      url = `${this.puzzleUrl}?${queryString(params)}`;
    }
    return url;
  }
}
</script>
<style lang="scss">
.params-table {
  td,
  th {
    text-align: left;
    //color:red;
  }
  margin-top: 5px;

  th {
    text-align: center;
  }
  tr:not(:last-child) {
    th,
    td {
      border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
    }
  }
}
</style>
