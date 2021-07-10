<template>
  <el-dialog title="Biblioteca de funções" :visible.sync="visible">
    <p>Clique para selecionar a função</p>
    <div class="top-marged">
      <div
        v-for="rFunction in rFunctions"
        :key="rFunction.name"
        @click="onChooseFunction(rFunction)"
      >
        <r-function-preview :rFunction="rFunction"></r-function-preview>
      </div>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "nuxt-property-decorator";
import { Context } from "@nuxt/types";
import RFunctionCode, { rPredefinedFunctions } from "@/types/RFunctionCode";
import RFunctionPreview from "@/components/RFunctionPreview.vue";
@Component({
  components: {
    RFunctionPreview,
  },
})
export default class FunctionsLibrary extends Vue {
  @Prop({}) selectedVariableName!: string;
  visible: boolean = false;
  async asyncData(ctx: Context) {}

  rFunctions: RFunctionCode[] = rPredefinedFunctions;

  show() {
    this.visible = true;
  }

  close() {
    this.visible = false;
  }

  onChooseFunction(rFunctionCode: RFunctionCode) {
    this.$emit("onChooseFunction", rFunctionCode);
    this.close();
  }
}
</script>