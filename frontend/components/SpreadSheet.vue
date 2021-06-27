<template>
  <div>
    <div>
      <div class="fill flex-row">
        <div>
          <span>{{ countLines }} linhas</span>
          <span v-show="!countLines">{{ phraseWhenZeroLines }}</span>
        </div>
        <el-button
          type="primary"
          size="small"
          style="margin-bottom: 5px"
          @click="downloadCsv"
          icon="el-icon-download"
          >Baixar CSV</el-button
        >
      </div>
      <textarea
        class="text-area-spread-sheet"
        ref="textarea"
        v-model="csv"
        :rows="rows"
        :cols="cols"
        @keydown="handleKeydown"
        wrap="off"
      />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Ref, VModel, Watch } from "nuxt-property-decorator";
import { replaceDefaultSeparatorWithSemicolon } from "~/types/CsvData";

@Component
export default class SpreadSheet extends Vue {
  @VModel() csv!: string;
  @Prop({ default: 189 }) cols!: number;
  @Prop({ default: 20 }) rows!: number;
  @Prop({}) phraseWhenZeroLines!: string;

  @Ref() textarea!: HTMLInputElement;

  scrollToStart() {
    this.textarea.scrollTo(0, 0);
  }

  get countLines(): number {
    let total = this.csv.split("\n").filter((line) => line.length > 0).length;
    total = total - 1; //header
    if (total < 0) {
      total = 0;
    }
    return total;
  }

  async downloadCsv() {
    try {
      //@ts-ignore
      let { value } = await this.$prompt(
        "Por favor, informe um nome para o arquivo",
        "Nome do arquivo",
        {
          inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+/,
          inputErrorMessage: "Nome inválido",
          confirmButtonText: "Baixar",
          cancelButtonText: "Cancelar",
        }
      );

      var data = replaceDefaultSeparatorWithSemicolon(this.csv);
      var c = document.createElement("a");
      c.download = `${value}.csv`;

      var t = new Blob([data], {
        type: "text/plain",
      });
      c.href = window.URL.createObjectURL(t);
      c.click();
    } catch (e) {
      //this.$notify.warning("O arquivo não foi gerado")
    }
  }

  handleKeydown(event: KeyboardEvent) {
    let keys = ["PageUp", "PageDown"];
    if (keys.indexOf(event.key) > -1) {
      event.preventDefault();
    }
    if (event.key == "Home") {
      this.textarea.scrollTo(0, this.textarea.scrollTop);
    }
    if (event.key == "PageDown") {
      this.textarea.scrollTo(0, this.textarea.scrollTop + 100);
    }
    if (event.key == "PageUp") {
      this.textarea.scrollTo(0, this.textarea.scrollTop - 100);
    }
  }
}
</script>
<style lang="scss">
.text-area-spread-sheet {
  font-size: 10pt;
  //padding: 15px;
  line-height: 1.1em;
  width: 100%;
  color: black;
}
</style>