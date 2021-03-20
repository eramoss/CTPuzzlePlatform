<template>
  <div style="width: 100%" class="editor-container">
    <!-- <textarea v-model="code" :style="{ width: width, height: height }"/> -->
    <span class="editorTitle-editor" v-show="editorTitle">
      <div>
        <form-item-label :label="editorTitle" :required="required" />
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
      :style="{ height: `${heightPixels}px` }"
    />
    <div class="height-btns">
      <el-button
        title="Adicionar linhas"
        @click="increaseHeight"
        type="text"
        size="small"
        >+ linhas
      </el-button>
      <el-button
        title="Remover linhas"
        @click="decreaseHeight"
        type="text"
        size="small"
      >
        - linhas
      </el-button>
    </div>

    <!-- <no-ssr>
      <div ref="container"></div>
    </no-ssr> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
//@ts-ignore
import MonacoEditor from "vue-monaco";
import { Component, Prop, Ref, VModel, Watch } from "nuxt-property-decorator";
import eventBus from "~/utils/eventBus";
import { CompilerOptions } from "vue-template-compiler";

@Component({
  components: {
    MonacoEditor,
  },
})
export default class CodeEditor extends Vue {
  heightPixels = 500;
  @Prop({ default: "100%" }) width!: string;
  @Prop({ default: "500px" }) height!: string;
  @Prop({ default: "typescript" }) language!: string;
  @Prop({ default: "Editor" }) editorTitle!: string;
  @Prop() uniqueId!: string;
  @Prop({ default: false }) required!: boolean;
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

  @Watch("height", { immediate: true })
  onChangeHeight() {
    this.heightPixels = parseInt(this.height.replace(/\D*/g, ""));
  }

  increaseHeight() {
    this.heightPixels += 100;
    this.resize();
    this.storeHeight();
  }

  decreaseHeight() {
    this.heightPixels -= 100;
    this.resize();
    this.storeHeight();
  }

  get cookieId() {
    return `height_code_editor_${this.uniqueId}`;
  }

  storeHeight() {
    if (this.uniqueId) {
      localStorage.setItem(this.cookieId, this.heightPixels + "");
    }
  }

  recoverHeight() {
    if (process.browser) {
      let pixelsFromCookie = localStorage.getItem(this.cookieId);
      if (pixelsFromCookie) {
        this.heightPixels = parseInt(pixelsFromCookie);
      }
    }
  }

  mounted() {
    eventBus.$on("resize", this.resize);
    this.recoverHeight();
  }

  prepareEditor(monaco: any) {
    // validation settings
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });

    // compiler options
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: "es2017",
      strict: true,
      allowNonTsExtensions: true,
    });
  }
}
</script>

<style lang="scss">
.editor-container {
  .editor {
    border: 1px solid #ccc;
  }
  .editor:hover {
    border-bottom: 2px solid #999;
  }
  .height-btns {
    width: 100%;
    text-align: left;
    line-height: 1em;
    transition: opacity 1s;
    opacity: 0.5;
    .el-button {
      color: #777;
      icon {
        font-size: 9pt;
      }
    }
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
}
.editor-container:hover {
  .height-btns {
    opacity: 1;
  }
}
</style>
