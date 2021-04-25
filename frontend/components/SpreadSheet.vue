<template>
  <div>
    <textarea
      class="text-area-spread-sheet"
      ref="textarea"
      v-model="csv"
      :rows="rows"
      :cols="cols"
      @keydown="handleKeydown"
      wrap="off"
    />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Ref, VModel } from "nuxt-property-decorator";

@Component
export default class SpreadSheet extends Vue {
  @VModel() csv!: string;
  @Prop({ default: 189 }) cols!: number;
  @Prop({ default: 20 }) rows!: number;

  @Ref() textarea!: HTMLInputElement;

  handleKeydown(event: KeyboardEvent) {
  }
}
</script>
<style lang="scss">
.text-area-spread-sheet {
  width: 100%;
}
</style>