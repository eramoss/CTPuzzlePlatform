<template>
  <div>
    <card-panel :header="header" :loading="loading">
      <template slot="info">
        Mostra o número de participações diárias em todos os testes.
      </template>

      <div slot="top-right">
        <el-tooltip content="Intervalo em dias" effect="light" placement="top">
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
      <plot :data="graphicData" :layout="plotLayout" />
    </card-panel>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Action, Component, Prop } from "nuxt-property-decorator";
import ParticipationCount from "~/types/ParticipationCount";
import CardPanel from "~/components/CardPanel.vue";
import Plot from "~/components/graphics/Plot.vue";
import { ACTION_GET_PARTICIPATIONS_PER_TIME } from "~/store/participations";
import { DateFormat } from "~/utils/DateFormat";

@Component({
  components: { CardPanel, Plot },
})
export default class PanelParticipatinsHistory extends Vue {
  days: { date: Date; count: number }[] = [];
  loading = true;

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
  getParticipationsPerTime!: (
    researchGroupId: number
  ) => Promise<ParticipationCount[]>;

  get graphicData() {
    var trace1: { x: string[]; y: number[]; type: string; } = {
      x: [],
      y: [],
      type: "scatter",
    };
    this.days.forEach((participationsInDate) => {
      let date = this.dateFormat.format(
        participationsInDate.date,
        "DD/MMMM"
      );
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

  async mounted() {
    try {
      this.loading = true;
      let days = await this.getParticipationsPerTime(this.researchGroupId);
      days
        .sort((a, b) => a.day - b.day)
        .sort((a, b) => a.month - b.month)
        .sort((a, b) => a.year - b.year);

      let firstDay = days[0];
      debugger;
      let lastDay = days[days.length - 1];

      let date = new Date(firstDay.year, firstDay.month, firstDay.day);

      let lastDayDate = new Date(lastDay.year, lastDay.month - 1, lastDay.day);

      let allDays = [{ date: date, count: firstDay.count }];

      while (date.getTime() < lastDayDate.getTime()) {
        date = this.dateFormat.plusDay(date);
        let participationDay = days.find(
          (day) =>
            day.day == date.getDate() &&
            date.getMonth() == day.month - 1 &&
            date.getFullYear() == day.year
        );
        if (participationDay) {
          allDays.push({
            count: participationDay.count,
            date: new Date(
              participationDay.year,
              participationDay.month - 1,
              participationDay.day
            ),
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
}
</script>