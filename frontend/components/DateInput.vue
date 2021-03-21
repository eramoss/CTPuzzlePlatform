<template>
  <div>
    <el-input
      v-model="dateString"
      v-mask="'##/##/####'"
      placeholder="DD/MM/YYYY"
    ></el-input>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component, VModel, Watch } from "nuxt-property-decorator";
import { DateFormat } from "~/utils/DateFormat";

@Component
export default class DateInput extends Vue {
  @VModel() date!: Date;

  dateFormat = new DateFormat();

  dateString: string = "";

  @Watch("dateString")
  onChangeDateString() {
    let date = this.dateFormat.parse(this.dateString, "DD/MM/YYYY");
    this.$emit("input", date);
  }

  mounted() {
    if (this.date) {
      let formatResult = this.dateFormat.format(this.date, "DD/MM/YYYY");
      if (formatResult) {
        this.dateString = formatResult;
      }
    }
  }
}
</script>