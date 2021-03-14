<template>
  <div class="item-thumbnail">
    <slot name="start" />
    <thumbnail :src="item.thumbnail" width="150px" height="100px" />
    <div class="item-infos">
      <p class="title">
        <slot name="headline">
          {{ item.name }}
        </slot>
      </p>
      <p class="description">{{ item.description }}</p>
    </div>
    <!-- <thumbnail :src="item.thumbnail" /> -->
    <slot name="end" class="center-vertical" />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "nuxt-property-decorator";
import Item from "~/types/Item";
@Component
export default class ItemThumbnail extends Vue {
  @Prop() item!: Item;
}
</script>

<style lang="scss">
.item-thumbnail > div {
  margin: 0 10px;
}
.item-thumbnail {
  justify-content: center;
  line-height: 1.4em;
  display: flex;
  flex-flow: row nowrap;
  padding: 5px;

  .item-infos {
    justify-content: center;
    flex-grow: 1;
    padding: 6px;
    display: flex;
    flex-flow: column nowrap;
    .title {
      font-weight: bold;
      font-size: 14pt;
      text-align: left;
      padding: 0;
      border: none;
      margin: 0;
    }
    .description {
      word-break: keep-all;
    }
  }
}
</style>