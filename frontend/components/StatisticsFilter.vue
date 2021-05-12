<template>
  <div>
    <el-button
      :disabled="disabled"
      title="Filtrar dados por condição (igual, diferente, maior, menor etc)"
      @click="visible = true"
      >{{ buttonText }}
      <span v-if="applied">({{ totalApplied }})</span></el-button
    >
    <el-dialog title="Filtrar" :visible.sync="visible">
      <div class="phrase">
        Filtrar linhas com
        <b>
          {{ leftOperandFilterVariable || "___" }}
          {{ logicalOperationFilter || "___" }}
          {{ rightOperandFilterValue || "___" }}
        </b>
      </div>
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

      <div slot="footer">
        <el-button type="primary" @click="filter">Filtrar</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "nuxt-property-decorator";
import { CsvData, filterCsvData } from "~/types/CsvData";
@Component
export default class StatisticsFilter extends Vue {
  leftOperandFilterVariable = "";
  logicalOperationFilter = "";
  rightOperandFilterValue = "";
  visible = false;
  applied = false;
  totalApplied = 0;
  @Prop() csvData!: CsvData;
  @Prop({ default: false }) disabled!: boolean;
  @Prop({ default: "Filtrar" }) buttonText!: string;

  undoTransform() {
    this.applied = false;
    this.totalApplied = 0;
  }

  get csvHeaders() {
    return this.csvData.labels;
  }

  filter() {
    this.applied = true;
    this.totalApplied = this.totalApplied + 1;
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