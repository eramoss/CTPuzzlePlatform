<template>
  <div>


    <div class="center result-page">

      <el-button id="playAgainBtn" :style="{background:playAgainButtonColor}" @click="playAgain">Novo jogo</el-button>
      <test-application-url-input ref="urlInput" style="display:none" :showAccessIcon="true"
        :test-application.sync="participation.application" />
      
      <p class="hability-paragraph">
        Pontuação:
        {{ ((totalGrade / maxGrade) * 100).toFixed(0) + "" }}%
      </p>
      <div class="score-item" :key="itemResponse.id" v-for="(itemResponse, index) in participation.itemResponses">
        <div class="flex-row">
          <div class="item">
            Item {{ index + 1 }}
            <!-- <thumbnail :src="itemResponse.testItem.item.thumbnail" /> -->
          </div>
          <div class="score" style="flex-grow: 1">
            <el-progress :text-inside="true" :stroke-width="26" color="#67c23a"
              :percentage="getPercentage(itemResponse)"></el-progress>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Action, Ref } from "nuxt-property-decorator";
import Participation from "~/types/Participation";
import TestApplicationUrlInput from "~/components/TestApplicationUrlInput.vue";
import { Context } from "@nuxt/types";
import ItemResponse from "~/types/ItemResponse";
import { ACTION_GET_BY_ID_PUBLIC_PARTICIPATION } from "~/store/participations";

@Component({
  auth: false,
  components: {
    TestApplicationUrlInput
  }
})
export default class extends Vue {
  participation!: Participation;
  playAgainDialogVisible = true

  @Ref("urlInput")
  urlInput!: TestApplicationUrlInput;
  playAgainButtonColor: string = 'rgb(10,10,10)';

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

  playAgain() {
    const applicationUrl = this.participation.application.url
    debugger
    //@ts-ignore
    window.location = applicationUrl
  }

  getPercentage(itemResponse: ItemResponse) {
    return (itemResponse.score.score / itemResponse.score.max) * 100;
  }

  get scores() {
    const itemResponses = this.participation.itemResponses;
    return itemResponses.map((itemResponse) => itemResponse.score);
  }

  get congratsMessage(): string {
    let congratMessage = "Parabéns. Você chegou ao final!";
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
    let total = 0
    this.scores.forEach(s=>{
      let score = s.score+''
      total+= parseFloat(score)
    })
    return total;
  }

  get maxGrade(): number {
    let total = 0
    this.scores.forEach(s=>{
      let score = s.max+''
      total+= parseFloat(score)
    })
    return total;
  }

  mounted(){
    setInterval(()=>{
      this.playAgainButtonColor = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`
    },500)
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

    margin: 10px auto;
  }
}

@media (min-width: 1000px) {
  .result-page {
    max-width: 60%;
  }
}

#playAgainBtn{
  transition: background-color 0.8s;
  font-weight: bold;
  font-size: 30pt;
  margin: 30pt;
  color: white;
}
</style>