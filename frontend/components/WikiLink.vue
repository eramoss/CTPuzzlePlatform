<template>
  <a
    style="margin: 0; text-decoration: none; font-weight: bold; color: #409fff"
    :href="computedHref"
    target="_blank"
    >{{ label }} <icon style="font-size: 12pt" name="open_in_new"
  /></a>
</template>
<script lang="ts">
import Vue from "vue";
import { Action, Component, Prop } from "nuxt-property-decorator";
import SiteConfig from "@/types/SiteConfig";
import { ACTION_GET_SITE_CONFIG } from "~/store/configs";
@Component
export default class WikiLink extends Vue {
  @Prop() href!: string;
  @Prop() label!: string;

  @Action(ACTION_GET_SITE_CONFIG) getSiteConfig!: () => Promise<SiteConfig>;

  siteConfig: SiteConfig = new SiteConfig();

  get computedHref() {
    let prefix = this.href.startsWith("http")
      ? ""
      : this.siteConfig?.docsLocation;
    return prefix + this.href;
  }

  async mounted() {
    this.siteConfig = await this.getSiteConfig();
  }
}
</script>