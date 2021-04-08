<template>
  <div>
    <centered-logo />
    <div class="center result-page">
      <h1>{{ congratsMessage }}</h1>
      <icon maxWidth="400" name="star" class="star" />
      <p class="hability-paragraph">
        Seu nível de habilidade é
        {{ ((totalGrade / maxGrade) * 100).toFixed(0) + "" }}%
      </p>
      <div
        class="score-item"
        :key="itemResponse.id"
        v-for="(itemResponse, index) in participation.itemResponses"
      >
        <div class="flex-row">
          <div class="item">
            Item {{ index + 1 }}
            <!-- <thumbnail :src="itemResponse.testItem.item.thumbnail" /> -->
          </div>
          <div class="score" style="flex-grow: 1">
            <el-progress
              :text-inside="true"
              :stroke-width="26"
              color="#67c23a"
              :percentage="getPercentage(itemResponse)"
            ></el-progress>
          </div>
          <div class="result-message">{{ getItemMessage(itemResponse) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Action } from "nuxt-property-decorator";
import Participation from "~/types/Participation";
import { Context } from "@nuxt/types";
import ItemResponse from "~/types/ItemResponse";
import { ACTION_GET_BY_ID_PUBLIC_PARTICIPATION } from "~/store/participations";

@Component({
  auth: false,
})
export default class extends Vue {
  participation!: Participation;

  async asyncData(ctx: Context) {
    const participationId = ctx.params.participationId;
    const participation = await ctx.store.dispatch(
      ACTION_GET_BY_ID_PUBLIC_PARTICIPATION,
      participationId
    );
    return {
      participation,
    };
  }

  getPercentage(itemResponse: ItemResponse) {
    return (itemResponse.score.score / itemResponse.score.max) * 100;
  }

  getItemMessage(itemResponse: ItemResponse) {
    let percentage = this.getPercentage(itemResponse);
    let message = "Pode melhorar";
    if (percentage > 25) {
      message = "Bom";
    }
    if (percentage > 50) {
      message = "Muito bom";
    }
    if (percentage > 75) {
      message = "Ótimo";
    }
    if (percentage > 100) {
      message = "Perfeito!";
    }
    return message;
  }

  get scores() {
    const itemResponses = this.participation.itemResponses;
    return itemResponses.map((itemResponse) => itemResponse.score);
  }

  get congratsMessage(): string {
    let congratMessage = "Parabéns chegado ao final!";
    if (this.totalGrade / this.maxGrade > 0.25) {
      congratMessage = "Seu resultado foi bom!";
    }
    if (this.totalGrade / this.maxGrade > 0.5) {
      congratMessage = "Muito bom!";
    }
    if (this.totalGrade / this.maxGrade > 0.75) {
      congratMessage = "Ótimo!";
    }
    if (this.totalGrade / this.maxGrade > 0.9) {
      congratMessage = "Incrível!";
    }
    if (this.totalGrade / this.maxGrade > 0.99) {
      congratMessage = "Estupendo!";
    }
    return congratMessage;
  }

  get totalGrade(): number {
    return this.scores
      .map((score) => score.score)
      .reduce((prev: number, current: number) => prev + current, 0);
  }

  get maxGrade(): number {
    return this.scores
      .map((score) => score.max)
      .reduce((prev: number, current: number) => prev + current, 0);
  }
}
</script>
<style lang="scss">
.result-page {
  margin: 0 auto;
  padding: 30px;
  .star {
    color: #ffb616;
    font-size: 90pt;
  }
  .hability-paragraph {
    font-size: 20pt;
    margin: 20px 0;
  }
  .score-item {
    .item {
      font-size: 20pt;
    }
    .score {
      margin: auto 20px;
    }
    .result-message {
      width: 100px;
    }
    margin: 10px auto;
  }
}
@media (min-width: 1000px) {
  .result-page {
    max-width: 60%;
  }
}
</style>