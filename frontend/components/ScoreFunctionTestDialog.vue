<template>
  <el-dialog
    :visible.sync="visible"
    top="10px"
    width="95%"
    title="Playground para teste de função de escore"
  >
    <score-function-test-form v-model="mechanic" :showTestFunction="true" />
  </el-dialog>
</template>
<script lang="ts">
import {
  Action,
  Component,
  Prop,
  VModel,
  Watch,
} from "nuxt-property-decorator";
import Mechanic from "~/types/Mechanic";
import CodeEditor from "~/components/CodeEditor.vue";
import ScoreFunctionTestForm from "~/components/ScoreFunctionTestForm.vue";
import Vue from "vue";

@Component({
  components: {
    ScoreFunctionTestForm,
    CodeEditor,
  },
})
export default class ScoreFunctionTestDialog extends Vue {
  visible: boolean = false;
  @VModel() mechanic!: Mechanic;

  show() {
    this.visible = true;
  }
}
</script>
<style lang="scss">
</style>