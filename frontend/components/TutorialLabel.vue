<template>
  <span v-show="item.isTutorial">
    <el-tooltip :open-delay="400" content="Itens de tutorial não contam pontos">
      <span>
        <span class="badge-tutorial"
          >Tutorial <i class="el-icon-question"
        /></span>
      </span>
    </el-tooltip>
  </span>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "nuxt-property-decorator";
import { Context } from "@nuxt/types";
import Item from "~/types/Item";
@Component
export default class TutorialLabel extends Vue {
  @Prop({}) item!: Item;
  async asyncData(ctx: Context) {}
}
</script>
<style lang="scss">
.badge-tutorial {
  background: #ffbc1b;
  color: white;
  border-radius: 3px;
  font-weight: bold;
  padding: 2px;
  font-size: 9pt;
}
</style>