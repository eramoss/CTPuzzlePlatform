<template>
  <span class="observation-component" :title="observations">
    <el-button @click="showDialog" type="text" >
      <span class="text-part">{{ observationsTrimmed }}</span>
    </el-button>
    <el-button
      size="small"
      style="font-weight: bold"
      type="text"
      icon="el-icon-edit"
      @click="showDialog"
    >
    </el-button>
    <el-dialog title="Observações" :visible.sync="dialogVisible">
      <el-input
        ref="textArea"
        type="textarea"
        rows="20"
        v-model="observations"
      ></el-input>
      <template slot="footer">
        <el-button type="primary" @click="closeDialog" icon="el-icon-check"
          >Concluir observações</el-button
        >
      </template>
    </el-dialog>
  </span>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Ref, VModel, Watch } from "nuxt-property-decorator";
import { ElInput } from "element-ui/types/input";
@Component
export default class AddObservationsBtn extends Vue {
  @Prop({ default: "Observação. Edite o texto e clique em salvar" })
  value!: string;
  @Ref()
  textArea!: ElInput;

  observations: string = "";
  dialogVisible: boolean = false;

  @Watch("value", { immediate: true })
  valueChanged() {
    this.observations = this.value || "";
  }

  closeDialog() {
    this.dialogVisible = false;
    this.$emit("input", this.observations);
    this.$emit("update:value", this.observations);
    this.$emit("save", this.observations);
  }

  showDialog() {
    this.dialogVisible = true;
    this.$nextTick(() => {
      if (!this.observations) {
        this.observations = "Minha observação";
      }
      this.textArea.focus();
      this.textArea.select();
    });
  }

  get observationsTrimmed(): string {
    let trim = "Observações";
    if (this.value) {
      if (this.value.length) {
        trim = this.value.substr(0, 6) + "...";
      }
    }
    return trim;
  }
}
</script>
<style lang="scss">
.observation-component {
  cursor: pointer;
  margin: auto 20px;
  .text-part {
    font-weight: bold;
  }
}
</style>