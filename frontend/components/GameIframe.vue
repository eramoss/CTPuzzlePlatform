<template>
  <div>
    <gradient-iframe :url="url">
      <el-button type="success" class="btn-big shadow">Jogar!</el-button>
    </gradient-iframe>
  </div>
</template>
<script>
import Vue from "vue";
import GradientIframe from "@/components/GradientIframe";
export default Vue.extend({
  props: {
    url: {
      required: true,
    },
  },
  components: {
    GradientIframe,
  },
});
</script>
