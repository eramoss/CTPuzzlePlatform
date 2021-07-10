<template>
  <div class="panel shadow left bottom-marged r-function-panel">
    <h2>{{ rFunction.name }}</h2>
    <p class="description">{{ rFunction.description }}</p>
    <pre class="code">{{ rFunction.code }}</pre>

    <p class="source">
      Fonte:
      <a
        target="_blank"
        @click.stop="openSource(rFunction.source)"
        :href="rFunction.source"
        >{{ rFunction.source }}</a
      >
    </p>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "nuxt-property-decorator";
import { Context } from "@nuxt/types";
import RFunctionCode from "~/types/RFunctionCode";
@Component
export default class RFunctionPreview extends Vue {
  @Prop({}) rFunction!: RFunctionCode;
  async asyncData(ctx: Context) {}

  openSource(source: string) {
    window.open(source, "_blank");
  }
}
</script>
<style lang="scss">
$gray: rgba(0, 0, 0, 0.4);

.r-function-panel {
  display: block;
  border: 2px solid white;
  transition: border 100ms;

  cursor: pointer;

  .description {
    color: $gray;
  }
  .code {
    color: rgba(11, 133, 92, 0.5);
  }
  .source {
    margin-top: 20px;
    color: $gray;
    a {
      color: $gray;
    }
  }
}
.r-function-panel:hover {
  border: 2px solid $gray;

  .code {
    color: rgba(11, 133, 92, 1);
  }
  .description {
    color: rgba(0, 0, 0, 0.6);
  }
}
.r-function-panel:active {
  border: 2px solid #65b1ff;
}
</style>