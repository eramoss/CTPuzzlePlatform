<template>
  <div>
    <card-panel :header="header" :loading="loading">
      <template slot="info">
        Mostra o número de participações diárias em todos os testes.
      </template>

      <div slot="top-right">
        <div class="flex-row">
          <select-tests
            class="right-marged"
            v-model="selectedTest"
            @input="loadData"
          />
          <el-tooltip
            content="Intervalo em dias"
            effect="light"
            placement="top"
          >
            <el-select
              value-key="days"
              v-model="daysInterval"
              placeholder="Intervalo em dias"
            >
              <el-option
                v-for="interval in intervals"
                :key="interval.days"
                :label="`${interval.days} dia${interval.days > 1 ? 's' : ''}`"
                :value="interval"
              >
              </el-option>
            </el-select>
          </el-tooltip>
        </div>
      </div>
      <plot :data="graphicData" :layout="plotLayout" />
    </card-panel>
  </div>
</template>
<script lang="ts">
import { Action, Component, Prop } from "nuxt-property-decorator";
import Vue from "vue";
import CardPanel from "~/components/CardPanel.vue";
import Plot from "~/components/graphics/Plot.vue";
import SelectTests from "~/components/SelectTests.vue";
import { ACTION_GET_PARTICIPATIONS_PER_TIME } from "~/store/participations";
import ParticipationCount from "~/types/ParticipationCount";
import Test from "~/types/Test";
import { DateFormat } from "~/utils/DateFormat";

@Component({
  components: { CardPanel, Plot, SelectTests },
})
export default class PanelParticipatinsHistory extends Vue {
  days: { date: Date; count: number }[] = [];
  loading = true;
  selectedTest: Test = new Test();

  daysInterval = { days: 2 };
  intervals = [
    { days: 1 },
    { days: 2 },
    { days: 3 },
    { days: 5 },
    { days: 7 },
    { days: 10 },
    { days: 30 },
  ];

  dateFormat = new DateFormat();

  @Prop({ default: "Histórico de participações" }) header!: string;
  @Prop() researchGroupId!: number;

  @Action(ACTION_GET_PARTICIPATIONS_PER_TIME)
  getParticipationsPerTime!: (payload: {
    researchGroupId: number;
    testId: number;
  }) => Promise<ParticipationCount[]>;

  get graphicData() {
    var trace1: { x: string[]; y: number[]; type: string } = {
      x: [],
      y: [],
      type: "scatter",
    };
    this.days.forEach((participationsInDate) => {
      let date = this.dateFormat.format(participationsInDate.date, "DD/MMMM");
      let count = participationsInDate.count;
      if (participationsInDate.date.getDate() % this.daysInterval.days == 0) {
        trace1.x.push(date);
        trace1.y.push(count);
      }
    });

    var data = [trace1];
    return data;
  }

  get plotLayout() {
    return {
      yaxis: {
        title: "Número de participações",
      },
      xaxis: {
        title: "Tempo",
      },
    };
  }

  async loadData() {
    try {
      this.loading = true;

      let days = (
        await this.getParticipationsPerTime({
          researchGroupId: this.researchGroupId,
          testId: this.selectedTest?.id,
        })
      ).map((day) => {
        return {
          date: new Date(day.year, day.month - 1, day.day),
          count: day.count,
        };
      });

      let firstDay = days[0];
      let lastDay = days[days.length - 1];
      let allDays = [];

      let date = firstDay.date;

      while (date.getTime() < lastDay.date.getTime()) {
        date = this.dateFormat.plusDay(date);
        let participationDay = days.find(
          (day) =>
            date.getDate() == day.date.getDate() &&
            date.getMonth() == day.date.getMonth() &&
            date.getFullYear() == day.date.getFullYear()
        );
        if (participationDay) {
          allDays.push({
            count: participationDay.count,
            date: date,
          });
        } else {
          allDays.push({
            count: 0,
            date: date,
          });
        }
      }

      this.days = allDays;
    } catch (e) {
      this.days = [];
    } finally {
      this.loading = false;
    }
  }

  mounted() {
    this.loadData();
  }
}
</script>