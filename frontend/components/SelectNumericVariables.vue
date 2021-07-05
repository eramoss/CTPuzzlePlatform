<template>
  <div>
    <form-item-label label="Variável" :required="true" />
    <el-select
      placeholder="Selecione uma variável"
      :filterable="true"
      v-model="selectedColumn"
      @change="onSelectColumn"
      value-key="value"
    >
      <el-option
        v-for="column in numericColumns"
        :key="column.value"
        :label="column.label"
        :value="column"
      ></el-option>
    </el-select>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "nuxt-property-decorator";
import { CsvData, CsvHeaderLabel, getNumericColumns } from "~/types/CsvData";
@Component
export default class SelectNumericVariables extends Vue {
  @Prop({}) testApplicationData!: CsvData;
  @Prop({ default: "escore_obtido" }) defaultValue!: string;

  selectedColumn = new CsvHeaderLabel();

  onSelectColumn() {
    this.$emit("change", this.selectedColumn);
  }

  get numericColumns(): CsvHeaderLabel[] {
    return getNumericColumns(this.testApplicationData);
  }

  @Watch("numericColumns", { immediate: true })
  onChangeNumericColumns() {
    const defaultColumn = this.numericColumns.find(
      (it) => it.value == this.defaultValue
    );
    if (defaultColumn) {
      this.selectedColumn = defaultColumn;
      this.onSelectColumn();
    }
  }
}
</script>