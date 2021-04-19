<template>
  <span>
    <json-view
      :data="json"
      :rootKey="options.rootObjectKey"
      :maxDepth="options.maxDepth"
    ></json-view>
  </span>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "nuxt-property-decorator";

class JsonTreeOptions {
  rootObjectKey!: string;
  maxDepth!: number;
}
@Component
export default class JsonTree extends Vue {
  @Prop({}) json!: Object;
  @Prop({
    default: () =>
      ({
        rootObjectKey: "Resposta",
        //maxDepth: 0,
      } as JsonTreeOptions),
  })
  options!: JsonTreeOptions;
}
</script>   
<style lang="scss">
.tree-view-item-key {
  color: #0e8bd2;
}
</style>