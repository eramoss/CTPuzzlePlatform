<template>
  <div>
    <el-button
      :disabled="disabled"
      @click="visible = true"
      title="Agrupar dados somando ou calculando a média de variável"
      >{{ buttonText }}
      <span v-show="applied">({{ totalApplied }})</span></el-button
    >
    <el-dialog title="Agrupar" :visible.sync="visible">
      <div class="phrase">
        Calcular <b>{{ onGroupDoWhat.name || "___" }}</b> de
        <b>{{ groupWhat || "___" }}</b> agrupado por
        <b>{{ groupBy || "___" }}</b>
      </div>
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
  applied: boolean = false;
  totalApplied = 0;

  undoTransform() {
    this.applied = false;
    this.totalApplied = 0;
  }

  onGroupDoWhat: OperationOnGroup<number[], number> = new OperationOnGroup();
  onGroupDoWhatAvailableOperations = [
    new OperationOnGroup<number[], number>("Média", (numbers: number[]) => {
      return parseFloat(
        (
          numbers.reduce(
            (previousValue: number, currentValue: number) =>
              previousValue + currentValue
          ) / numbers.length
        ).toFixed(2)
      );
    }),
    new OperationOnGroup<number[], number>("Soma", (numbers: number[]) =>
      numbers.reduce(
        (previousValue: number, currentValue: number) =>
          previousValue + currentValue
      )
    ),
    new OperationOnGroup<number[], number>("Maior valor", (numbers: number[]) =>
      numbers.reduce((previousValue: number, currentValue: number) =>
        currentValue > previousValue ? currentValue : previousValue
      )
    ),
    new OperationOnGroup<number[], number>("Menor valor", (numbers: number[]) =>
      numbers.reduce((previousValue: number, currentValue: number) =>
        currentValue < previousValue ? currentValue : previousValue
      )
    ),
  ];

  @Prop() csvData!: CsvData;
  @Prop({ default: "Agrupar" }) buttonText!: string;
  @Prop({ default: false }) disabled!: boolean;

  get csvHeaders() {
    return this.csvData.labels;
  }

  transform() {
    this.applied = true;
    this.totalApplied = this.totalApplied + 1;
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