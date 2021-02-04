<template>
  <span class="FormItemLabel"><i v-show="required" class="asteristic"></i>{{ label }}</span>
</template>
<script lang="ts">
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import Vue from "vue";

@Component
export default class FormItemLabel extends Vue {

  @Prop({default: ''}) label!: string
  @Prop({default: false}) required!: boolean

}
</script>
<style lang="scss">
.asteristic::before {
  content: '* ';
  font-style: normal;
  color: red;
}

.FormItemLabel {
  color: #606266;
}
</style>
