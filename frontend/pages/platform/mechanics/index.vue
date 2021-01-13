<template>
  <div class="left">
    <h2>Mecânicas</h2>
    <el-button type="primary" icon="el-icon-plus" @click="openDialog">
      Nova
    </el-button>
    <el-table>
      <el-table-column></el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogVisible" title="Edição de mecânica" width="90vw">
      <mechanic-form @cancel="closeDialog" />
    </el-dialog>
  </div>
</template>
<script>
import Vue from "vue";
import MechanicForm from "@/components/MechanicForm";
export default Vue.extend({
  head() {
    return {
      title: "Mecânicas",
    };
  },
  components: {
    MechanicForm,
  },
  data(){
    return {
      dialogVisible: false
    }
  },
  methods: {
    openDialog() {
      this.dialogVisible = true;
    },
    closeDialog(){
      this.dialogVisible = false;
    }
  },
});
</script>
