<template>
  <div>
    <!-- <pre>
      {{ code }}
    </pre> -->
    <MonacoEditor
      class="editor"
      v-model="code"
      language="typescript"
      :style="{ width: width, height: height }"
    />
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
//@ts-ignore
import MonacoEditor from "vue-monaco";
import { Component, Prop, VModel } from 'vue-property-decorator';

@Component({
  components: {
    MonacoEditor
  }
})
export default class CodeEditor extends Vue {
  @Prop({default:'100%'}) width!:string
  @Prop({default:'260px'}) height!:string
  @VModel({default:'const code = {}'}) code!:string
}
</script>

<style lang="scss">
.editor {
  border: 1px solid #ccc;
}
.editor:hover{
  border: 1px solid #999;
}
.el-form-item.is-error {
  .editor {
    border: 1px solid red;
  }
}
</style>
