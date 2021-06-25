<template>
  <div>
    <el-button
      :disabled="disabled"
      @click="visible = true"
      title="Agrupar dados somando ou calculando a média de variável"
      >{{ buttonText }}
      <span v-show="groups.length && applied"
        >({{ groups.length }})</span
      ></el-button
    >
    <el-dialog title="Agrupar" :visible.sync="visible">
      <div v-for="group in groups" :key="group.id">
        <div class="phrase">
          Calcular <b>{{ group.onGroupDoWhat.name || "___" }}</b> de
          <b>{{ group.groupWhat || "___" }}</b> agrupado por
          <b>{{ group.groupBy || "___" }}</b>
        </div>
        <div class="flex-row">
          <el-select
            v-model="group.onGroupDoWhat"
            placeholder="Cálculo"
            :filterable="true"
            value-key="name"
          >
            <el-option
              :key="groupOp.name"
              v-for="groupOp in onGroupDoWhatAvailableOperations"
              :value="groupOp"
              :label="groupOp.name"
            ></el-option>
          </el-select>
          <el-select
            v-model="group.groupWhat"
            placeholder="Variável 1"
            :filterable="true"
          >
            <el-option
              :key="header"
              v-for="header in headers"
              :value="header"
              :label="header"
            ></el-option>
          </el-select>
          <el-select
            v-model="group.groupBy"
            placeholder="Variável 2"
            :filterable="true"
          >
            <el-option
              :key="header"
              v-for="header in headers"
              :value="header"
              :label="header"
            ></el-option>
          </el-select>
          <el-button
            class="el-icon-close"
            @click="remove(group)"
            title="Remover"
            type="text"
          ></el-button>
        </div>
      </div>
      <div>
        <el-button icon="el-icon-plus" @click="addTransform" type="text"
          >Adicionar agrupamento</el-button
        >
      </div>

      <div slot="footer">
        <el-button type="primary" @click="transformAndHide">Agrupar</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "nuxt-property-decorator";
import {
  availableGroupOperations,
  csvToCsvData,
  groupCsvData,
} from "~/types/CsvData";
import { TransformOperation } from "~/types/TransformOperation";
import { v4 as uuidv4 } from "uuid";
@Component
export default class StatisticsTransform extends Vue {
  visible = false;
  groups: TransformOperation[] = [];
  applied = false;

  @Prop() appliedTransforms!: TransformOperation[];
  @Prop() headers!: string[];
  @Prop() csv!: string;
  @Prop({ default: "Agrupar" }) buttonText!: string;
  @Prop({ default: false }) disabled!: boolean;

  @Watch("appliedTransforms", { immediate: true }) watchAppliedTransforms() {
    if (this.appliedTransforms) {
      this.groups = [...this.appliedTransforms];
    }
  }

  undoTransform() {
    this.groups.splice(0);
  }

  addTransform() {
    let transform = new TransformOperation();
    transform.id = uuidv4();
    this.groups.push(transform);
  }

  remove(group: TransformOperation) {
    let index = this.groups.indexOf(group);
    this.groups.splice(index, 1);
  }

  onGroupDoWhatAvailableOperations = availableGroupOperations;

  hide() {
    this.visible = false;
  }

  transformAndHide() {
    this.transform();
    this.hide();
  }

  transform() {
    let csvData = csvToCsvData(this.csv);
    this.groups.forEach((group) => {
      csvData = groupCsvData(
        csvData,
        group.groupBy,
        group.groupWhat,
        group.onGroupDoWhat
      );
    });
    if (csvData && this.groups.length) {
      /* if (!this.groups.length) {
        this.$emit("reload");
      } */
      this.$emit("onUpdateTransforms", this.groups);
      this.$emit("onUpdateCsvData", csvData);
      this.applied = true;
    }
  }
}
</script>
<style lang="scss">
.item-label {
  word-break: keep-all;
  padding: 6px;
  text-align: center;
}
</style>