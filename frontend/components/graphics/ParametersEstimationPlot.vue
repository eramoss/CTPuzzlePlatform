<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <form-item-label label="Número do item" />
        <el-input type="number" v-model="itemOrder"></el-input>
      </el-col>
      <el-col :span="6">
        <form-item-label label="Intervalos de habilidade" />
        <el-input type="number" v-model="numberOfGroups"></el-input>
      </el-col>
      <el-col>
        Dificuldade: {{ difficultyParameter }} <br />Discriminação:
        {{ discriminationParameter }}</el-col
      >
    </el-row>
    <plot :data="data" :layout="plotLayout" />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "nuxt-property-decorator";
import Plot from "./Plot.vue";
import { CsvData } from "~/types/CsvData";
import { range } from "mathjs";
import ItemCharacteristicCurveFunction from "~/types/ItemCharacteristicCurveFunction";

@Component({
  components: {
    Plot,
  },
})
export default class ParametersEstimationPlot extends Vue {
  @Prop() testApplicationData!: CsvData;
  probabilityExpression!: string;
  data: any[] = [];
  numberOfGroups = 40;
  itemOrder = 12;
  maxHabilityScore = 10;
  difficultyParameter = 0;
  discriminationParameter = 2;
  probabilityFunction = new ItemCharacteristicCurveFunction();

  updateData() {
    const usersAndTheirScores = this.calculatAverageScoreInHarderstItemsPerUser();

    const step = this.maxHabilityScore / this.numberOfGroups;
    const groupsRange = range(
      0,
      this.maxHabilityScore,
      step,
      true
    ).toArray() as number[];

    const mapUsersByScoreGroup = new Map<number, string[]>();
    groupsRange.forEach((groupNumber) => {
      const usersFitInGroup: string[] = [];
      usersAndTheirScores.forEach((scorePerUser, userId: string) => {
        const userScore = scorePerUser.averageScore;
        if (groupNumber > userScore && userScore <= groupNumber + step) {
          usersFitInGroup.push(userId);
        }
      });
      mapUsersByScoreGroup.set(groupNumber, usersFitInGroup);
    });

    const probabilityRange = groupsRange.map((groupNumber) => {
      let probability = 0;
      const usersInGroup = mapUsersByScoreGroup.get(groupNumber);
      if (usersInGroup) {
        const averageItemScoreByUsersInThisAbilityRangeGroup = this.testApplicationData?.rows
          .filter((row) => {
            return (
              usersInGroup.indexOf(row["usuario"]) > -1 &&
              row["item_order"] == this.itemOrder - 1
            );
          })
          .map((row) => {
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

    const abilityRange = groupsRange.map(
      (value) => value / this.maxHabilityScore - 3
    );

    var trace1 = {
      x: abilityRange,
      y: probabilityRange,
      mode: "markers",
      marker: { size: 5 },
    };

    let parameters = this.probabilityFunction.maximumLikelihoodEstimation(
      abilityRange,
      probabilityRange
    );
    this.difficultyParameter = parameters.difficulty;
    this.discriminationParameter = parameters.discrimination;

    this.$emit("onChangePlotParameters", parameters);

    this.data = [trace1];
  }

  getOrderIdsOfHardestItems(): number[] {
    const mapAvgScoresByItems = new Map<
      number,
      { countOccurrences: number; scoreTotal: number }
    >();
    this.testApplicationData.rows
      .map((row) => {
        return {
          itemOrder: parseFloat(row["item_order"]),
          userScore: parseFloat(row["escore_obtido"]),
        };
      })
      .forEach((scoreByItem: { itemOrder: number; userScore: number }) => {
        if (!mapAvgScoresByItems.get(scoreByItem.itemOrder)) {
          mapAvgScoresByItems.set(scoreByItem.itemOrder, {
            countOccurrences: 0,
            scoreTotal: 0,
          });
        }
        let item = mapAvgScoresByItems.get(scoreByItem.itemOrder);
        if (item) {
          item.countOccurrences++;
          item.scoreTotal += scoreByItem.userScore;
        }
      });

    let items: { orderId: number; userScore: number }[] = [];
    mapAvgScoresByItems.forEach((scoreByItem, orderId) => {
      let userScore = scoreByItem.scoreTotal / scoreByItem.countOccurrences;
      items.push({ orderId, userScore });
    });
    items.sort((a, b) => a.userScore - b.userScore);
    let hardestItems = items.slice(0, Math.ceil(items.length * 0.25));

    return hardestItems.map((it) => it.orderId);
  }

  calculatAverageScoreInHarderstItemsPerUser(): Map<
    string,
    { countOccurrences: number; averageScore: number }
  > {
    const orderIdsHardestItems = this.getOrderIdsOfHardestItems();
    let mapTotalScorePerUser = new Map<
      string,
      { countOccurrences: number; averageScore: number }
    >();

    this.testApplicationData.rows
      .filter((row) => {
        return orderIdsHardestItems.find(
          (orderIdOfOneOfTheHardestItems) =>
            orderIdOfOneOfTheHardestItems == row["item_order"]
        );
      })
      .forEach((row) => {
        let userId = row["usuario"];
        if (!mapTotalScorePerUser.get(userId)) {
          mapTotalScorePerUser.set(userId, {
            countOccurrences: 0,
            averageScore: 0,
          });
        }
        let scorePerUser = mapTotalScorePerUser.get(userId);
        let rowScore: number = parseFloat(row["escore_obtido"]);
        if (scorePerUser) {
          scorePerUser.countOccurrences++;
          scorePerUser.averageScore += rowScore;
        }
      });
    mapTotalScorePerUser.forEach((scorePerUser) => {
      scorePerUser.averageScore /= scorePerUser.countOccurrences;
    });
    return mapTotalScorePerUser;
  }

  get plotLayout() {
    return {
      title: "Estimação de parâmetros",
      xaxis: {
        title: "Habilidade",
      },
      yaxis: {
        range: [0, 1],
        title: "Probabilidade de acerto total",
      },
    };
  }

  @Watch("itemOrder")
  onUpdateItemOrder() {
    this.updateData();
  }

  @Watch("numberOfGroups")
  onUpdateNumberOfGroups() {
    this.updateData();
  }

  @Watch("testApplicationData", { immediate: true })
  onChangeTestApplicationData() {
    this.updateData();
  }
}
</script>