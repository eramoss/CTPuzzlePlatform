<template>
  <div>


    <div class="center result-page">

      <el-button id="playAgainBtn" :style="{background:playAgainButtonColor}" @click="playAgain">Novo jogo</el-button>
      <test-application-url-input ref="urlInput" style="display:none" :showAccessIcon="true"
        :test-application.sync="participation.application" />

      <div id="topNumbers">

        <div class="top-number-item">
          <b class="top-number-item-label">Pontos:</b>
          <b class="top-number-item-number">{{ totalGrade.toFixed(0) }}</b>
        </div>
        
        <div class="top-number-item">
          <b class="top-number-item-label">Tempo total:</b>
          <b class="top-number-item-number">{{ formataTempo(getTempoTotal()) }}</b>
        </div>

      </div>

      <div class="score-item" :key="itemResponse.id" v-for="(itemResponse, index) in participation.itemResponses">
        <div class="flex-row">
          <div class="item">
            <i>Fase {{ index + 1 }}</i>
          </div>
          <div class="score" style="flex-grow: 1">
            <el-progress :text-inside="true" :show-text="false" :stroke-width="26" color="#67c23a"
              :percentage="getPercentage(itemResponse)"></el-progress>
          </div>
          <strong>Tempo: {{formataTempo(getTempoEmSegundos(itemResponse))}}</strong>
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
import { secondsToHms } from "~/utils/utils";

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
    return parseInt(((itemResponse.score.score / itemResponse.score.max) * 100).toFixed(0));
  }

  getTempoEmSegundos(itemResponse: ItemResponse) {
    try{
      const response = JSON.parse(itemResponse.response)
      return parseInt(response["tempoEmSegundos"])
    }catch(e){
      console.log(e);
      return 0;
    }
  }

  formataTempo(valor:any){
    return secondsToHms(valor);
  }

  getTempoTotal() {
    let total = 0;
    this.participation.itemResponses.forEach(i => {
      total += this.getTempoEmSegundos(i)
    })
    return total;
  }

  get scores() {
    const itemResponses = this.participation.itemResponses;
    return itemResponses.map((itemResponse) => itemResponse.score);
  }

  get totalGrade(): number {
    let total = 0
    this.scores.forEach(s => {
      let score = s.score + ''
      total += parseFloat(score)
    })
    return total;
  }

  mounted() {
    setInterval(() => {
      this.playAgainButtonColor = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`
    }, 500)
  }

}
</script>
<style lang="scss">
html{
    background: rgb(173, 255, 240);
}
.result-page {
  margin: 0 auto;
  padding: 30px;

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

#topNumbers {
  .top-number-item{
    font-size: 20pt;
    background: #fffaae;
    padding: 20px;
    margin: 30px;
    border-radius: 20px;
    font-weight: bold;
    border: 4px dashed #ffc19c;
    box-shadow: 0 0 6px #0000002e;

    .top-number-item-label{
      color:#67c23a;
    }
    .top-number-item-number{
      color:#67c23a;
    }
  }
}

#playAgainBtn {
  transition: background-color 0.8s;
  font-weight: bold;
  font-size: 30pt;
  margin: 30pt;
  color: white;
}
</style>