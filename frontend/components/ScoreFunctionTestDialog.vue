<template>
  <el-dialog
    :visible.sync="visible"
    top="10px"
    width="95%"
    id="score-fn-dialog"
    title="Playground para teste de função de escore"
  >
    <div style="height: 10px; width: 100px"></div>
    <score-function-test-form v-model="mechanic" :showTestCases="true" />
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
  visible: boolean = true;
  @VModel() mechanic!: Mechanic;

  show() {
    this.visible = true;
  }
}
</script>
<style lang="scss">
#score-fn-dialog {
  max-height: 100vh i !important;
  //border: 1px solid green;
  .el-dialog__header {
    background: white;
    width: 100%;
    height: 60px;
    z-index: 100;
    top: 0;
    left: 0;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px 0px !important;
    padding: 20px;
    position: relative;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
  }
  .el-dialog__body {
    max-height: 90vh;
    overflow-y: scroll;
    //border: 1px solid red;
  }
}
</style>