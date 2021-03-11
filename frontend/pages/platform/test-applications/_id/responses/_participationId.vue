<template>
  <div class="left">
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/platform' }">
        Plataforma
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/platform/test-applications' }">
        Aplicações
      </el-breadcrumb-item>
      <el-breadcrumb-item
        :to="{ path: `/platform/test-applications/${$route.params.id}` }"
      >
        {{ participation.application.name }}
      </el-breadcrumb-item>
      <el-breadcrumb-item> Respostas </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="panel">
      <h2>Respostas</h2>
      <div v-if="participation">
        <item-responses-screen :participation="participation" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component } from "nuxt-property-decorator";
import { Context } from "@nuxt/types";
import Participation from "~/types/Participation";
import ItemResponsesScreen from "~/components/ItemResponsesScreen.vue";

@Component({
  components: {
    ItemResponsesScreen,
  },
})
export default class ItemResponsesList extends Vue {
  participation!: Participation;

  async asyncData(ctx: Context) {
    let participation = await ctx.store.dispatch(
      "participations/getById",
      ctx.params.participationId
    );
    console.log(participation);
    return {
      participation,
    };
  }
}
</script>