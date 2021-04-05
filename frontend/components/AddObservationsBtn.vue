<template>
  <span class="observation-component">
    <el-tooltip effect="light" placement="left">
      <template slot="content">
        <pre>{{ observations || "Observações. Clique para editar" }}</pre>
      </template>
      <el-button @click="showDialog" type="text">
        <span class="text-part">{{ observationsTrimmed }}</span>
      </el-button>
    </el-tooltip>
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
import { Component, Prop, Ref, VModel } from "nuxt-property-decorator";
import { Context } from "@nuxt/types";
import { ElInput } from "element-ui/types/input";
@Component
export default class AddObservationsBtn extends Vue {
  @VModel({ default: "Observação. Edite o texto e clique em salvar" })
  observations!: string;
  @Ref()
  textArea!: ElInput;
  dialogVisible: boolean = false;

  closeDialog() {
    this.dialogVisible = false;
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
    return (this.observations || "Observações").substr(0, 6) + "...";
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