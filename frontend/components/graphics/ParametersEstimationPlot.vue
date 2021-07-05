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
    </el-row>
    <plot :data="data" :layout="plotLayout" />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "nuxt-property-decorator";
import Plot from "./Plot.vue";
import { CsvData } from "~/types/CsvData";
import { map, range } from "mathjs";

@Component({
  components: {
    Plot,
  },
})
export default class ParametersEstimationPlot extends Vue {
  @Prop() testApplicationData!: CsvData;
  data: any[] = [];
  numberOfGroups = 40;
  itemOrder = 11;
  maxHabilityScore = 10;

  updateData() {
    const totalScoreByPerson = this.calculateTotalScoreByPerson();

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
      totalScoreByPerson.forEach((scorePerUser, userId: string) => {
        const score = scorePerUser.score;
        if (groupNumber > score && score <= groupNumber + step) {
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
              row["item_order"] == this.itemOrder
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

    var trace1 = {
      x: groupsRange,
      y: probabilityRange,
      mode: "markers",
      marker: { size: 5 },
    };
    this.data = [trace1];
  }

  calculateTotalScoreByPerson(): Map<
    string,
    { countOccurrences: number; score: number }
  > {
    let mapTotalScorePerUser = new Map<
      string,
      { countOccurrences: number; score: number }
    >();
    this.testApplicationData.rows.forEach((row) => {
      let userId = row["usuario"];
      if (!mapTotalScorePerUser.get(userId)) {
        mapTotalScorePerUser.set(userId, { countOccurrences: 0, score: 0 });
      }
      let scorePerUser = mapTotalScorePerUser.get(userId);
      let rowScore: number = parseFloat(row["escore_obtido"]);
      if (scorePerUser) {
        scorePerUser.countOccurrences++;
        scorePerUser.score += rowScore;
      }
    });
    mapTotalScorePerUser.forEach((scorePerUser) => {
      scorePerUser.score /= scorePerUser.countOccurrences;
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
        title: "Probabilidade de acerto",
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