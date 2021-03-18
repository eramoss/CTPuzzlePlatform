<template>
  <div style="width: 100%">
    <!-- <textarea v-model="code" :style="{ width: width, height: height }"/> -->
    <span class="editorTitle-editor" v-show="editorTitle">
      <div>
        {{ editorTitle }}
        <i v-if="readonly">(apenas leitura)</i>
      </div>
      <div class="slot-bar">
        <slot name="bar" />
      </div>
    </span>
    <MonacoEditor
      class="editor"
      v-model="code"
      @editorWillMount="prepareEditor"
      ref="editor"
      :options="options"
      :style="{ height: height }"
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
import eventBus from "~/utils/eventBus";

@Component({
  components: {
    MonacoEditor,
  },
})
export default class CodeEditor extends Vue {
  @Prop({ default: "100%" }) width!: string;
  @Prop({ default: "500px" }) height!: string;
  @Prop({ default: "typescript" }) language!: string;
  @Prop() editorTitle!: string;
  @VModel({ default: "const code = {}" }) code!: string;

  @Ref("editor")
  editor!: MonacoEditor;

  @Prop({ default: false }) readonly!: boolean;
  @Prop({ default: 17 }) fontSize!: number;

  // https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorminimapoptions.html
  get options() {
    return {
      scrollBeyondLastLine: false,
      lineNumbers: "off",
      //theme: "vs-light",
      //theme: "vs-dark",
      readOnly: this.readonly,
      roundedSelection: true,
      language: this.language,
      fontSize: this.fontSize,
      minimap: {
        enabled: false,
      },
    };
  }

  @Ref("container")
  container!: HTMLElement;

  resize() {
    this.$nextTick(() => {
      this.editor?.editor?.layout();
    });
  }

  mounted() {
    eventBus.$on("resize", this.resize);
    if (process.browser) {
      /* monaco.editor.create(this.container, {
        value: "function hello() {\n\talert('Hello world!');\n}",
        language: "typescript",
      }); */
    }
  }

  prepareEditor(monaco: any) {
    /* monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: "ES2018",
      module: "ESNext",
      moduleResolution: "Node",
      lib: ["ESNext", "ESNext.AsyncIterable", "DOM"],
      experimentalDecorators: true,
      esModuleInterop: true,
      allowJs: true,
      sourceMap: true,
      strict: true,
      noEmit: true,
    }); */
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
.suggest-widget {
  //display: none !important;
  border-width: 0 !important;
}
.editorTitle-editor {
  background: #f7f7f7;
  color: #444;
  margin: 0;
  padding: 0px;
  height: 2em;
  line-height: 2em;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  padding-left: 0.5em;
  padding-right: 0.2em;
}
.slot-bar {
  .el-button {
    padding: 4px;
    font-weight: bold;
  }
}
</style>
