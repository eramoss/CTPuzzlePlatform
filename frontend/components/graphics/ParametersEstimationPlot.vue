<template>
  <div>
    <el-row :gutter="20" v-show="showInputs">
      <el-col :span="4">
        <form-item-label label="Primeiro item" />
        <el-input type="number" v-model="firstOrderId"></el-input>
      </el-col>
      <el-col :span="4">
        <form-item-label label="Último item" />
        <el-input type="number" v-model="lastOrderId"></el-input>
      </el-col>
      <el-col :span="6">
        <form-item-label label="Intervalos de habilidade" />
        <el-input type="number" v-model="numberOfGroups"></el-input>
      </el-col>
      <el-col :span="6">
        <form-item-label label="Parâmetros estimados" />
        <div>Dificuldade (b): {{ difficultyParameter }}</div>
        <div>Discriminação (a): {{ discriminationParameter }}</div>
      </el-col>
    </el-row>
    <plot :data="data" :layout="plotLayout" />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "nuxt-property-decorator";
import Plot from "./Plot.vue";
import { CsvData } from "~/types/CsvData";
import { max, min, range } from "mathjs";
import ItemCharacteristicCurveFunction from "~/types/ItemCharacteristicCurveFunction";
import TestApplication from "~/types/TestApplication";
import CciPlotParameters from "~/types/CciPlotParameters";

@Component({
  components: {
    Plot
  }
})
export default class ParametersEstimationPlot extends Vue {
  @Prop() testApplication!: TestApplication;
  @Prop() testApplicationData!: CsvData;
  @Prop({ default: true }) showInputs!: boolean;

  probabilityExpression!: string;
  data: any[] = [];
  numberOfGroups = 40;
  firstOrderId = 1;
  lastOrderId = 12;
  maxHabilityScore = 10;
  difficultyParameter = 0;
  discriminationParameter = 2;
  probabilityFunction = new ItemCharacteristicCurveFunction();

  updateData() {
    const usersAndTheirScores = this.calculatAverageScoreInHarderstItemsPerUser();

    let traces: any[] = [];
    this.$emit("onStartEstimate");

    range(this.firstOrderId, this.lastOrderId, true).forEach(itemOrderId => {
      const probabilityRange = this.calculateProbabilityOfCorrectnessByAbilityRange(
        itemOrderId,
        usersAndTheirScores
      );

      const itemCharacteristicCurve = {
        x: this.abilityRange,
        y: probabilityRange,
        mode: "markers",
        marker: { size: 5 },
        name: `Item ${itemOrderId}`
      };

      traces.push(itemCharacteristicCurve);

      let parameters = this.probabilityFunction.estimateItemParameters(
        this.abilityRange,
        probabilityRange
      );
      this.difficultyParameter = parameters.difficulty;
      this.discriminationParameter = parameters.discrimination;

      this.$emit("onChangePlotParameters", {
        difficulty: parameters.difficulty,
        discrimination: parameters.discrimination,
        itemName: `Item ${itemOrderId}`,
        itemNumber: itemOrderId
      } as CciPlotParameters);
    });

    this.data = traces;
  }

  getHarderstItems() {
    const orderIdsHardestItems = this.getOrderIdsOfHardestItems();
    const dataRowsHarderstItems = this.testApplicationData?.rows.filter(row => {
      return orderIdsHardestItems.find(
        orderIdOfOneOfTheHardestItems =>
          orderIdOfOneOfTheHardestItems == row["item_order"]
      );
    });
    return dataRowsHarderstItems;
  }

  calculatAverageScoreInHarderstItemsPerUser(): Map<
    string,
    { averageScore: number }
  > {
    const dataRowsHarderstItems = this.getHarderstItems();

    let averageHarderstItemsUserScore = new Map<
      string,
      { countOccurrences: number; averageScore: number }
    >();

    dataRowsHarderstItems.forEach(row => {
      let userId = row["usuario"];
      let mapAlreadyHaveUser = averageHarderstItemsUserScore.get(userId);
      if (!mapAlreadyHaveUser) {
        averageHarderstItemsUserScore.set(userId, {
          countOccurrences: 0,
          averageScore: 0
        });
      }
      let scorePerUser = averageHarderstItemsUserScore.get(userId);
      let rowScore: number = parseFloat(row["escore_obtido"]);
      if (scorePerUser) {
        scorePerUser.countOccurrences++;
        scorePerUser.averageScore += rowScore;
      }
    });
    averageHarderstItemsUserScore.forEach(scorePerUser => {
      scorePerUser.averageScore =
        scorePerUser.averageScore / scorePerUser.countOccurrences;
    });
    return averageHarderstItemsUserScore;
  }

