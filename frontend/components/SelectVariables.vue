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
  CsvColumnSource,
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
  @Prop() source!: CsvColumnSource;
  @Prop() value!: CsvHeaderLabel;
  @Prop({ default: "escore_obtido" }) defaultValue!: string;
  selectedColumn = new CsvHeaderLabel();

  @Watch("value", { immediate: true })
  onChangeValue() {
    let value = this.selectableVariables.find(
      (it) => it.value == this.value?.value
    );
    if (value) {
      this.selectedColumn = value;
    }
  }

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
    if(this.source){
        selectableVariables = selectableVariables.filter(it=>it.source == this.source)
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