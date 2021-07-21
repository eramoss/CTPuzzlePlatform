<template>
  <div>
    <el-row :gutter="20" v-show="showInputs">
      <el-col :span="12">
        <form-item-label label="Função"></form-item-label>
        <el-input v-model="curveExpression"></el-input>
      </el-col>
      <el-col :span="5">
        <form-item-label label="Discriminação (a)"></form-item-label>
        <el-input v-model="discrimination"></el-input>
      </el-col>
      <el-col :span="5">
        <form-item-label label="Dificuldade (b)"></form-item-label>
        <el-input v-model="difficulty"></el-input>
      </el-col>
      <el-col :span="2">
        <el-tooltip effect="light" content="Limpar gráfico">
          <div>
            <div><form-item-label label="Limpar"></form-item-label></div>
            <div>
              <el-button
                :disabled="sortedParametersList.length <= 1"
                icon="el-icon-close"
                @click="reset"
              ></el-button>
            </div>
          </div>
        </el-tooltip>
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
import { range } from "mathjs";
import ItemCharacteristicCurveFunction from "@/types/ItemCharacteristicCurveFunction";
import CciPlotParameters from "~/types/CciPlotParameters";

@Component({
  components: {
    Plot,
  },
})
export default class ItemResponseTheoryPlot extends Vue {
  data: any[] = [];
  discrimination = 2;
  difficulty = 0.4;
  probabilityFunction = new ItemCharacteristicCurveFunction();
  curveExpression = this.probabilityFunction.curveExpression;
  errorMessage = "";
  parametersList: CciPlotParameters[] = [];
  @Prop({ default: true }) showInputs!: boolean;

  get sortedParametersList(): CciPlotParameters[] {
    let cciPlotParameters: CciPlotParameters[] = this.parametersList;
    if (!cciPlotParameters.length) {
      cciPlotParameters.push({
        discrimination: this.discrimination,
        difficulty: this.difficulty,
        itemName: "Item",
        itemNumber: -1,
      });
    }
    if (cciPlotParameters.length > 1) {
      cciPlotParameters = cciPlotParameters.filter((it) => it.itemNumber > 0);
    }
    return cciPlotParameters.sort((a, b) => a.itemNumber - b.itemNumber);
  }

  get abilityRange() {
    let abilityRange: number[] = range(-3, 3, 0.1, true).toArray() as number[];
    return abilityRange;
  }

  updateData() {
    try {
      let traces: any[] = [];

      this.sortedParametersList.forEach((parameters) => {
        traces.push(this.createItemCharacteristicCurve(parameters));
      });
      this.data = traces;
      this.errorMessage = "";
    } catch (e) {
      this.errorMessage = "Uso inválido da expressão";
    }
  }

  createItemCharacteristicCurve(parameters: CciPlotParameters) {
    let probabilityOfTotalHitGivenSkillLevel: number[] = [];
    this.abilityRange.forEach((ability) => {
      let p = this.probabilityFunction.P(
        ability,
        parameters.discrimination,
        parameters.difficulty
      );
      probabilityOfTotalHitGivenSkillLevel.push(p);
    });

    var itemCaracteristicCurve = {
      x: this.abilityRange,
      y: probabilityOfTotalHitGivenSkillLevel,
      mode: "lines",
      name: parameters.itemName,
      line: { shape: "spline" },
      type: "scatter",
    };
    return itemCaracteristicCurve;
  }

  clear() {
    this.parametersList.splice(0);
  }

  reset() {
    this.clear();
    this.updateData();
  }

  setParameters(parameters: CciPlotParameters) {
    parameters.itemName = `${parameters.itemName} a=${parameters.discrimination} b=${parameters.difficulty}`;
    if (!this.parametersList.some((it) => it.itemName == parameters.itemName)) {
      this.parametersList.push(parameters);
    }
    this.updateData();
  }

  compileExpression() {
    try {
      this.probabilityFunction.setExpression(this.curveExpression);
    } catch (e) {
      this.errorMessage = "Expressão inválida";
    }
  }

  get plotLayout() {
    return {
      title: "Curva característica do item (CCI)",
      xaxis: {
        title: "Habilidade",
      },
      yaxis: {
        title: "Probabilidade de acerto total",
        range: [0, 1],
      },
    };
  }

  @Watch("curveExpression", { immediate: true })
  onChangeCurveExpression() {
    this.compileExpression();
    this.updateData();
  }

  @Watch("discrimination", { immediate: true })
  onChangeDiscrimination() {
    this.clear();
    this.updateData();
  }

  @Watch("difficulty", { immediate: true })
  onChangeDifficulty() {
    this.clear();
    this.updateData();
  }
}
</script>