<template>
  <div>
    <!-- <textarea v-model="code" :style="{ width: width, height: height }"/> -->
    <MonacoEditor
      class="editor"
      v-model="code"
      :options="options"
      :style="{ width: width, height: height }"
    />
    <!-- <no-ssr>
      <div ref="container"></div>
    </no-ssr> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
//@ts-ignore
import MonacoEditor from "vue-monaco";
import { Component, Prop, Ref, VModel } from "nuxt-property-decorator";

@Component({
  components: {
    MonacoEditor,
  },
})
export default class CodeEditor extends Vue {
  @Prop({ default: "100%" }) width!: string;
  @Prop({ default: "500px" }) height!: string;
  @VModel({ default: "const code = {}" }) code!: string;

  get options() {
    return {
      scrollBeyondLastLine: false,
      lineNumbers: "off",
      theme: "vs-light", //theme: "vs-dark",
      roundedSelection: true,
      language: 'typescript'
    };
  }

  @Ref("container")
  container!: HTMLElement;

  mounted() {
    if (process.browser) {
      /* monaco.editor.create(this.container, {
        value: "function hello() {\n\talert('Hello world!');\n}",
        language: "typescript",
      }); */
    }
  }
}
</script>

<style lang="scss">
.editor {
  border: 1px solid #ccc;
}
.editor:hover {
  border: 1px solid #999;
}
.el-form-item.is-error {
  .editor {
    border: 1px solid red;
  }
}
</style>