  getOrderIdsOfHardestItems(): number[] {
    const mapAvgScoresByItems = new Map<
      number,
      { countOccurrences: number; scoreTotal: number }
    >();
    this.testApplicationData?.rows
      .filter(row => row["tutorial"] == "F")
      .map(row => {
        return {
          selectedItemOrderId: parseFloat(row["item_order"]),
          userScore: parseFloat(row["escore_obtido"])
        };
      })
      .forEach(
        (scoreByItem: { selectedItemOrderId: number; userScore: number }) => {
          if (!mapAvgScoresByItems.get(scoreByItem.selectedItemOrderId)) {
            mapAvgScoresByItems.set(scoreByItem.selectedItemOrderId, {
              countOccurrences: 0,
              scoreTotal: 0
            });
          }
          let item = mapAvgScoresByItems.get(scoreByItem.selectedItemOrderId);
          if (item) {
            item.countOccurrences++;
            item.scoreTotal += scoreByItem.userScore;
          }
        }
      );

    let items: { orderId: number; userScore: number }[] = [];
    mapAvgScoresByItems.forEach((scoreByItem, orderId) => {
      let userScore = scoreByItem.scoreTotal / scoreByItem.countOccurrences;
      items.push({ orderId, userScore });
    });
    items.sort((a, b) => a.userScore - b.userScore);

    let percentItemsToGet = 0.75;
    if (items.length > 5) {
      percentItemsToGet = 0.5;
    }
    if (items.length > 10) {
      percentItemsToGet = 0.333;
    }
    let hardestItems = items.slice(
      0,
      Math.floor(items.length * percentItemsToGet)
    );

    return hardestItems.map(it => it.orderId);
  }

  get step() {
    return this.maxHabilityScore / this.numberOfGroups;
  }

  get groupsRange() {
    return range(
      0,
      this.maxHabilityScore,
      this.step,
      true
    ).toArray() as number[];
  }

  get abilityRange() {
    return this.groupsRange.map(x => (6 / 10) * x - 3);
  }

  calculateProbabilityOfCorrectnessByAbilityRange(
    itemOrderId: number,
    usersAndTheirScores: Map<string, { averageScore: number }>
  ) {
    const mapUsersByScoreGroup = new Map<number, string[]>();

    this.groupsRange.forEach(groupNumber => {
      const usersFitInGroup: string[] = [];

      usersAndTheirScores.forEach((scorePerUser, userId: string) => {
        const userScore = scorePerUser.averageScore;
        const userScoreFitInGroup =
          groupNumber > userScore && userScore <= groupNumber + this.step;
        if (userScoreFitInGroup) {
          usersFitInGroup.push(userId);
        }
      });

      mapUsersByScoreGroup.set(groupNumber, usersFitInGroup);
    });

    const probabilityRange = this.groupsRange.map(groupNumber => {
      let probability = 0;
      const usersInGroup = mapUsersByScoreGroup.get(groupNumber);
      if (usersInGroup) {
        const averageItemScoreByUsersInThisAbilityRangeGroup = this.testApplicationData?.rows
          .filter(row => {
            return (
              usersInGroup.indexOf(row["usuario"]) > -1 &&
              row["item_order"] == itemOrderId - 1
            );
          })
          .map(row => {
            return parseFloat(row["escore_obtido"]);
          })
          .reduce((previousScore, currentScore) => {
            return (previousScore + currentScore) / 2;
          }, 0);
        probability =
          averageItemScoreByUsersInThisAbilityRangeGroup /
          this.maxHabilityScore;
      }

      return probability;
    });

    let maxProbability = max(probabilityRange);
    const normalizedProbability = probabilityRange.map(p => p / maxProbability);

    return normalizedProbability;
  }

  get plotLayout() {
    return {
      title: "Estimação de parâmetros",
      xaxis: {
        title: "Habilidade",
        range: [-3, 3]
      },
      yaxis: {
        tickmode: "array",
        tickvals: [0, 0.5, 1],
        title: "Probabilidade de acerto total"
      }
    };
  }

  @Watch("firstOrderId")
  onUpdateFirstOrderId() {
    this.updateData();
  }

  @Watch("lastOrderId")
  onUpdateLastOrderId() {
    this.updateData();
  }

  @Watch("numberOfGroups")
  onUpdateNumberOfGroups() {
    this.updateData();
  }

  @Watch("testApplicationData", { immediate: true })
  onChangeTestApplicationData() {
    let itemOrders = this.testApplicationData?.rows.map(it => it["item_order"]);
    if (itemOrders?.length) {
      this.firstOrderId = min(itemOrders) + 1;
      this.lastOrderId = max(itemOrders) + 1;
    }
    this.updateData();
  }
}
</script>