<template>
  <div>
    <el-button :disabled="disabled" @click="visible = true">Filtrar</el-button>
    <el-dialog title="Filtrar" :visible.sync="visible">
      <div class="flex-row">
        <el-select
          v-model="leftOperandFilterVariable"
          placeholder="Variável"
          :filterable="true"
        >
          <el-option
            :key="header.value"
            v-for="header in csvHeaders"
            :value="header.value"
            :label="header.value"
          ></el-option>
        </el-select>
        <el-select
          :filterable="true"
          v-model="logicalOperationFilter"
          placeholder="Operador lógico"
        >
          <el-option value=">"></el-option>
          <el-option value="<"></el-option>
          <el-option value=">="></el-option>
          <el-option value="<="></el-option>
          <el-option value="=="></el-option>
          <el-option value="!="></el-option>
        </el-select>
        <el-input
          v-model="rightOperandFilterValue"
          placeholder="Valor"
        ></el-input>
      </div>
      <div class="top-marged">
        Filtrar linhas com
        <b>
          {{ leftOperandFilterVariable || "___" }}
          {{ logicalOperationFilter || "___" }}
          {{ rightOperandFilterValue || "___" }}
        </b>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="filter">Filtrar</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "nuxt-property-decorator";
import { Context } from "@nuxt/types";
import { CsvData, csvDataToCsv, filterCsvData } from "~/types/CsvData";
@Component
export default class StatisticsFilter extends Vue {
  leftOperandFilterVariable = "";
  logicalOperationFilter = "";
  rightOperandFilterValue = "";
  visible = false;
  @Prop() csvData!: CsvData;
  @Prop({ default: false }) disabled!: boolean;

  get csvHeaders() {
    return this.csvData.labels;
  }

  filter() {
    let csvData = filterCsvData(
      this.csvData,
      this.leftOperandFilterVariable,
      this.logicalOperationFilter,
      this.rightOperandFilterValue
    );
    this.visible = false;
    this.$emit("onUpdateCsvData", csvData);
  }
}
</script>