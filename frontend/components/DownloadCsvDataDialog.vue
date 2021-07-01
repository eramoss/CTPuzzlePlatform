<template>
  <el-dialog :visible.sync="visible" title="Baixar dados de aplicação de teste">
    <el-form>
      <el-form-item label="Nome do arquivo">
        <el-input ref="fileNameInput" v-model="fileName">
          <template slot="append">.csv</template>
        </el-input>
      </el-form-item>
      <el-form-item label="Colunas">
        <div class="columns-switch">
          <el-switch
            v-model="isSelectedColumns"
            active-text="Selecionar colunas"
          ></el-switch>
        </div>
        <div v-show="messageSelectedColumns">
          <div class="flex-row">
            {{ messageSelectedColumns }}
            <div>
              <el-button
                type="text"
                size="small"
                @click="unselectAllColumns"
                :disabled="!isAllowedUnselectAllColumns"
                >Desmarcar tudo</el-button
              >
            </div>
          </div>
        </div>
        <div class="columns-checkbox-group" v-show="isSelectedColumns">
          <el-checkbox-group v-model="selectedColumns">
            <el-checkbox
              size="small"
              class="column-checkbox"
              v-for="csvHeader in csvHeaders"
              :key="csvHeader.value"
              :label="csvHeader.label"
            />
          </el-checkbox-group>
        </div>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button
        icon="el-icon-download"
        @click="downloadCsv"
        :disabled="!isFormValid"
        type="primary"
        >Baixar</el-button
      >
    </template>
  </el-dialog>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Ref } from "nuxt-property-decorator";
import { CsvData, CsvHeaderLabel, downloadCsvData } from "~/types/CsvData";
import { ElInput } from "element-ui/types/input";
@Component
export default class DownloadCsvDataDialog extends Vue {
  @Prop() csvData!: CsvData;
  visible = false;
  fileName = "dados";
  isSelectedColumns = false;
  selectedColumns: string[] = [];

  @Ref() fileNameInput!: ElInput;
  show() {
    this.visible = true;
    this.$nextTick(() => {
      this.fileNameInput?.focus();
      this.fileNameInput?.select();
    });
  }

  close() {
    this.visible = false;
  }

  downloadCsv() {
    let selectedColumns: string[] = [];
    if (this.isSelectedColumns) {
      selectedColumns = this.selectedColumns;
      if (!selectedColumns.length) {
        this.$alert(
          "Não há nenhuma coluna selecionada para ser exportada",
          "Selecione ao menos uma coluna",
          { type: "error" }
        );
        return;
      }
    }
    downloadCsvData(this.csvData, this.fileName, selectedColumns);
    this.close();
  }

  get csvHeaders() {
    return this.csvData?.labels;
  }

  get isFormValid() {
    return this.fileName.length;
  }

  get isAllowedUnselectAllColumns() {
    return this.selectedColumns.length > 0;
  }

  unselectAllColumns() {
    this.selectedColumns.splice(0);
  }

  get messageSelectedColumns(): string | null {
    let messageSelectedColumns = null;
    if (this.isSelectedColumns) {
      messageSelectedColumns = "Selecione as colunas marcando os itens abaixo:";
      if (this.selectedColumns.length) {
        messageSelectedColumns = `${this.selectedColumns.length} colunas selecionadas`;
      }
    }
    return messageSelectedColumns;
  }
}
</script>
<style lang="scss">
.columns-switch .el-switch {
  width: 100%;
}
.columns-checkbox-group {
  max-height: 200px;
  overflow-y: scroll;
  padding: 0 20px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.4) inset;
  .column-checkbox {
    width: 200px;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
  }
}
</style>