<template>
  <div>
    <el-select
      v-model="selectedTest"
      @clear="$emit('clear')"
      placeholder="Filtro por testes"
      value-key="id"
      filterable
      clearable
    >
      <el-option
        v-for="test in tests"
        :key="test.id"
        :value="test"
        :label="test.name"
      >
      </el-option>
    </el-select>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "nuxt-property-decorator";
import { Context } from "@nuxt/types";
import Test from "~/types/Test";
import { ACTION_GET_TESTS } from "~/store/tests";
@Component
export default class SelectTests extends Vue {
  tests: Test[] = [];

  @Prop() value!: Test;
  selectedTest: Test = new Test();

  @Watch("value", { immediate: true })
  onUpdateValue() {
    this.selectedTest = this.value;
  }

  @Watch("selectedTest")
  onChangeTest() {
    this.$emit("input", this.selectedTest);
  }

  mounted() {
    this.loadTests();
  }

  async loadTests() {
    this.tests = await this.$store.dispatch(ACTION_GET_TESTS);
  }
}
</script>