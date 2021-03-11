<template>
  <div>
    <copy-input
      v-model="applicationUrl"
      placeholder="Informe o nome da aplicação para gerar o link"
    />
    <message-alert type="warning" icon-position="top" icon-size="18pt" label="Informações sobre o link da aplicação">
        <div>
            <p>
                O link da aplicação permite iniciar a comunicação entre a plataforma e o aplicativo responsável pela apresentação dos puzzles.
                O desenvolvedor do aplicativo deve usar os parâmetros da URL para: <br>
                <ol style="padding-left:2em">
                    <li> Buscar o teste: utilizando o parâmetro <b>dataUrl</b></li>
                    <li> Enviar as respostas dos participantes: enviando o evento de resposta para a URL obtida ao chamar a <b>dataUrl</b></li>
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
                        <td>hash</td>
                        <td>{{hash}}</td>
                        <td>Identificador único da aplicação</td>
                    </tr>
                    <tr>
                        <td>baseUrl</td>
                        <td>{{baseUrl}}</td>
                        <td>Endereço base da API da plataforma</td>
                    </tr>
                    <tr>
                        <td>dataUrl</td>
                        <td>{{dataUrl}}</td>
                        <td>Endereço dos dados do teste em formato JSON.
                             O parâmetro <b>&lt;user_uuid&gt;</b> deve ser gerado pelo sistema (aplicação que se comunica com a plataforma) e enviado a cada nova participação no teste</td>
                    </tr>

                </table>
            </p>
        </div>
    </message-alert>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Action, Component, Prop, Watch } from "nuxt-property-decorator";
import TestApplication from "~/types/TestApplication";
import CopyInput from "~/components/CopyInput.vue";

@Component({
  components: {
    CopyInput,
  },
})
export default class TestApplicationUrlInput extends Vue {
  @Prop() testApplication!: TestApplication;
  @Prop({ default: "application" }) operation!: string;
  puzzleUrl: string = "";

  queryString(params: any) {
    return Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join("&");
  }

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

  get baseUrl() {
    return this.$axios.defaults.baseURL;
  }

  get hash() {
    return this.testApplication.hash;
  }

  get dataUrl() {
    let hash = this.hash;
    let baseUrl = this.$axios.defaults.baseURL;
    return `${baseUrl}/test-applications/public/data/${hash}/<user_uuid>`;
  }

  get applicationUrl(): string {
    let applicationName = this.testApplication.name.replace(
      /[^A-Za-z0-9]/g,
      ""
    );
    let url = "";
    if (applicationName.length) {
      let hash = this.hash;
      let params = {
        op: this.operation,
        hash: hash,
        baseUrl: this.baseUrl,
        dataUrl: this.dataUrl,
      };
      url = `${this.puzzleUrl}?${this.queryString(params)}`;
    }
    return url;
  }
}
</script>
<style lang="scss">
.params-table {
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
