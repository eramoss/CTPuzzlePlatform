<template>
  <div>
    <el-button
      :disabled="disabled"
      title="Filtrar dados por condição (igual, diferente, maior, menor etc)"
      @click="visible = true"
      >{{ buttonText }}
      <span v-if="filters.length">({{ filters.length }})</span></el-button
    >
    <el-dialog title="Filtrar" :visible.sync="visible">
      <div v-for="filter in filters" :key="filter.id">
        <div class="phrase">
          Filtrar linhas com
          <b>
            {{ filter.leftOperandFilterVariable || "___" }}
            {{ filter.logicalOperationFilter || "___" }}
            {{ filter.rightOperandFilterValue || "___" }}
          </b>
        </div>
        <div class="flex-row">
          <el-select
            v-model="filter.leftOperandFilterVariable"
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
            v-model="filter.logicalOperationFilter"
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
            v-model="filter.rightOperandFilterValue"
            placeholder="Valor"
          ></el-input>
        </div>
      </div>
      <div>
        <el-button icon="el-icon-plus" @click="addFilter" type="text"
          >Adicionar filtro</el-button
        >
      </div>

      <div slot="footer">
        <el-button type="primary" @click="filterAndHide">Filtrar</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "nuxt-property-decorator";
import LogicFilter from "~/types/LogicFilter";
import { v4 as uuidv4 } from "uuid";
import { CsvData, filterCsvData } from "~/types/CsvData";
@Component
export default class StatisticsFilter extends Vue {
  filters: LogicFilter[] = [];
  visible = false;
  @Prop() csvData!: CsvData;
  @Prop() appliedFilters!: LogicFilter[];
  @Prop({ default: false }) disabled!: boolean;
  @Prop({ default: "Filtrar" }) buttonText!: string;

  @Watch("appliedFilters", { immediate: true }) onChangeAppliedFilters() {
    Vue.set(this, "filters", this.appliedFilters);
    this.filter();
  }

  undoTransform() {
    this.filters.splice(0);
  }

  addFilter() {
    let filter = new LogicFilter();
    filter.id = uuidv4();
    this.filters.push(filter);
  }

  get csvHeaders() {
    return this.csvData.labels;
  }

  hide() {
    this.visible = false;
  }

  filterAndHide() {
    this.filter();
    this.hide();
  }

  filter() {
    let csvData;
    this.filters.forEach((filter) => {
      csvData = filterCsvData(
        this.csvData,
        filter.leftOperandFilterVariable,
        filter.logicalOperationFilter,
        filter.rightOperandFilterValue
      );
    });

    this.$emit("onUpdateCsvData", csvData);
    this.$emit("onUpdateFilters", this.filters);
  }
}
</script>