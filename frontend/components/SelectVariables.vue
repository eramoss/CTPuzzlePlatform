<template>
  <div>
    <form-item-label :label="label" :required="required" v-show="!hideLabel" />
    <el-select
      :clearable="!required"
      placeholder="Selecione uma variável"
      :filterable="true"
      v-model="selectedColumn"
      @change="onSelectColumn"
      value-key="value"
    >
      <el-option
        v-for="column in selectableVariables"
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
import {
  CsvColumnType,
  CsvData,
  CsvHeaderLabel,
  getColumnsByTypeEquals,
} from "~/types/CsvData";
@Component
export default class SelectVariables extends Vue {
  @Prop({}) testApplicationData!: CsvData;
  @Prop() hideLabel!: boolean;
  @Prop({ default: "Variável" }) label!: string;
  @Prop({ default: false }) required!: boolean;
  @Prop({ default: "number" }) type!: CsvColumnType;
  @Prop() value!: CsvHeaderLabel;
  @Prop({ default: "escore_obtido" }) defaultValue!: string;

  @Watch("value")
  onChangeValue() {
    this.selectedColumn = this.value;
  }

  selectedColumn = new CsvHeaderLabel();

  onSelectColumn() {
    this.$emit("change", this.selectedColumn);
  }

  get selectableVariables(): CsvHeaderLabel[] {
    let selectableVariables: CsvHeaderLabel[] = [];
    if (this.testApplicationData) {
      selectableVariables = getColumnsByTypeEquals(
        this.testApplicationData,
        this.type
      );
    }
    return selectableVariables;
  }

  @Watch("selectableVariables", { immediate: true })
  onChangeSelectableVariables() {
    const defaultVariable = this.selectableVariables.find(
      (it) => it.value == this.defaultValue
    );
    if (defaultVariable) {
      this.selectedColumn = defaultVariable;
      this.onSelectColumn();
    }
  }
}
</script>