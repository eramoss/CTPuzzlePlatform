<template>
  <div>
    <div class="back-gradient" v-show="focusMode" @click="focusEditor"></div>
    <div
      style="width: 100%"
      ref="code-container"
      class="editor-container"
      :class="{ 'focus-mode': focusMode, 'big-shadow': focusMode }"
    >
      <b class="editor-lang">{{ language }}</b>
      <div class="flex-row">
        <h2>
          <span v-show="focusMode || forceShowBigTitle">{{ editorTitle }}</span>
        </h2>
        <el-button
          type="text"
          @click="focusEditor"
          :title="focusMode ? 'Minimizar' : 'Maximizar'"
        >
          <icon :name="focusMode ? 'close_fullscreen' : 'open_in_full'" />
        </el-button>
      </div>
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
        @editorDidMount="editorDidMount"
        ref="editor"
        :options="options"
        :style="{ height: `${calculedHeight}px` }"
      />
      <div class="height-btns" v-if="useHeightControls && !focusMode">
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
  </div>
</template>

<script lang="ts">
import Vue from "vue";
//@ts-ignore
import MonacoEditor from "vue-monaco";
import { Component, Prop, Ref, VModel, Watch } from "nuxt-property-decorator";
import eventBus from "~/utils/eventBus";

@Component({
  components: {
    MonacoEditor,
  },
})
export default class CodeEditor extends Vue {
  focusMode: boolean = false;
  heightPixels = 500;
  bkpHeightPixels = 0;
  bkpUseHeightControls = false;
  @Prop({ default: "100%" }) width!: string;
  @Prop({ default: "500px" }) height!: string;
  @Prop({ default: "typescript" }) language!: string;
  @Prop({}) editorTitle!: string;
  @Prop() uniqueId!: string;
  @Prop({ default: false }) useHeightControls!: boolean;
  @Prop({ default: false }) required!: boolean;
  @Prop({ default: false }) forceShowBigTitle!: boolean;
  @VModel({ default: "const code = {}" }) code!: string;

  @Ref("editor")
  editor!: MonacoEditor;

  monaco: any;

  @Prop({ default: false }) readonly!: boolean;
  @Prop({ default: 17 }) fontSize!: number;
  @Prop({ default: false }) openOnClick!: boolean;

  // https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorminimapoptions.html

  get options() {
    let normalModeOptions = {
      scrollBeyondLastLine: false,
      lineNumbers: "off",
      //theme: "vs-light",
      //theme: "vs-dark",
      readOnly: this.readonly,
      roundedSelection: true,
      automaticLayout: true,
      language: this.language,
      fontSize: this.appliedFontSize,
      minimap: {
        enabled: false,
      },
      scrollbar: {
        handleMouseWheel: true,
        alwaysConsumeMouseWheel: false,
      },
    };
    let focusModeOptions = {
      scrollBeyondLastLine: false,
      lineNumbers: "on",
      //theme: "vs-light",
      //theme: "vs-dark",
      readOnly: this.readonly,
      roundedSelection: true,
      automaticLayout: true,
      language: this.language,
      fontSize: this.appliedFontSize,
      minimap: {
        enabled: false,
      },
      scrollbar: {
        handleMouseWheel: true,
        alwaysConsumeMouseWheel: true,
      },
    };
    return this.focusMode ? focusModeOptions : normalModeOptions;
  }

  get appliedFontSize() {
    return this.focusMode ? 18 : this.fontSize;
  }

  @Ref("container")
  container!: HTMLElement;

  get calculedHeight() {
    let height =
      (this.code.split("\n").length + 1) * this.appliedFontSize * 1.328;
    if (this.useHeightControls || this.focusMode) {
      height = this.heightPixels;
    }
    return height;
  }

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

  updateUseHeightControls(value: boolean) {
    this.$emit("update:useHeightControls", value);
  }

  focusEditor() {
    this.focusMode = !this.focusMode;

    if (!this.focusMode) {
      window.removeEventListener("keydown", this.listenWindowEscape);
      this.updateUseHeightControls(this.bkpUseHeightControls);
      this.heightPixels = this.bkpHeightPixels;
    }

    if (this.focusMode) {
      window.addEventListener("keydown", this.listenWindowEscape);
      this.bkpUseHeightControls = this.useHeightControls;
      this.bkpHeightPixels = this.heightPixels;
      this.updateUseHeightControls(true);

      this.$nextTick(() => {
        let container = this.$refs["code-container"];
        //@ts-ignore
        this.heightPixels = container.offsetHeight - 150;
      });
    }
    this.updateOptions();
    this.resize();
  }

  updateOptions() {
    this.editor?.editor?.updateOptions(this.options);
  }

  listenWindowEscape(keyEvent: KeyboardEvent) {
    if (keyEvent.key == "Escape") {
      this.onEscape();
    }
  }

  mounted() {
    eventBus.$on("resize", this.resize);
  }

  onSave() {
    this.$emit("onSave");
  }

  onEscape() {
    this.$emit("onEscape");
    this.focusEditor();
  }

  onMouseDown() {
    this.$emit("onMouseDown");
  }

  onMouseUp() {
    this.$emit("onMouseUp");
    if (!this.focusMode && this.openOnClick) {
      this.focusEditor();
    }
  }

  editorDidMount(editor: any) {
    // https://github.com/Microsoft/monaco-editor/issues/25
    // https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.istandalonecodeeditor.html#addcommand
    editor.addCommand(
      this.monaco.KeyMod.CtrlCmd | this.monaco.KeyCode.KEY_S,
      () => {
        this.onSave();
      }
    );

    /* editor.addCommand(this.monaco.KeyCode.Escape, () => {
      this.onEscape();
    }); */

    editor.onMouseDown(this.onMouseDown);
    editor.onMouseUp(this.onMouseUp);
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

    this.monaco = monaco;
  }
}
</script>

<style lang="scss">
.back-gradient {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: #13172699;
  z-index: 200 !important;
}
.editor-container.focus-mode {
  //transition: 200ms all;
  z-index: 300 !important;
  position: fixed;
  border-radius: 10px;
  padding: 20px;
  left: 10%;
  top: 5%;
  width: 80% !important;
  height: 90% !important;
  background: white;
  overflow: hidden;

  .editor {
    z-index: inherit;
  }

  .editor-lang {
    display: none;
  }
}
.editor-container {
  position: relative;
  .editor {
    border: 1px solid #aaa;
  }
  .editor:hover {
    //border: 2px solid #999;
  }
  .editor-lang {
    font-size: 10pt;
    color: rgba(0, 0, 0, 0.3);
    position: absolute;
    z-index: 1;
    right: 25px;
    bottom: 0px;
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
      //border: 1px solid red;
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
