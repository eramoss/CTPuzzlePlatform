<template>
  <div>
    <div>
      {{ countLines }} linhas
      <span v-show="!countLines">{{ phraseWhenZeroLines }}</span>
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
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Ref, VModel, Watch } from "nuxt-property-decorator";

@Component
export default class SpreadSheet extends Vue {
  @VModel() csv!: string;
  @Prop({ default: 189 }) cols!: number;
  @Prop({ default: 20 }) rows!: number;
  @Prop({}) phraseWhenZeroLines!: string;

  @Ref() textarea!: HTMLInputElement;

  scrollToStart(){
      this.textarea.scrollTo(0, 0);
  }

  get countLines(): number {
    let total = this.csv.split("\n").filter((line) => line.length > 0).length;
    total = total - 1; //header
    if (total < 0) {
      total = 0;
    }
    return total;
  }

  handleKeydown(event: KeyboardEvent) {
    let keys = ["PageUp", "PageDown"];
    if (keys.indexOf(event.key) > -1) {
      event.preventDefault();
    }
    if (event.key == "Home") {
      this.textarea.scrollTo(0, this.textarea.scrollTop);
    }
    if (event.key == "PageDown") {
      this.textarea.scrollTo(0, this.textarea.scrollTop + 100);
    }
    if (event.key == "PageUp") {
      this.textarea.scrollTo(0, this.textarea.scrollTop - 100);
    }
  }
}
</script>
<style lang="scss">
.text-area-spread-sheet {
  font-size: 10pt;
  //padding: 15px;
  line-height: 1em;
  width: 100%;
}
</style>