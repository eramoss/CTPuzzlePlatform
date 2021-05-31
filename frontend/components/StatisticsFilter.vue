<template>
  <div>
    <el-button
      :disabled="disabled"
      title="Filtrar dados por condição (igual, diferente, maior, menor etc)"
      @click="show"
      >{{ buttonText }}
      <span v-if="totalFilters && applied"
        >({{ totalFilters }})</span
      ></el-button
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
            placeholder="Variável 1"
            :filterable="true"
          >
            <el-option
              :key="header"
              v-for="header in headers"
              :value="header"
              :label="header"
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
          <el-button
            class="el-icon-close"
            @click="remove(filter)"
            title="Remover"
            type="text"
          ></el-button>
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
import { csvToCsvData, filterCsvData } from "~/types/CsvData";
@Component
export default class StatisticsFilter extends Vue {
  filters: LogicFilter[] = [];
  visible = false;
  applied = false;
  @Prop() headers!: string[];
  @Prop() csv!: string;
  @Prop() appliedFilters!: LogicFilter[];
  @Prop({ default: false }) disabled!: boolean;
  @Prop({ default: "Filtrar" }) buttonText!: string;

  @Watch("appliedFilters", { immediate: true })
  onChangeAppliedFilters() {
    if (this.appliedFilters) {
      this.filters = [...this.appliedFilters];
    }
  }

  undoFilter() {
    this.filters?.splice(0);
    this.$emit("onUpdateFilters", this.filters);
  }

  remove(filter: LogicFilter) {
    let index = this.filters?.indexOf(filter);
    this.filters?.splice(index, 1);
  }

  addFilter() {
    let filter = new LogicFilter();
    filter.id = uuidv4();
    this.filters?.push(filter);
  }

  get totalFilters() {
    return this.filters?.length;
  }

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  filterAndHide() {
    this.filter();
    this.hide();
  }

  filter() {
    let csvData = csvToCsvData(this.csv);
    this.filters?.forEach((filter) => {
      csvData = filterCsvData(
        csvData,
        filter.leftOperandFilterVariable,
        filter.logicalOperationFilter,
        filter.rightOperandFilterValue
      );
    });

    if (csvData) {
      this.applied = true;
      /* if (!this.filters.length) {
        this.$emit("reload");
      } */
      this.$emit("onUpdateFilters", this.filters);
      this.$emit("onUpdateCsvData", csvData);
    }
  }
}
</script>