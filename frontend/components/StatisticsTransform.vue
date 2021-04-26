<template>
  <div>
    <el-button :disabled="disabled" @click="visible = true">Agrupar</el-button>
    <el-dialog title="Agrupar" :visible.sync="visible">
      <div class="flex-row">
        <el-select
          v-model="onGroupDoWhat"
          placeholder="Cálculo"
          :filterable="true"
          value-key="name"
        >
          <el-option
            :key="groupOp.name"
            v-for="groupOp in onGroupDoWhatAvailableOperations"
            :value="groupOp"
            :label="groupOp.name"
          ></el-option>
        </el-select>
        <el-select
          v-model="groupWhat"
          placeholder="Variável 1"
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
          v-model="groupBy"
          placeholder="Variável 2"
          :filterable="true"
        >
          <el-option
            :key="header.value"
            v-for="header in csvHeaders"
            :value="header.value"
            :label="header.value"
          ></el-option>
        </el-select>
      </div>
      <div class="top-marged">
        Calcular <b>{{ onGroupDoWhat.name || "___" }}</b> de
        <b>{{ groupWhat || "___" }}</b> agrupado por
        <b>{{ groupBy || "___" }}</b>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="transform">Agrupar</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "nuxt-property-decorator";
import { CsvData, groupCsvData } from "~/types/CsvData";
import { OperationOnGroup } from "~/types/StatisticMeasures";
@Component
export default class StatisticsTransform extends Vue {
  groupBy = "";
  groupWhat = "";
  visible = false;

  onGroupDoWhat: OperationOnGroup<number[], number> = new OperationOnGroup();
  onGroupDoWhatAvailableOperations = [
    new OperationOnGroup<number[], number>("média", (numbers: number[]) => {
      return parseFloat(
        (
          numbers.reduce(
            (previousValue: number, currentValue: number) =>
              previousValue + currentValue
          ) / numbers.length
        ).toFixed(2)
      );
    }),
    new OperationOnGroup<number[], number>("soma", (numbers: number[]) =>
      numbers.reduce(
        (previousValue: number, currentValue: number) =>
          previousValue + currentValue
      )
    ),
  ];

  @Prop() csvData!: CsvData;
  @Prop({ default: false }) disabled!: boolean;

  get csvHeaders() {
    return this.csvData.labels;
  }

  transform() {
    let csvData = groupCsvData(
      this.csvData,
      this.groupBy,
      this.groupWhat,
      this.onGroupDoWhat
    );
    this.visible = false;
    this.$emit("onUpdateCsvData", csvData);
  }
}
</script>
<style lang="scss">
.item-label {
  word-break: keep-all;
  padding: 6px;
  text-align: center;
}
</style>