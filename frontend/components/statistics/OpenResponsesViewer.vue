<template>
  <div>
    <color-panel
      label="Visualizador de respostas abertas"
      textColor="#FF7F0E"
      color="#FFDAB9"
      :showInfo="true"
    >
      <template slot="info">
        Respostas abertas são úteis para análises qualitativas. <br />
        Utilize o visualizador de respostas abertas para navegar facilmente por
        respostas textuais.
      </template>
      <message-alert type="warning">
        <p>
          Utilize o visualizador de respostas abertas para navegar facilmente
          pelas respostas textuais e de questionários.
        </p>
      </message-alert>
      <el-button icon="el-icon-tickets" type="warning" @click="show">
        Abrir
      </el-button>
    </color-panel>
    <el-dialog
      top="20px"
      width="80%"
      :visible.sync="visible"
      :close-on-click-modal="false"
      title="Visualizador de respostas abertas"
    >
      <el-row :gutter="20">
        <el-col :md="16">
          <select-variables
            type="string"
            source="quiz"
            :hideLabel="true"
            @change="onSelectVariable"
            :value="selectedVariable"
            :testApplicationData="data"
            class="fill"
            style="bottom-marged"
          />
        </el-col>
        <el-col :md="8">
          <el-input
            size="large"
            v-model="searchString"
            placeholder="Filtro"
          ></el-input>
          <el-checkbox v-model="useRegex"
            >Filtrar com expressão regular</el-checkbox
          >
        </el-col>
      </el-row>

      <div class="top-marged">
        <h2>{{ filteredResponses.length }}/{{ responses.length }} respostas</h2>

        <div class="responses-list inset-shadow">
          <div
            v-for="(response, i) in filteredResponses"
            :key="response.user"
            :class="{ bigger: i == index }"
          >
            <p class="response-text">"{{ response.response }}"</p>
            <p class="response-user">{{ response.user }}</p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Ref, Watch } from "nuxt-property-decorator";
import SelectVariables from "~/components/SelectVariables.vue";
import { CsvData, CsvHeaderLabel } from "~/types/CsvData";
@Component({
  components: {
    SelectVariables,
  },
})
export default class OpenResponsesViewer extends Vue {
  @Prop() data!: CsvData;

  visible = false;
  selectedVariable: CsvHeaderLabel = new CsvHeaderLabel();
  searchString: string = "";
  useRegex = false;
  validExpression: boolean = true;
  index = 0;

  @Watch("data")
  onChangeData() {
    this.selectFirstTextualVariable();
  }

  selectFirstTextualVariable() {
    let variable = this.data.labels.find(
      (label) => label.type == "string" && label.source == "quiz"
    );
    if (variable) {
      this.selectedVariable = variable;
    }
  }

  show() {
    this.visible = true;
    this.selectFirstTextualVariable();
  }

  onSelectVariable(csvHeader: CsvHeaderLabel) {
    this.selectedVariable = csvHeader;
  }

  get responses() {
    let usersIds: any[] = [];
    if (!this.data) return [];
    return this.data?.rows
      .map((row) => {
        let userId = row["usuario"];
        let response = row[this.selectedVariable.value];
        if (typeof response == "object") {
          response = JSON.stringify(response);
        }
        if (usersIds.indexOf(userId) > -1 || !response) {
          return;
        }
        usersIds.push(userId);
        return {
          response: response,
          user: userId,
        };
      })
      .filter((it) => !!it);
  }

  get filteredResponses(): { user: string; response: string }[] {
    function prepareToFilter(text: any) {
      return text
        .toUpperCase()
        .replace(/[ÃÁÂÀ]/g, "A")
        .replace(/[ẼÉÊÈ]/g, "E")
        .replace(/[ĨÍÎÌ]/g, "I")
        .replace(/[ÕÓÔÒ]/g, "O")
        .replace(/[ŨÚÛÙ]/g, "U")
        .replace(/[Ç]/g, "C");
    }

    this.validExpression = true;
    try {
      new RegExp(this.searchString);
    } catch (e) {
      this.validExpression = false;
    }

    let regex = this.validExpression ? new RegExp(this.searchString) : null;
    let filter = prepareToFilter(this.searchString);

    //@ts-ignore
    return this.responses
      .filter((it) => !!it)
      .filter((it) => {
        let response = prepareToFilter(it?.response);
        return (
          !this.searchString ||
          response.indexOf(filter) > -1 ||
          (this.useRegex && this.validExpression && regex?.test(it?.response))
        );
      });
  }

  /* threatIndex(keyEvent: KeyboardEvent) {
    keyEvent.preventDefault();
    if (keyEvent.key == "ArrowUp") {
      this.index++;
    }
    if (keyEvent.key == "ArrowDown") {
      this.index--;
    }
  } */

  mounted() {
    //window.addEventListener("keydown", this.threatIndex);
  }

  destroyed() {
    //window.removeEventListener("keydown", this.threatIndex);
  }
}
</script>
<style lang="scss">
.responses-list {
  height: 60vh;
  overflow-y: scroll;
  padding: 50px 100px;
}

.response-text {
  transition: all 300ms;
  font-style: italic;
  text-align: center;
  font-size: 18pt;
  line-height: 1.5em;
  margin-top: 15px;
  margin-bottom: 15px;
  width: 100%;
  //color: #888;
}

.response-user {
  transition: all 300ms;
  font-size: 10pt;
  color: #888;
  text-align: center;
  width: 100%;
  margin-bottom: 20px;
}

/* .bigger {
  .response-text {
    color: #333;
    font-size: 20pt;
  }
  .response-user {
    font-size: 12pt;
  }
} */
</style>