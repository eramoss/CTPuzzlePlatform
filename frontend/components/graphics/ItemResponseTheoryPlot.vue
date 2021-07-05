<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <form-item-label label="Função"></form-item-label>
        <el-input v-model="curveExpression"></el-input>
      </el-col>
      <el-col :span="6">
        <form-item-label label="Discriminação"></form-item-label>
        <el-input v-model="discrimination"></el-input>
      </el-col>
      <el-col :span="6">
        <form-item-label label="Dificuldade"></form-item-label>
        <el-input v-model="dificulty"></el-input>
      </el-col>
    </el-row>
    <div v-show="errorMessage">{{ errorMessage }}</div>
    <plot :data="data" :layout="plotLayout" />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "nuxt-property-decorator";
import Plot from "./Plot.vue";
import { CsvData } from "~/types/CsvData";
import { evaluate, Matrix, range } from "mathjs";

@Component({
  components: {
    Plot,
  },
})
export default class ItemResponseTheoryPlot extends Vue {
  @Prop() testApplicationData!: CsvData;

  data: any[] = [];
  discrimination = 2;
  dificulty = 0.4;
  probabilityFunction!: Function;
  curveExpression =
    "P(ability, a, b) = 1 / ( 1 + exp(1) ^ (-a * (ability - b)) )";
  errorMessage = "";

  updateData() {
    try {
      let abilityRange: number[] = range(
        -3,
        3,
        0.1,
        true
      ).toArray() as number[];
      let probabilityOfTotalHitGivenSkillLevel: number[] = [];
      abilityRange.forEach((ability) => {
        let p = this.probabilityFunction(
          ability,
          this.discrimination,
          this.dificulty
        );
        probabilityOfTotalHitGivenSkillLevel.push(p);
      });

      var itemCaracteristicCurve = {
        x: abilityRange,
        y: probabilityOfTotalHitGivenSkillLevel,
        mode: "lines",
        name: "vh",
        line: { shape: "spline" },
        type: "scatter",
      };
      this.data = [itemCaracteristicCurve];
      this.errorMessage = "";
    } catch (e) {
      this.errorMessage = "Uso inválido da expressão";
    }
  }

  compileExpression() {
    try {
      this.probabilityFunction = evaluate(this.curveExpression);
    } catch (e) {
      this.errorMessage = "Expressão inválida";
    }
  }

  get plotLayout() {
    return {
      title:
        "Curva característica do item (CCI)",
      xaxis: {
        title: "Habilidade",
      },
      yaxis: {
        title: "Probabilidade de resposta correta",
      },
    };
  }

  @Watch("curveExpression", { immediate: true })
  onChangeCurveExpression() {
    this.compileExpression();
    this.updateData();
  }

  @Watch("testApplicationData", { immediate: true })
  onChangeTestApplicationData() {
    this.updateData();
  }

  @Watch("discrimination", { immediate: true })
  onChangeDiscrimination() {
    this.updateData();
  }

  @Watch("dificulty", { immediate: true })
  onChangeDificulty() {
    this.updateData();
  }
}
</script>