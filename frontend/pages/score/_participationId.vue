<template>
  <div>
    <div class="center result-page">
      <div>
        <div>
          <div class="fundo-branco">
            <div style="display: flex; flex-direction: column; align-items: center;">
              <h2 style="padding: 16px 0;">
                Gráfico de escore final por pilares do Pensamento Computacional
              </h2>
              <canvas id="radarChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <el-button id="playAgainBtn" :style="{ background: playAgainButtonColor }" @click="playAgain">Novo
        jogo</el-button>
      <test-application-url-input ref="urlInput" style="display:none" :showAccessIcon="true"
        :test-application.sync="participation.application" />


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
import Score from "~/types/Score";
import { ACTION_GET_BY_ID_PUBLIC_PARTICIPATION } from "~/store/participations";
import { secondsToHms } from "~/utils/utils";
import { filter } from "mathjs";
import Chart from 'chart.js';


@Component({
  auth: false,
  components: {
    TestApplicationUrlInput
  }
})
export default class extends Vue {
  participation!: Participation;
  playAgainDialogVisible = true;


  createRadarChart(): void {
    const canvas = document.getElementById('radarChart') as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Labels fixos
    const labels = ['Abstração', 'Algoritmo', 'Reconhecimento de Padrões', 'Decomposição'];

    let MaxAbstracao = 0;
    let MaxAlgoritmo = 0;
    let MaxReconhecimentoDePadroes = 0;
    let MaxDecomposicao = 0;
    let totalAbstracao = 0;
    let totalAlgoritmo = 0;
    let totalReconhecimentoDePadroes = 0;
    let totalDecomposicao = 0;

    // Obtém o valor máximo de cada pilar
    const pesosMedia = this.getPesosMediaPorMecanica();
    const mechanicCount = this.getMechanicCountByPhase();

    for (const mechanicId in pesosMedia) {
      const numericMechanicId = Number(mechanicId);
      const quantidadeFases = mechanicCount[numericMechanicId] || 0;

      MaxAbstracao += pesosMedia[mechanicId].peso_abstracao * quantidadeFases
      MaxAlgoritmo += pesosMedia[mechanicId].peso_algoritmo * quantidadeFases;
      MaxReconhecimentoDePadroes += pesosMedia[mechanicId].peso_reconhecimentoDePadroes * quantidadeFases;
      MaxDecomposicao += pesosMedia[mechanicId].peso_decomposicao * quantidadeFases;

      console.log(`Mecânica ${numericMechanicId} - Quantidade de Fases: ${quantidadeFases}`);
      console.log(`Pesos Média para Mecânica ${numericMechanicId}:`, pesosMedia[mechanicId]);
    }
    
    // Calcula os totais a partir das respostas
    this.participation.itemResponses.forEach((itemResponse) => {
      try {
        const json = JSON.parse(itemResponse.score.json);
        totalAbstracao += json.abstracao ?? 0;
        totalAlgoritmo += json.algoritmo ?? 0;
        totalReconhecimentoDePadroes += json.reconhecimentoDePadroes ?? 0;
        totalDecomposicao += json.decomposicao ?? 0;
      } catch (e) { }
    });

    const datasets = [
      {
        label: "Escore",
        data: [
          totalAbstracao.toFixed(2),
          totalAlgoritmo.toFixed(2),
          totalReconhecimentoDePadroes.toFixed(2),
          totalDecomposicao.toFixed(2)
        ],
        backgroundColor: "rgba(100, 181, 246, 0.2)",
        borderColor: "rgba(100, 181, 246, 1)",
        pointBackgroundColor: "rgba(100, 181, 246, 1)",
      },
      {
        label: "Valor Máximo",
        data: [
          MaxAbstracao.toFixed(2),
          MaxAlgoritmo.toFixed(2),
          MaxReconhecimentoDePadroes.toFixed(2),
          MaxDecomposicao.toFixed(2)
        ],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
      }
    ];


    new Chart(ctx, {
      type: 'radar',
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        scale: {
          ticks: {
            beginAtZero: true,
            fontFamily: 'Tahoma, Arial, sans-serif', // igual ao .label-text
            fontSize: 15,                            // igual ao .label-text (15pt ≈ 20px)
            fontColor: '#464646',                    // igual ao .label-text
            fontStyle: 'normal',
          },
          pointLabels: {
            fontFamily: 'Tahoma, Arial, sans-serif',
            fontSize: 15,
            fontColor: '#464646',
            fontStyle: 'normal',
          }
        },
        legend: {
          labels: {
            fontFamily: 'Tahoma, Arial, sans-serif',
            fontSize: 15,
            fontColor: '#464646',
            fontStyle: 'normal',
          }
        }
      }
    });
  }



  @Ref("urlInput")
  urlInput!: TestApplicationUrlInput;
  playAgainButtonColor: string = 'rgb(10,10,10)';

  async asyncData(ctx: Context) {
    const participationId = ctx.params.participationId;
    const participation = await ctx.store.dispatch(
      ACTION_GET_BY_ID_PUBLIC_PARTICIPATION,
      participationId
    );


    participation.itemResponses = participation
      .itemResponses
      .filter((a: ItemResponse) => !a.testItem.item.isTutorial)
      .sort((a: ItemResponse, b: ItemResponse) => a.testItem.order - b.testItem.order)

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

  getMechanicId(itemResponse: ItemResponse) {
    try {
      return itemResponse.testItem.item.mechanic?.id ?? null;
    } catch (e) {
      return null;
    }
  }

  getPesosMediaMultiplicadoPorQuantidade(): Record<number, {
    peso_abstracao: number,
    peso_algoritmo: number,
    peso_reconhecimentoDePadroes: number,
    peso_decomposicao: number
  }> {
    const pesosMedia = this.getPesosMediaPorMecanica();
    const mechanicCount = this.getMechanicCountByPhase();
    const pesosMultiplicados: Record<number, {
      peso_abstracao: number,
      peso_algoritmo: number,
      peso_reconhecimentoDePadroes: number,
      peso_decomposicao: number
    }> = {};

    for (const mechanicId in pesosMedia) {
      const numericMechanicId = Number(mechanicId);
      const mediasMecanica = pesosMedia[mechanicId];
      const quantidadeFases = mechanicCount[numericMechanicId] || 0;

      pesosMultiplicados[numericMechanicId] = {
        peso_abstracao: mediasMecanica.peso_abstracao * quantidadeFases,
        peso_algoritmo: mediasMecanica.peso_algoritmo * quantidadeFases,
        peso_reconhecimentoDePadroes: mediasMecanica.peso_reconhecimentoDePadroes * quantidadeFases,
        peso_decomposicao: mediasMecanica.peso_decomposicao * quantidadeFases
      };
    }

    return pesosMultiplicados;
  }

  getMechanicCountByPhase(): Record<number, number> {
    const mechanicCount: Record<number, number> = {};
    this.participation.itemResponses.forEach(itemResponse => {
      const mechanicId = itemResponse.testItem?.item?.mechanic?.id;
      if (mechanicId !== undefined && mechanicId !== null) {
        mechanicCount[mechanicId] = (mechanicCount[mechanicId] || 0) + 1;
      }
    });
    return mechanicCount;
  }

  getPesosSomaPorMecanica(): Record<number, {
    peso_abstracao: number,
    peso_algoritmo: number,
    peso_reconhecimentoDePadroes: number,
    peso_decomposicao: number
  }> {
    const pesosPorMecanica: Record<number, {
      peso_abstracao: number,
      peso_algoritmo: number,
      peso_reconhecimentoDePadroes: number,
      peso_decomposicao: number
    }> = {};

    this.participation.itemResponses.forEach(itemResponse => {
      const mechanicId = itemResponse.testItem?.item?.mechanic?.id;
      if (mechanicId !== undefined && mechanicId !== null) {
        try {
          const json = JSON.parse(itemResponse.score.json);

          if (!pesosPorMecanica[mechanicId]) {
            pesosPorMecanica[mechanicId] = {
              peso_abstracao: 0,
              peso_algoritmo: 0,
              peso_reconhecimentoDePadroes: 0,
              peso_decomposicao: 0
            };
          }

          pesosPorMecanica[mechanicId].peso_abstracao += json.peso_abstracao || 0;
          pesosPorMecanica[mechanicId].peso_algoritmo += json.peso_algoritmo || 0;
          pesosPorMecanica[mechanicId].peso_reconhecimentoDePadroes += json.peso_reconhecimentoDePadroes || 0;
          pesosPorMecanica[mechanicId].peso_decomposicao += json.peso_decomposicao || 0;
        } catch (e) {
          console.log('Erro ao parsear JSON do score:', e);
        }
      }
    });

    return pesosPorMecanica;
  }

  getPesosMediaPorMecanica(): Record<number, {
    peso_abstracao: number,
    peso_algoritmo: number,
    peso_reconhecimentoDePadroes: number,
    peso_decomposicao: number
  }> {
    const pesosSoma = this.getPesosSomaPorMecanica();
    const mechanicCount = this.getMechanicCountByPhase();
    const pesosMedia: Record<number, {
      peso_abstracao: number,
      peso_algoritmo: number,
      peso_reconhecimentoDePadroes: number,
      peso_decomposicao: number
    }> = {};

    for (const mechanicId in pesosSoma) {
      const numericMechanicId = Number(mechanicId);
      const pesosMecanica = pesosSoma[mechanicId];
      const numeroFases = mechanicCount[numericMechanicId] || 1; // Evita divisão por zero

      pesosMedia[numericMechanicId] = {
        peso_abstracao: pesosMecanica.peso_abstracao / numeroFases,
        peso_algoritmo: pesosMecanica.peso_algoritmo / numeroFases,
        peso_reconhecimentoDePadroes: pesosMecanica.peso_reconhecimentoDePadroes / numeroFases,
        peso_decomposicao: pesosMecanica.peso_decomposicao / numeroFases
      };
    }

    return pesosMedia;
  }

  getUniqueMechanicCount(): number {
    const uniqueIds = new Set<number>();
    this.participation.itemResponses.forEach(itemResponse => {
      const mechanicId = itemResponse.testItem?.item?.mechanic?.id;
      if (mechanicId !== undefined && mechanicId !== null) {
        uniqueIds.add(mechanicId);
      }
    });
    return uniqueIds.size;
  }

  getItemName(itemResponse: ItemResponse) {
    return itemResponse.testItem.item.name;;
  }

  getPercentage(itemResponse: ItemResponse) {
    const score = itemResponse.score.score;
    const max = itemResponse.score.max;

    if (!max || max <= 0) {
      return 0; // Retorna 0 se o valor máximo for inválido ou zero
    }

    const percentage = (score / max) * 100;

    // Garante que o valor esteja entre 0 e 100
    return Math.min(Math.max(parseInt(percentage.toFixed(0)), 0), 100);
  }

  getJson(itemResponse: ItemResponse) {
    try {
      const response = JSON.parse(itemResponse.score.json)
      return response;
    } catch (e) {
      console.log(e);
      return {};
    }
  }



  getTempoEmSegundos(itemResponse: ItemResponse) {
    try {
      const response = JSON.parse(itemResponse.response)
      return parseInt(response["tempoEmSegundos"])
    } catch (e) {
      console.log(e);
      return 0;
    }
  }

  formataTempo(valor: any) {
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
    this.createRadarChart();

  }

}
</script>
<style lang="scss">
html {
  background: rgba(210, 207, 207, 0.714);
}

.fundo-branco {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 24px #0002;
  padding: 32px 24px;
  margin: 32px auto;
  justify-content: center;
  align-items: center;
}

.label-text {
  color: #464646;
  font-style: Tahoma;
  font-size: 15pt;
  font-weight: normal !important; // <-- Adicione esta linha
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
  .top-number-item {
    font-size: 20pt;
    background: #fffaae;
    padding: 20px;
    margin: 30px;
    border-radius: 20px;
    font-weight: bold;
    border: 4px dashed #ffc19c;
    box-shadow: 0 0 6px #0000002e;

    .top-number-item-label {
      color: #67c23a;
      text-shadow: 1px 1px gray;
    }

    .top-number-item-number {
      color: #67c23a;
      text-shadow: 1px 1px gray;
    }
  }
}

#playAgainBtn {
  box-shadow: 0 0 6px #0000002e;
  transition: background-color 0.8s;
  font-weight: bold;
  border-radius: 20px;
  font-size: 30pt;
  margin: 30pt;
  border: 2px dashed rgba(255, 255, 255, 0.232);
  color: white;
  text-shadow: 2px 2px black;
}
</style>