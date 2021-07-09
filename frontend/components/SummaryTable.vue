<template>
  <div v-show="data.rows.length" style="overflow-y: scroll">
    <el-table
      class="no-margin-top"
      stripe
      border
      :data="summarizedDataRows"
      empty-text="Não há dados sumarizados"
    >
      <el-table-column width="150">
        <template slot-scope="{ row }">
          <div>
            <b>{{ row.summaryOperationName }}</b>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-for="header in numericColumns"
        :key="header.value"
        :prop="header.value"
        :label="header.label"
        :width="calculateColumnWidth(header)"
        :fixed="calculateColumnFixPosition(header)"
      >
        <template slot-scope="{ row }">
          {{ row.rowObject[header.value] }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "nuxt-property-decorator";
import { SummaryRow } from "~/types/SummaryRow";
import { Context } from "@nuxt/types";
import {
  CsvData,
  CsvHeaderLabel,
  getColumnFixPosition,
  getColumnWidth,
  getNumericColumns,
  getNumericColumnValues,
} from "~/types/CsvData";

import { mathHelper, round } from "~/types/MathHelper";

@Component
export default class SummaryTable extends Vue {
  @Prop({ default: new CsvData() }) data!: CsvData;

  get summarizedDataRows(): SummaryRow[] {
    return [
      {
        name: "Média",
        agregationFunction: mathHelper.average,
      },
      {
        name: "Variância",
        agregationFunction: mathHelper.variance,
      },
      {
        name: "Desvio padrão",
        agregationFunction: mathHelper.standartDeviation,
      },
    ].map((summaryOperation) => {
      let summaryRow = new SummaryRow();
      summaryRow.summaryOperationName = summaryOperation.name;
      summaryRow.headers = this.numericColumns;

      this.numericColumns
        .map((header) => {
          let values = getNumericColumnValues(this.data, header);
          return {
            columnName: header.value,
            aggregationResult: summaryOperation.agregationFunction(values),
          };
        })
        .forEach((entry) => {
          summaryRow.rowObject[entry.columnName] = round(
            entry.aggregationResult
          );
        });
      return summaryRow;
    });
  }

  

  get numericColumns() {
    return getNumericColumns(this.data);
  }

  calculateColumnWidth(header: CsvHeaderLabel) {
    return getColumnWidth(this.data, header);
  }

  calculateColumnFixPosition(header: CsvHeaderLabel): string | boolean {
    return getColumnFixPosition(header);
  }
}
</script>